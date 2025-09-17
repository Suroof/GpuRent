<template>
  <div class="user-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
      <p class="page-description">管理平台用户信息和权限</p>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="search-area">
        <NInput
          v-model:value="searchQuery"
          placeholder="搜索用户名、邮箱或姓名"
          clearable
          style="width: 300px"
          @input="handleSearch"
        >
          <template #prefix>
            <NIcon>
              <Search />
            </NIcon>
          </template>
        </NInput>

        <NSelect
          v-model:value="statusFilter"
          placeholder="状态筛选"
          clearable
          style="width: 120px"
          :options="statusOptions"
          @update:value="handleFilter"
        />

        <NSelect
          v-model:value="roleFilter"
          placeholder="角色筛选"
          clearable
          style="width: 120px"
          :options="roleOptions"
          @update:value="handleFilter"
        />
      </div>

      <div class="action-buttons">
        <NButton type="primary" @click="handleAddUser">
          <template #icon>
            <NIcon>
              <Add />
            </NIcon>
          </template>
          添加用户
        </NButton>

        <NButton type="error" :disabled="!hasSelection" @click="handleBatchDelete">
          <template #icon>
            <NIcon>
              <TrashBin />
            </NIcon>
          </template>
          批量删除
        </NButton>
      </div>
    </div>

    <!-- 用户表格 -->
    <NCard>
      <NDataTable
        ref="tableRef"
        :columns="columns"
        :data="users"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        :row-props="rowProps"
        @update:checked-row-keys="handleSelection"
      />
    </NCard>

    <!-- 用户表单弹窗 -->
    <UserFormModal
      v-model:visible="formModalVisible"
      :user="editingUser"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard,
  NInput,
  NSelect,
  NButton,
  NIcon,
  NDataTable,
  NTag,
  NAvatar,
  NSpace,
  NTooltip,
  useMessage,
  useDialog,
  type DataTableColumns
} from 'naive-ui'
import { Search, Add, TrashBin, Eye, Create, Ban, Checkmark } from '@vicons/ionicons5'
import UserFormModal from '@/components/business/UserFormModal.vue'
import { UserAPI } from '@/api/user'
import type { User, UserListParams } from '@/api/types'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()

// 响应式数据
const loading = ref(false)
const users = ref<User[]>([])
const searchQuery = ref('')
const statusFilter = ref<'active' | 'inactive' | null>(null)
const roleFilter = ref<'user' | 'admin' | null>(null)
const selectedKeys = ref<string[]>([])
const formModalVisible = ref(false)
const editingUser = ref<User | null>(null)

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: [10, 20, 50],
  showSizePicker: true,
  onUpdatePage: (page: number) => {
    pagination.page = page
    loadUsers()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadUsers()
  }
})

// 筛选选项
const statusOptions = [
  { label: '活跃', value: 'active' },
  { label: '禁用', value: 'inactive' }
]

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' }
]

// 计算属性
const hasSelection = computed(() => selectedKeys.value.length > 0)

