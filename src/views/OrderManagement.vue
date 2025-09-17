<template>
  <div class="order-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">订单管理</h1>
      <p class="page-description">管理所有用户的GPU租借订单</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <NCard v-for="stat in statsCards" :key="stat.key" class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" :style="{ backgroundColor: stat.color }">
            <NIcon size="24">
              <component :is="stat.icon" />
            </NIcon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.title }}</div>
          </div>
        </div>
      </NCard>
    </div>

    <!-- 筛选和搜索区域 -->
    <div class="filter-section">
      <NCard>
        <NSpace :size="16" justify="space-between">
          <NSpace :size="16">
            <NInput
              v-model:value="searchQuery"
              placeholder="搜索订单号、用户或实例"
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

          <NSpace :size="8">
            <NButton @click="handleRefresh">
              <template #icon>
                <NIcon>
                  <Refresh />
                </NIcon>
              </template>
              刷新
            </NButton>
            <NButton type="primary" @click="handleExport">
              <template #icon>
                <NIcon>
                  <Download />
                </NIcon>
              </template>
              导出
            </NButton>
          </NSpace>
        </NSpace>
      </NCard>
    </div>

    <!-- 订单列表 -->
    <NCard>
      <NDataTable
        ref="tableRef"
        :columns="columns"
        :data="orders"
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
  Download,
  CashOutline as Money,
  ReceiptOutline as Receipt,
  TimeOutline as Clock,
  CheckmarkCircleOutline as Check,
  Card,
  Ban,
  ReturnUpBack
} from '@vicons/ionicons5'
import { OrderAPI } from '@/api/order'
import type { Order, OrderListParams } from '@/api/types'

const message = useMessage()
const dialog = useDialog()

// 响应式数据
const loading = ref(false)
const statsLoading = ref(false)
const orders = ref<Order[]>([])
const searchQuery = ref('')
const filters = reactive({
  status: null as 'pending' | 'paid' | 'cancelled' | 'refunded' | null
})

// 统计数据
const stats = ref({
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  paidOrders: 0
})

// 统计卡片配置
const statsCards = computed(() => [
  {
    key: 'total',
    title: '总订单数',
    value: stats.value.totalOrders,
    icon: Receipt,
    color: '#3b82f6'
  },
  {
    key: 'revenue',
    title: '总收入',
    value: `¥${stats.value.totalRevenue.toLocaleString()}`,
    icon: Money,
    color: '#10b981'
  },
  {
    key: 'pending',
    title: '待支付',
    value: stats.value.pendingOrders,
    icon: Clock,
    color: '#f59e0b'
  },
  {
    key: 'paid',
    title: '已支付',
    value: stats.value.paidOrders,
    icon: Check,
    color: '#06b6d4'
  }
])

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.page = page
    loadOrders()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadOrders()
  }
})

// 筛选选项
const statusOptions = [
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已取消', value: 'cancelled' },
  { label: '已退款', value: 'refunded' }
]

// 状态标签配置
const getStatusTag = (status: Order['status']) => {
  const statusMap = {
    pending: { type: 'warning', text: '待支付' },
    paid: { type: 'success', text: '已支付' },
    cancelled: { type: 'error', text: '已取消' },
    refunded: { type: 'info', text: '已退款' }
  }
  return statusMap[status]
}

// 操作菜单选项
const getActionOptions = (row: Order) => {
  const options = []

  if (row.status === 'pending') {
    options.push({
      label: '标记支付',
      key: 'pay',
      icon: () => h(NIcon, null, { default: () => h(Card) })
    })
    options.push({
      label: '取消订单',
      key: 'cancel',
      icon: () => h(NIcon, null, { default: () => h(Ban) })
    })
  }

  if (row.status === 'paid') {
    options.push({
      label: '退款',
      key: 'refund',
      icon: () => h(NIcon, null, { default: () => h(ReturnUpBack) })
    })
  }

  return options
}

// 表格列配置
const columns: DataTableColumns<Order> = [
  {
    title: '订单号',
    key: 'id',
    width: 100,
    render: (row) => `#${row.id.padStart(6, '0')}`
  },
  {
    title: '用户',
    key: 'userName',
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '实例',
    key: 'instanceName',
    width: 140,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '金额',
    key: 'amount',
    width: 100,
    render: (row) => `¥${row.amount}`
  },
  {
    title: '时长',
    key: 'duration',
    width: 80,
    render: (row) => `${row.duration}小时`
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
    title: '创建时间',
    key: 'createdAt',
    width: 160,
    render: (row) => new Date(row.createdAt).toLocaleString()
  },
  {
    title: '支付时间',
    key: 'paidAt',
    width: 160,
    render: (row) => (row.paidAt ? new Date(row.paidAt).toLocaleString() : '-')
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    render: (row) => {
      const options = getActionOptions(row)
      if (options.length === 0) return '-'

      return h(
        NDropdown,
        {
          options,
          onSelect: (key: string) => handleAction(key, row)
        },
        {
          default: () => h(NButton, { size: 'small', tertiary: true }, { default: () => '操作' })
        }
      )
    }
  }
]

// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const params: OrderListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchQuery.value || undefined,
      status: filters.status || undefined
    }

    const response = await OrderAPI.getOrders(params)
    orders.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    message.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  statsLoading.value = true
  try {
    const response = await OrderAPI.getOrderStats()
    stats.value = response.data
  } catch (error) {
    message.error('加载统计数据失败')
  } finally {
    statsLoading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  loadOrders()
}

// 重置筛选
const handleReset = () => {
  searchQuery.value = ''
  filters.status = null
  pagination.page = 1
  loadOrders()
}

// 刷新数据
const handleRefresh = () => {
  Promise.all([loadOrders(), loadStats()])
}

// 导出数据
const handleExport = () => {
  message.info('导出功能开发中')
}

// 分页处理
const handlePageChange = (page: number) => {
  pagination.page = page
  loadOrders()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  loadOrders()
}

// 操作处理
const handleAction = async (action: string, order: Order) => {
  const actionMap = {
    pay: { api: OrderAPI.payOrder, message: '标记支付' },
    cancel: { api: OrderAPI.cancelOrder, message: '取消订单' },
    refund: { api: OrderAPI.refundOrder, message: '退款' }
  }

  const { api, message: actionMessage } = actionMap[action as keyof typeof actionMap]

  if (!api) return

  dialog.warning({
    title: '确认操作',
    content: `确定要${actionMessage}订单 #${order.id.padStart(6, '0')} 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await api(order.id)
        message.success(`${actionMessage}成功`)
        await Promise.all([loadOrders(), loadStats()])
      } catch (error) {
        message.error(`${actionMessage}失败`)
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  Promise.all([loadOrders(), loadStats()])
})
</script>

<style scoped>
.order-management {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.filter-section {
  margin-bottom: 16px;
}
</style>
