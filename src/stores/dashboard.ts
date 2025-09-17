import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 仪表板统计数据类型
export interface DashboardStats {
  totalRevenue: number
  totalUsers: number
  activeInstances: number
  cpuUsage: number
  revenueGrowth: number
  userGrowth: number
  instanceGrowth: number
}

// 图表数据类型
export interface ChartData {
  revenue: Array<{
    date: string
    revenue: number
    orders: number
  }>
  usage: Array<{
    type: string
    usage: number
    total: number
  }>
}

// 实时数据类型
export interface RealtimeData {
  onlineUsers: number
  activeInstances: number
  currentRevenue: number
  systemLoad: number
}

// 模拟API调用
const DashboardAPI = {
  async getStats(): Promise<{ data: DashboardStats }> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      data: {
        totalRevenue: 1250000,
        totalUsers: 8945,
        activeInstances: 42,
        cpuUsage: 68.5,
        revenueGrowth: 12.5,
        userGrowth: 8.3,
        instanceGrowth: 15.7
      }
    }
  },

  async getChartData(): Promise<{ data: ChartData }> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    return {
      data: {
        revenue: [
          { date: '01-15', revenue: 12580, orders: 25 },
          { date: '01-16', revenue: 15620, orders: 32 },
          { date: '01-17', revenue: 18900, orders: 28 },
          { date: '01-18', revenue: 22100, orders: 35 },
          { date: '01-19', revenue: 19800, orders: 30 },
          { date: '01-20', revenue: 25600, orders: 42 },
          { date: '01-21', revenue: 28900, orders: 48 }
        ],
        usage: [
          { type: 'RTX4090', usage: 8, total: 12 },
          { type: 'RTX3090', usage: 15, total: 20 },
          { type: 'RTX3080', usage: 12, total: 18 },
          { type: 'A100', usage: 4, total: 6 }
        ]
      }
    }
  }
}

export const useDashboardStore = defineStore('dashboard', () => {
  // 状态
  const stats = ref<DashboardStats | null>(null)
  const chartData = ref<ChartData | null>(null)
  const isLoading = ref(false)
  const lastUpdated = ref<Date | null>(null)

  // 实时数据
  const realtimeData = ref<RealtimeData>({
    onlineUsers: 0,
    activeInstances: 0,
    currentRevenue: 0,
    systemLoad: 0
  })

  // 计算属性
  const totalRevenue = computed(() => {
    return stats.value?.totalRevenue || 0
  })

  const totalUsers = computed(() => {
    return stats.value?.totalUsers || 0
  })

  const revenueGrowth = computed(() => {
    return stats.value?.revenueGrowth || 0
  })

  const userGrowth = computed(() => {
    return stats.value?.userGrowth || 0
  })

  const formattedRevenue = computed(() => {
    const revenue = totalRevenue.value
    if (revenue >= 1000000) {
      return `${(revenue / 1000000).toFixed(1)}M`
    } else if (revenue >= 1000) {
      return `${(revenue / 1000).toFixed(1)}K`
    }
    return revenue.toString()
  })

  const isDataStale = computed(() => {
    if (!lastUpdated.value) return true
    const now = new Date()
    const diffInMinutes = (now.getTime() - lastUpdated.value.getTime()) / (1000 * 60)
    return diffInMinutes > 10 // 数据超过10分钟认为过期
  })

  const loading = computed(() => isLoading.value)

  // 方法
  const loadStats = async (force = false) => {
    if (isLoading.value && !force) return

    try {
      isLoading.value = true
      const response = await DashboardAPI.getStats()
      stats.value = response.data
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load stats:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const loadChartData = async (force = false) => {
    if (isLoading.value && !force) return

    try {
      isLoading.value = true
      const response = await DashboardAPI.getChartData()
      chartData.value = response.data
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load chart data:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const refreshData = async () => {
    await Promise.all([loadStats(true), loadChartData(true)])
  }

  const updateRealtimeData = (data: Partial<RealtimeData>) => {
    realtimeData.value = { ...realtimeData.value, ...data }
  }

  const incrementRevenue = (amount: number) => {
    if (stats.value) {
      stats.value.totalRevenue += amount
    }
    realtimeData.value.currentRevenue += amount
  }

  const incrementUsers = (count: number = 1) => {
    if (stats.value) {
      stats.value.totalUsers += count
    }
  }

  const updateInstanceCount = (count: number) => {
    if (stats.value) {
      stats.value.activeInstances = count
    }
    realtimeData.value.activeInstances = count
  }

  // 重置数据
  const resetData = () => {
    stats.value = null
    chartData.value = null
    lastUpdated.value = null
    realtimeData.value = {
      onlineUsers: 0,
      activeInstances: 0,
      currentRevenue: 0,
      systemLoad: 0
    }
  }

  // 导出数据
  const exportData = () => {
    return {
      stats: stats.value,
      chartData: chartData.value,
      realtimeData: realtimeData.value,
      lastUpdated: lastUpdated.value
    }
  }

  return {
    // State
    stats,
    chartData,
    isLoading,
    lastUpdated,
    realtimeData,

    // Getters
    totalRevenue,
    totalUsers,
    revenueGrowth,
    userGrowth,
    formattedRevenue,
    isDataStale,
    loading,

    // Actions
    loadStats,
    loadChartData,
    refreshData,
    updateRealtimeData,
    incrementRevenue,
    incrementUsers,
    updateInstanceCount,
    resetData,
    exportData
  }
})