// 表格列配置
const columns: DataTableColumns<User> = [
  {
    type: 'selection'
  },
  {
    title: '用户',
    key: 'user',
    render: (row) =>
      h(NSpace, { align: 'center' }, [
        h(
          NAvatar,
          {
            size: 'small',
            src: row.avatar,
            fallbackSrc: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
          },
          { default: () => row.username.charAt(0).toUpperCase() }
        ),
        h('div', [
          h('div', { class: 'font-medium' }, row.username),
          h('div', { class: 'text-gray-500 text-sm' }, row.email)
        ])
      ])
  },
  {
    title: '姓名',
    key: 'realName',
    render: (row) => row.realName || '-'
  },
  {
    title: '角色',
    key: 'role',
    render: (row) =>
      h(
        NTag,
        {
          type: row.role === 'admin' ? 'error' : 'default',
          size: 'small'
        },
        { default: () => (row.role === 'admin' ? '管理员' : '普通用户') }
      )
  },
  {
    title: '状态',
    key: 'status',
    render: (row) =>
      h(
        NTag,
        {
          type: row.status === 'active' ? 'success' : 'warning',
          size: 'small'
        },
        { default: () => (row.status === 'active' ? '活跃' : '禁用') }
      )
  },
  {
    title: '注册时间',
    key: 'createdAt',
    render: (row) => new Date(row.createdAt).toLocaleDateString()
  },
  {
    title: '最后登录',
    key: 'lastLogin',
    render: (row) => (row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : '-')
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) =>
      h(NSpace, [
        h(
          NTooltip,
          { trigger: 'hover' },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  text: true,
                  onClick: () => handleViewUser(row.id)
                },
                { icon: () => h(NIcon, { component: Eye }) }
              ),
            default: () => '查看详情'
          }
        ),
        h(
          NTooltip,
          { trigger: 'hover' },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  text: true,
                  onClick: () => handleEditUser(row)
                },
                { icon: () => h(NIcon, { component: Create }) }
              ),
            default: () => '编辑'
          }
        ),
        h(
          NTooltip,
          { trigger: 'hover' },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: row.status === 'active' ? 'warning' : 'success',
                  text: true,
                  onClick: () => handleToggleStatus(row)
                },
                {
                  icon: () =>
                    h(NIcon, {
                      component: row.status === 'active' ? Ban : Checkmark
                    })
                }
              ),
            default: () => (row.status === 'active' ? '禁用' : '启用')
          }
        )
      ])
  }
]

// 表格行属性
const rowProps = (row: User) => ({
  style: 'cursor: pointer;',
  onClick: () => handleViewUser(row.id)
})

// 加载用户列表
const loadUsers = async () => {
  try {
    loading.value = true

    const params: UserListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchQuery.value || undefined,
      status: statusFilter.value || undefined,
      role: roleFilter.value || undefined
    }

    const response = await UserAPI.getUsers(params)
    users.value = response.data.list
    pagination.itemCount = response.data.total
  } catch (error) {
    message.error('加载用户列表失败')
    console.error('Load users error:', error)
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  loadUsers()
}

// 筛选处理
const handleFilter = () => {
  pagination.page = 1
  loadUsers()
}

// 选择处理
const handleSelection = (keys: (string | number)[]) => {
  selectedKeys.value = keys.map((key) => String(key))
}

// 添加用户
const handleAddUser = () => {
  editingUser.value = null
  formModalVisible.value = true
}

// 编辑用户
const handleEditUser = (user: User) => {
  editingUser.value = user
  formModalVisible.value = true
}

// 查看用户详情
const handleViewUser = (userId: string) => {
  router.push({ name: 'user-detail', params: { id: userId } })
}

// 切换用户状态
const handleToggleStatus = async (user: User) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'

  dialog.warning({
    title: `${action}用户`,
    content: `确定要${action}用户 "${user.username}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await UserAPI.updateUser(user.id, { status: newStatus })
        message.success(`${action}成功`)
        loadUsers()
      } catch (error) {
        message.error(`${action}失败`)
      }
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  dialog.error({
    title: '批量删除用户',
    content: `确定要删除选中的 ${selectedKeys.value.length} 个用户吗？此操作不可恢复。`,
    positiveText: '确定删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await UserAPI.batchDeleteUsers(selectedKeys.value)
        message.success(`成功删除 ${selectedKeys.value.length} 个用户`)
        selectedKeys.value = []
        loadUsers()
      } catch (error) {
        message.error('批量删除失败')
      }
    }
  })
}

// 表单提交成功
const handleFormSuccess = () => {
  formModalVisible.value = false
  loadUsers()
}

// 页面初始化
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.search-area {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-area {
    flex-wrap: wrap;
  }

  .action-buttons {
    justify-content: flex-end;
  }
}
</style>
