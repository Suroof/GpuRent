import { HttpClient } from './http'
import type { OrderListParams, OrderListResponse, Order, ApiResponse } from './types'

// 生成模拟订单数据
export const generateMockOrders = (count: number): Order[] => {
  const statuses: Order['status'][] = ['pending', 'paid', 'cancelled', 'refunded']
  const instanceTypes = ['RTX3080', 'RTX3090', 'RTX4090', 'A100']

  const orders: Order[] = []

  for (let i = 0; i < count; i++) {
    const id = (i + 1).toString()
    const status = statuses[i % statuses.length]
    const instanceType = instanceTypes[i % instanceTypes.length]
    const duration = [1, 2, 4, 8, 12, 24][Math.floor(Math.random() * 6)]

    // 根据GPU类型设置价格
    let hourlyRate = 10
    switch (instanceType) {
      case 'RTX3080':
        hourlyRate = 8
        break
      case 'RTX3090':
        hourlyRate = 12
        break
      case 'RTX4090':
        hourlyRate = 20
        break
      case 'A100':
        hourlyRate = 50
        break
    }

    const amount = duration * hourlyRate
    const createdAt = new Date(
      2024,
      0,
      Math.floor(Math.random() * 30) + 1,
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60)
    )

    const order: Order = {
      id,
      userId: `user${Math.floor(Math.random() * 20) + 1}`,
      userName: `用户${Math.floor(Math.random() * 100) + 1}`,
      instanceId: `instance${Math.floor(Math.random() * 50) + 1}`,
      instanceName: `GPU-${instanceType}-${Math.floor(Math.random() * 10) + 1}`,
      amount,
      status,
      duration,
      createdAt: createdAt.toISOString()
    }

    // 根据状态添加相应的时间戳
    if (status === 'paid') {
      order.paidAt = new Date(createdAt.getTime() + Math.random() * 3600000).toISOString()
    } else if (status === 'refunded') {
      order.paidAt = new Date(createdAt.getTime() + Math.random() * 3600000).toISOString()
      order.refundedAt = new Date(createdAt.getTime() + Math.random() * 7200000).toISOString()
    }

    orders.push(order)
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// 模拟API延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// 订单API类
export class OrderAPI {
  // 获取订单列表
  static async getOrders(params: OrderListParams): Promise<OrderListResponse> {
    await delay()

    const allOrders = generateMockOrders(200)
    let filteredOrders = [...allOrders]

    // 搜索过滤
    if (params.search) {
      const search = params.search.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(search) ||
          order.userName.toLowerCase().includes(search) ||
          order.instanceName.toLowerCase().includes(search)
      )
    }

    // 状态过滤
    if (params.status) {
      filteredOrders = filteredOrders.filter((order) => order.status === params.status)
    }

    // 用户过滤
    if (params.userId) {
      filteredOrders = filteredOrders.filter((order) => order.userId === params.userId)
    }

    // 分页
    const total = filteredOrders.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredOrders.slice(start, end)

    return {
      code: 200,
      message: 'success',
      data: {
        list,
        total,
        page: params.page,
        pageSize: params.pageSize
      }
    }
  }

  // 处理订单支付
  static async payOrder(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '订单支付成功',
      data: null
    }
  }

  // 取消订单
  static async cancelOrder(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '订单取消成功',
      data: null
    }
  }

  // 退款订单
  static async refundOrder(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '订单退款成功',
      data: null
    }
  }

  // 获取订单统计
  static async getOrderStats(): Promise<
    ApiResponse<{
      totalOrders: number
      totalRevenue: number
      pendingOrders: number
      paidOrders: number
    }>
  > {
    await delay()

    const orders = generateMockOrders(200)
    const totalOrders = orders.length
    const totalRevenue = orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + o.amount, 0)
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const paidOrders = orders.filter((o) => o.status === 'paid').length

    return {
      code: 200,
      message: 'success',
      data: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        paidOrders
      }
    }
  }
}

export default OrderAPI
