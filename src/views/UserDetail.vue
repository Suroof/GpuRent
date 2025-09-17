<template>
  <div class="user-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">用户详情</h1>
      <NButton @click="$router.back()">
        <template #icon>
          <NIcon>
            <ArrowBack />
          </NIcon>
        </template>
        返回
      </NButton>
    </div>

    <!-- 加载状态 -->
    <NSkeleton v-if="loading" text :repeat="6" />

    <!-- 用户信息 -->
    <template v-else-if="user">
      <NGrid :cols="2" :x-gap="24" :y-gap="24">
        <!-- 基本信息 -->
        <NGridItem>
          <NCard title="基本信息">
            <div class="user-info">
              <div class="avatar-section">
                <NAvatar :size="80" :src="user.avatar">
                  {{ user.username.charAt(0).toUpperCase() }}
                </NAvatar>
                <div class="user-basic">
                  <h3>{{ user.username }}</h3>
                  <p>{{ user.email }}</p>
                  <NTag :type="user.status === 'active' ? 'success' : 'warning'" size="small">
                    {{ user.status === 'active' ? '活跃' : '禁用' }}
                  </NTag>
                </div>
              </div>

              <NDivider />

              <div class="info-grid">
                <div class="info-item">
                  <span class="label">真实姓名:</span>
                  <span class="value">{{ user.realName || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">手机号:</span>
                  <span class="value">{{ user.phone || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">角色:</span>
                  <span class="value">
                    <NTag :type="user.role === 'admin' ? 'error' : 'default'" size="small">
                      {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                    </NTag>
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">注册时间:</span>
                  <span class="value">{{ new Date(user.createdAt).toLocaleString() }}</span>
                </div>
                <div class="info-item">
                  <span class="label">最后登录:</span>
                  <span class="value">
                    {{ user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '从未登录' }}
                  </span>
                </div>
              </div>
            </div>
          </NCard>
        </NGridItem>

        <!-- 操作记录 -->
        <NGridItem>
          <NCard title="最近活动">
            <NEmpty description="暂无活动记录" />
          </NCard>
        </NGridItem>
      </NGrid>

      <!-- 操作按钮 -->
      <div class="action-section">
        <NSpace>
          <NButton type="primary" @click="handleEdit">
            <template #icon>
              <NIcon>
                <Create />
              </NIcon>
            </template>
            编辑用户
          </NButton>

          <NButton
            :type="user.status === 'active' ? 'warning' : 'success'"
            @click="handleToggleStatus"
          >
            <template #icon>
              <NIcon>
                <component :is="user.status === 'active' ? Ban : Checkmark" />
              </NIcon>
            </template>
            {{ user.status === 'active' ? '禁用用户' : '启用用户' }}
          </NButton>

          <NButton type="error" @click="handleDelete">
            <template #icon>
              <NIcon>
                <TrashBin />
              </NIcon>
            </template>
            删除用户
          </NButton>
        </NSpace>
      </div>
    </template>

    <!-- 错误状态 -->
    <NResult v-else status="404" title="用户不存在" description="请检查用户ID是否正确">
      <template #footer>
        <NButton @click="$router.push({ name: 'user-list' })">返回用户列表</NButton>
      </template>
    </NResult>

    <!-- 编辑用户弹窗 -->
    <UserFormModal v-model:visible="formModalVisible" :user="user" @success="handleFormSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard,
  NGrid,
  NGridItem,
  NButton,
  NIcon,
  NAvatar,
  NTag,
  NDivider,
  NSpace,
  NSkeleton,
  NEmpty,
  NResult,
  useMessage,
  useDialog
} from 'naive-ui'
import { ArrowBack, Create, Ban, Checkmark, TrashBin } from '@vicons/ionicons5'
import UserFormModal from '@/components/business/UserFormModal.vue'
import { UserAPI } from '@/api/user'
import type { User } from '@/api/types'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()

// 响应式数据
const loading = ref(false)
const user = ref<User | null>(null)
const formModalVisible = ref(false)

// 获取用户ID
const userId = route.params.id as string

// 加载用户详情
const loadUserDetail = async () => {
  if (!userId) return

  try {
    loading.value = true
    const response = await UserAPI.getUserById(userId)
    user.value = response.data
  } catch (error) {
    message.error('加载用户详情失败')
    console.error('Load user detail error:', error)
  } finally {
    loading.value = false
  }
}

// 编辑用户
const handleEdit = () => {
  formModalVisible.value = true
}

// 切换用户状态
const handleToggleStatus = () => {
  if (!user.value) return

  const newStatus = user.value.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'

  dialog.warning({
    title: `${action}用户`,
    content: `确定要${action}用户 "${user.value.username}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await UserAPI.updateUser(userId, { status: newStatus })
        message.success(`${action}成功`)
        loadUserDetail()
      } catch (error) {
        message.error(`${action}失败`)
      }
    }
  })
}

// 删除用户
const handleDelete = () => {
  if (!user.value) return

  dialog.error({
    title: '删除用户',
    content: `确定要删除用户 "${user.value.username}" 吗？此操作不可恢复。`,
    positiveText: '确定删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await UserAPI.deleteUser(userId)
        message.success('删除成功')
        router.push({ name: 'user-list' })
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

// 表单提交成功
const handleFormSuccess = () => {
  formModalVisible.value = false
  loadUserDetail()
}

// 页面初始化
onMounted(() => {
  loadUserDetail()
})
</script>

<style scoped>
.user-detail {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.user-info {
  padding: 8px 0;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.user-basic h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.user-basic p {
  margin: 0 0 8px 0;
  color: #6b7280;
}

.info-grid {
  display: grid;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #374151;
}

.value {
  color: #6b7280;
}

.action-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
