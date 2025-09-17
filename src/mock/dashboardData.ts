import type { Stats, ChartData } from '@/api/types'

// Mock统计数据
export const mockStats: Stats = {
  totalRevenue: 1256789.5,
  totalUsers: 8432,
  activeInstances: 156,
  cpuUsage: 67.8,
  memoryUsage: 72.3,
  revenueGrowth: 12.5,
  userGrowth: 8.7,
  instanceGrowth: 15.2
}

// 生成图表数据
export const generateChartData = (): ChartData => {
  const dates = []
  const today = new Date()

  // 生成最近30天的数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  return {
    revenue: dates.map((date) => ({
      date,
      value: Math.floor(Math.random() * 50000) + 20000
    })),
    users: dates.map((date) => ({
      date,
      value: Math.floor(Math.random() * 100) + 50
    })),
    instances: dates.map((date) => ({
      date,
      value: Math.floor(Math.random() * 20) + 10
    }))
  }
}

export const mockChartData = generateChartData()
