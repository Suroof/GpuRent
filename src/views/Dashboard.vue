<template>
  <div class="dashboard-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">仪表盘</h1>
      <p class="page-description">GPU租借平台数据概览</p>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-grid">
      <StatsCard
        v-for="stat in statsCards"
        :key="stat.key"
        :title="stat.title"
        :value="stat.value"
        :suffix="stat.suffix"
        :growth="stat.growth"
        :icon="stat.icon"
        :color="stat.color"
        :loading="dashboardStore.loading"
      />
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <NGrid :cols="2" :x-gap="24" :y-gap="24">
        <NGridItem>
          <NCard title="收入趋势" class="chart-card">
            <template #header-extra>
              <NButton text type="primary" @click="refreshChartData">
                <template #icon>
                  <NIcon>
                    <Refresh />
                  </NIcon>
                </template>
                刷新
              </NButton>
            </template>
            <RevenueChart
              :data="revenueData"
              :loading="chartsLoading || dashboardStore.isLoading"
            />
          </NCard>
        </NGridItem>

        <NGridItem>
          <NCard title="GPU使用率分布" class="chart-card">
            <UsageChart :data="usageData" :loading="chartsLoading || dashboardStore.isLoading" />
          </NCard>
        </NGridItem>
      </NGrid>
    </div>

    <!-- 快捷操作区域 -->
    <div class="quick-actions">
      <NCard title="快捷操作">
        <div class="action-grid">
          <NButton
            v-for="action in quickActions"
            :key="action.key"
            :type="action.type"
            size="large"
            class="action-btn"
            @click="handleQuickAction(action.key)"
          >
            <template #icon>
              <NIcon>
                <component :is="action.icon" />
              </NIcon>
            </template>
            {{ action.label }}
          </NButton>
        </div>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NGrid, NGridItem, NButton, NIcon, useMessage, useLoadingBar } from 'naive-ui'
import {
  Refresh,
  Person as UserIcon,
  Desktop as InstanceIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon
} from '@vicons/ionicons5'
import RevenueChart from '@/components/business/RevenueChart.vue'
import UsageChart from '@/components/business/UsageChart.vue'
import StatsCard from '@/components/business/StatsCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useGlobalStore } from '@/stores/global'
import type { Stats, ChartData } from '@/api/types'

const router = useRouter()
const message = useMessage()
const loadingBar = useLoadingBar()
const dashboardStore = useDashboardStore()
const globalStore = useGlobalStore()

// 响应式数据
const chartsLoading = ref(false)

// 图表数据（使用 Store 数据或默认数据）
const revenueData = computed(() => {
  if (dashboardStore.chartData?.revenue && dashboardStore.chartData.revenue.length > 0) {
    return dashboardStore.chartData.revenue
  }
  // 默认数据，用于首次加载和演示
  return [
    { date: '01-15', revenue: 12580, orders: 25 },
    { date: '01-16', revenue: 15620, orders: 32 },
    { date: '01-17', revenue: 18900, orders: 28 },
    { date: '01-18', revenue: 22100, orders: 35 },
    { date: '01-19', revenue: 19800, orders: 30 },
    { date: '01-20', revenue: 25600, orders: 42 },
    { date: '01-21', revenue: 28900, orders: 48 }
  ]
})

const usageData = computed(() => {
  if (dashboardStore.chartData?.usage && dashboardStore.chartData.usage.length > 0) {
    return dashboardStore.chartData.usage
  }
  // 默认数据，用于首次加载和演示
  return [
    { type: 'RTX4090', usage: 8, total: 12 },
    { type: 'RTX3090', usage: 15, total: 20 },
    { type: 'RTX3080', usage: 12, total: 18 },
    { type: 'A100', usage: 4, total: 6 }
  ]
})

// 统计卡片数据
const statsCards = computed(() => [
  {
    key: 'revenue',
    title: '总收入',
    value: dashboardStore.stats?.totalRevenue?.toLocaleString() || '0',
    suffix: '元',
    growth: dashboardStore.stats?.revenueGrowth || 0,
    icon: AnalyticsIcon,
    color: '#3B82F6'
  },
  {
    key: 'users',
    title: '用户总数',
    value: dashboardStore.stats?.totalUsers?.toLocaleString() || '0',
    suffix: '人',
    growth: dashboardStore.stats?.userGrowth || 0,
    icon: UserIcon,
    color: '#10B981'
  },
  {
    key: 'instances',
    title: '活跃实例',
    value: dashboardStore.stats?.activeInstances?.toString() || '0',
    suffix: '台',
    growth: dashboardStore.stats?.instanceGrowth || 0,
    icon: InstanceIcon,
    color: '#F59E0B'
  },
  {
    key: 'usage',
    title: 'CPU使用率',
    value: dashboardStore.stats?.cpuUsage?.toFixed(1) || '0',
    suffix: '%',
    growth: 0,
    icon: SettingsIcon,
    color: '#8B5CF6'
  }
])

// 快捷操作配置
const quickActions = [
  {
    key: 'add-user',
    label: '添加用户',
    icon: UserIcon,
    type: 'primary' as const
  },
  {
    key: 'manage-instances',
    label: 'GPU管理',
    icon: InstanceIcon,
    type: 'default' as const
  },
  {
    key: 'view-orders',
    label: '查看订单',
    icon: AnalyticsIcon,
    type: 'default' as const
  },
  {
    key: 'system-settings',
    label: '系统设置',
    icon: SettingsIcon,
    type: 'default' as const
  }
]

// 加载统计数据
const loadStats = async () => {
  try {
    await dashboardStore.loadStats()
  } catch (error) {
    message.error('加载统计数据失败')
    console.error('Load stats error:', error)
  }
}

// 加载图表数据
const loadChartData = async () => {
  try {
    await dashboardStore.loadChartData()
  } catch (error) {
    message.error('加载图表数据失败')
    console.error('Load chart data error:', error)
  }
}

// 刷新图表数据
const refreshChartData = async () => {
  chartsLoading.value = true
  try {
    // 刷新 Store 中的图表数据
    await dashboardStore.loadChartData(true)
    message.success('图表数据已刷新')
  } catch (error) {
    message.error('刷新图表数据失败')
  } finally {
    chartsLoading.value = false
  }
}

// 快捷操作处理
const handleQuickAction = (key: string) => {
  switch (key) {
    case 'add-user':
      router.push({ name: 'user-list' })
      break
    case 'manage-instances':
      router.push({ name: 'instance-list' })
      break
    case 'view-orders':
      router.push({ name: 'order-list' })
      break
    case 'system-settings':
      router.push({ name: 'basic-settings' })
      break
    default:
      message.info(`执行操作: ${key}`)
  }
}

// 页面初始化
onMounted(async () => {
  // 并行加载统计数据和图表数据
  await Promise.all([loadStats(), loadChartData()])

  // 确保图表数据在 DOM 渲染后正确显示
  await nextTick()
})
</script>

<style scoped>
.dashboard-container {
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.charts-section {
  margin-bottom: 24px;
}

.chart-card {
  height: 400px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.quick-actions {
  margin-bottom: 24px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>
