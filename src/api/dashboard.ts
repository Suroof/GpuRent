import { HttpClient } from './http'
import type { StatsResponse, ChartDataResponse, ChartType } from './types'
import { mockStats, mockChartData } from '@/mock/dashboardData'

// 模拟API延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// 仪表盘API类
export class DashboardAPI {
  // 获取统计数据
  static async getStats(): Promise<StatsResponse> {
    await delay()

    return {
      code: 200,
      message: 'success',
      data: mockStats
    }
  }

  // 获取图表数据
  static async getChartData(type?: ChartType): Promise<ChartDataResponse> {
    await delay()

    let data = mockChartData

    // 如果指定了类型，只返回对应类型的数据
    if (type) {
      data = {
        revenue: type === 'revenue' ? mockChartData.revenue : [],
        users: type === 'users' ? mockChartData.users : [],
        instances: type === 'instances' ? mockChartData.instances : []
      }
    }

    return {
      code: 200,
      message: 'success',
      data
    }
  }

  // 刷新统计数据
  static async refreshStats(): Promise<StatsResponse> {
    await delay(500) // 模拟刷新延迟

    // 生成随机波动的数据
    const stats = {
      ...mockStats,
      totalRevenue: mockStats.totalRevenue + (Math.random() - 0.5) * 10000,
      totalUsers: mockStats.totalUsers + Math.floor((Math.random() - 0.5) * 100),
      activeInstances: mockStats.activeInstances + Math.floor((Math.random() - 0.5) * 20),
      cpuUsage: Math.min(100, Math.max(0, mockStats.cpuUsage + (Math.random() - 0.5) * 10)),
      memoryUsage: Math.min(100, Math.max(0, mockStats.memoryUsage + (Math.random() - 0.5) * 10))
    }

    return {
      code: 200,
      message: 'success',
      data: stats
    }
  }
}

// 导出默认实例
export default DashboardAPI
