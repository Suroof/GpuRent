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
        :loading="statsLoading"
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
            <div class="chart-container" ref="revenueChartRef"></div>
          </NCard>
        </NGridItem>

        <NGridItem>
          <NCard title="用户增长" class="chart-card">
            <div class="chart-container" ref="userChartRef"></div>
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
import * as echarts from 'echarts'
import StatsCard from '@/components/business/StatsCard.vue'
import { DashboardAPI } from '@/api/dashboard'
import type { Stats, ChartData } from '@/api/types'

const router = useRouter()
const message = useMessage()
const loadingBar = useLoadingBar()

// 响应式数据
const statsLoading = ref(false)
const stats = ref<Stats | null>(null)
const chartData = ref<ChartData | null>(null)

// 图表引用
const revenueChartRef = ref<HTMLElement>()
const userChartRef = ref<HTMLElement>()

// 统计卡片数据
const statsCards = computed(() => [
  {
    key: 'revenue',
    title: '总收入',
    value: stats.value?.totalRevenue?.toLocaleString() || '0',
    suffix: '元',
    growth: stats.value?.revenueGrowth || 0,
    icon: AnalyticsIcon,
    color: '#3B82F6'
  },
  {
    key: 'users',
    title: '用户总数',
    value: stats.value?.totalUsers?.toLocaleString() || '0',
    suffix: '人',
    growth: stats.value?.userGrowth || 0,
    icon: UserIcon,
    color: '#10B981'
  },
  {
    key: 'instances',
    title: '活跃实例',
    value: stats.value?.activeInstances?.toString() || '0',
    suffix: '台',
    growth: stats.value?.instanceGrowth || 0,
    icon: InstanceIcon,
    color: '#F59E0B'
  },
  {
    key: 'usage',
    title: 'CPU使用率',
    value: stats.value?.cpuUsage?.toFixed(1) || '0',
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
    statsLoading.value = true
    const response = await DashboardAPI.getStats()
    stats.value = response.data
  } catch (error) {
    message.error('加载统计数据失败')
    console.error('Load stats error:', error)
  } finally {
    statsLoading.value = false
  }
}

// 加载图表数据
const loadChartData = async () => {
  try {
    const response = await DashboardAPI.getChartData()
    chartData.value = response.data
    await nextTick()
    initCharts()
  } catch (error) {
    message.error('加载图表数据失败')
    console.error('Load chart data error:', error)
  }
}

// 初始化图表
const initCharts = () => {
  if (!chartData.value) return

  // 收入趋势图
  if (revenueChartRef.value) {
    const revenueChart = echarts.init(revenueChartRef.value)
    revenueChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.value.revenue.map((item) => new Date(item.date).toLocaleDateString())
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`
        }
      },
      series: [
        {
          name: '收入',
          type: 'line',
          smooth: true,
          data: chartData.value.revenue.map((item) => item.value),
          itemStyle: {
            color: '#3B82F6'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ])
          }
        }
      ]
    })
  }

  // 用户增长图
  if (userChartRef.value) {
    const userChart = echarts.init(userChartRef.value)
    userChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.value.users.map((item) => new Date(item.date).toLocaleDateString())
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '新增用户',
          type: 'bar',
          data: chartData.value.users.map((item) => item.value),
          itemStyle: {
            color: '#10B981'
          }
        }
      ]
    })
  }
}

// 刷新图表数据
const refreshChartData = async () => {
  loadingBar.start()
  try {
    await loadChartData()
    message.success('图表数据已刷新')
    loadingBar.finish()
  } catch (error) {
    loadingBar.error()
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
  await Promise.all([loadStats(), loadChartData()])
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
