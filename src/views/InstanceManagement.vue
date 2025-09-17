<template>
  <div class="instance-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">GPU实例管理</h1>
      <p class="page-description">管理所有GPU实例的运行状态和使用情况</p>
    </div>

    <!-- 筛选和搜索区域 -->
    <div class="filter-section">
      <NCard>
        <NSpace :size="16" justify="space-between">
          <NSpace :size="16">
            <NInput
              v-model:value="searchQuery"
              placeholder="搜索实例名称、类型或用户"
              style="width: 280px"
              clearable
            >
              <template #prefix>
                <NIcon>
                  <Search />
                </NIcon>
              </template>
            </NInput>

            <NSelect
              v-model:value="filters.status"
              placeholder="状态筛选"
              style="width: 140px"
              clearable
              :options="statusOptions"
            />

            <NSelect
              v-model:value="filters.type"
              placeholder="类型筛选"
              style="width: 140px"
              clearable
              :options="typeOptions"
            />

            <NButton @click="handleSearch">
              <template #icon>
                <NIcon>
                  <Search />
                </NIcon>
              </template>
              搜索
            </NButton>

            <NButton @click="handleReset"> 重置 </NButton>
          </NSpace>

          <NButton type="primary" @click="handleRefresh">
            <template #icon>
              <NIcon>
                <Refresh />
              </NIcon>
            </template>
            刷新
          </NButton>
        </NSpace>
      </NCard>
    </div>

    <!-- 实例列表 -->
    <NCard>
      <NDataTable
        ref="tableRef"
        :columns="columns"
        :data="instances"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue'
import {
  NCard,
  NInput,
  NSelect,
  NButton,
  NIcon,
  NDataTable,
  NTag,
  NProgress,
  NSpace,
  NTooltip,
  NDropdown,
  useMessage,
  useDialog,
  type DataTableColumns
} from 'naive-ui'
import {
  Search,
  Refresh,
  Play,
  Stop,
  RefreshOutline as RestartAlt,
  Build,
  EllipsisHorizontal as MoreHorizontal
} from '@vicons/ionicons5'
import { InstanceAPI } from '@/api/instance'
import type { GPUInstance, InstanceListParams } from '@/api/types'

const message = useMessage()
const dialog = useDialog()

// 响应式数据
const loading = ref(false)
const instances = ref<GPUInstance[]>([])
const searchQuery = ref('')
const filters = reactive({
  status: null as 'online' | 'offline' | 'using' | 'maintenance' | null,
  type: null as string | null
})

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.page = page
    loadInstances()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadInstances()
  }
})

// 筛选选项
const statusOptions = [
  { label: '在线', value: 'online' },
  { label: '离线', value: 'offline' },
  { label: '使用中', value: 'using' },
  { label: '维护中', value: 'maintenance' }
]

const typeOptions = [
  { label: 'RTX 3080', value: 'RTX3080' },
  { label: 'RTX 3090', value: 'RTX3090' },
  { label: 'RTX 4090', value: 'RTX4090' },
  { label: 'A100', value: 'A100' }
]

// 状态标签配置
const getStatusTag = (status: GPUInstance['status']) => {
  const statusMap = {
    online: { type: 'success', text: '在线' },
    offline: { type: 'error', text: '离线' },
    using: { type: 'warning', text: '使用中' },
    maintenance: { type: 'info', text: '维护中' }
  }
  return statusMap[status]
}

// 操作菜单选项
const getActionOptions = (row: GPUInstance) => {
  const options = []

  if (row.status === 'offline') {
    options.push({
      label: '启动',
      key: 'start',
      icon: () => h(NIcon, null, { default: () => h(Play) })
    })
  }

  if (row.status === 'online' || row.status === 'using') {
    options.push({
      label: '停止',
      key: 'stop',
      icon: () => h(NIcon, null, { default: () => h(Stop) })
    })
    options.push({
      label: '重启',
      key: 'restart',
      icon: () => h(NIcon, null, { default: () => h(RestartAlt) })
    })
  }

  if (row.status !== 'maintenance') {
    options.push({
      label: '维护模式',
      key: 'maintenance',
      icon: () => h(NIcon, null, { default: () => h(Build) })
    })
  }

  return options
}

// 表格列配置
const columns: DataTableColumns<GPUInstance> = [
  {
    title: '实例名称',
    key: 'name',
    width: 150,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
    render: (row) => h(NTag, { type: 'info' }, { default: () => row.type })
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      const status = getStatusTag(row.status)
      return h(NTag, { type: status.type as any }, { default: () => status.text })
    }
  },
  {
    title: 'GPU使用率',
    key: 'usage',
    width: 140,
    render: (row) =>
      h(NProgress, {
        type: 'line',
        percentage: row.usage,
        color: row.usage > 80 ? '#f56565' : row.usage > 60 ? '#ed8936' : '#48bb78',
        showIndicator: true
      })
  },
  {
    title: '温度',
    key: 'temperature',
    width: 80,
    render: (row) => `${row.temperature}°C`
  },
  {
    title: '显存使用',
    key: 'memory',
    width: 120,
    render: (row) => {
      const percentage = Math.round((row.memory.used / row.memory.total) * 100)
      return `${row.memory.used}G / ${row.memory.total}G (${percentage}%)`
    }
  },
  {
    title: '使用用户',
    key: 'userName',
    width: 100,
    render: (row) => row.userName || '-'
  },
  {
    title: '最后心跳',
    key: 'lastHeartbeat',
    width: 160,
    render: (row) => new Date(row.lastHeartbeat).toLocaleString()
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    render: (row) => {
      const options = getActionOptions(row)
      return h(
        NDropdown,
        {
          options,
          onSelect: (key: string) => handleAction(key, row)
        },
        {
          default: () =>
            h(
              NButton,
              { size: 'small', tertiary: true },
              { icon: () => h(NIcon, null, { default: () => h(MoreHorizontal) }) }
            )
        }
      )
    }
  }
]

// 加载实例列表
const loadInstances = async () => {
  loading.value = true
  try {
    const params: InstanceListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchQuery.value || undefined,
      status: filters.status || undefined,
      type: filters.type || undefined
    }

    const response = await InstanceAPI.getInstances(params)
    instances.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    message.error('加载实例列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  loadInstances()
}

// 重置筛选
const handleReset = () => {
  searchQuery.value = ''
  filters.status = null
  filters.type = null
  pagination.page = 1
  loadInstances()
}

// 刷新数据
const handleRefresh = () => {
  loadInstances()
}

// 分页处理
const handlePageChange = (page: number) => {
  pagination.page = page
  loadInstances()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  loadInstances()
}

// 操作处理
const handleAction = async (action: string, instance: GPUInstance) => {
  const actionMap = {
    start: { api: InstanceAPI.startInstance, message: '启动' },
    stop: { api: InstanceAPI.stopInstance, message: '停止' },
    restart: { api: InstanceAPI.restartInstance, message: '重启' },
    maintenance: { api: InstanceAPI.maintenanceInstance, message: '进入维护模式' }
  }

  const { api, message: actionMessage } = actionMap[action as keyof typeof actionMap]

  if (!api) return

  dialog.warning({
    title: '确认操作',
    content: `确定要${actionMessage}实例 "${instance.name}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await api(instance.id)
        message.success(`${actionMessage}成功`)
        await loadInstances()
      } catch (error) {
        message.error(`${actionMessage}失败`)
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  loadInstances()
})
</script>

<style scoped>
.instance-management {
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

.filter-section {
  margin-bottom: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-section :deep(.n-space) {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section :deep(.n-space > *) {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .instance-management {
    padding: 0;
  }

  .page-header {
    padding: 16px;
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .filter-section {
    margin: 0 16px 16px;
  }

  /* 移动端表格滚动 */
  .instances-table :deep(.n-data-table-wrapper) {
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .page-description {
    font-size: 12px;
  }

  .filter-section {
    margin: 0 12px 16px;
  }
}
</style>
