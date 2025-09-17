import { HttpClient } from './http'
import type { InstanceListParams, InstanceListResponse, GPUInstance, ApiResponse } from './types'

// 模拟实例数据
const mockInstances: GPUInstance[] = [
  {
    id: '1',
    name: 'GPU-Server-001',
    type: 'RTX4090',
    status: 'online',
    usage: 85,
    temperature: 72,
    memory: { used: 20, total: 24 },
    userId: '1',
    userName: 'admin',
    createdAt: '2024-01-15T08:00:00Z',
    lastHeartbeat: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'GPU-Server-002',
    type: 'RTX3090',
    status: 'using',
    usage: 95,
    temperature: 78,
    memory: { used: 22, total: 24 },
    userId: '2',
    userName: 'user1',
    createdAt: '2024-01-15T08:00:00Z',
    lastHeartbeat: '2024-01-20T10:29:00Z'
  },
  {
    id: '3',
    name: 'GPU-Server-003',
    type: 'A100',
    status: 'offline',
    usage: 0,
    temperature: 35,
    memory: { used: 0, total: 80 },
    createdAt: '2024-01-15T08:00:00Z',
    lastHeartbeat: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    name: 'GPU-Server-004',
    type: 'RTX3080',
    status: 'maintenance',
    usage: 0,
    temperature: 40,
    memory: { used: 0, total: 10 },
    createdAt: '2024-01-15T08:00:00Z',
    lastHeartbeat: '2024-01-20T08:00:00Z'
  }
]

// 生成更多模拟实例数据
export const generateMockInstances = (count: number): GPUInstance[] => {
  const types: GPUInstance['type'][] = ['RTX3080', 'RTX3090', 'RTX4090', 'A100']
  const statuses: GPUInstance['status'][] = ['online', 'offline', 'using', 'maintenance']

  const instances: GPUInstance[] = []

  for (let i = 0; i < count; i++) {
    const id = (i + 1).toString()
    const type = types[i % types.length]
    const status = statuses[i % statuses.length]
    const usage =
      status === 'offline' || status === 'maintenance' ? 0 : Math.floor(Math.random() * 100)
    const temperature =
      status === 'offline'
        ? Math.floor(Math.random() * 20) + 30
        : Math.floor(Math.random() * 40) + 50

    let memoryTotal = 24
    switch (type) {
      case 'RTX3080':
        memoryTotal = 10
        break
      case 'RTX3090':
      case 'RTX4090':
        memoryTotal = 24
        break
      case 'A100':
        memoryTotal = 80
        break
    }

    const memoryUsed =
      status === 'offline' || status === 'maintenance'
        ? 0
        : Math.floor(Math.random() * memoryTotal * 0.8)

    instances.push({
      id,
      name: `GPU-Server-${id.padStart(3, '0')}`,
      type,
      status,
      usage,
      temperature,
      memory: { used: memoryUsed, total: memoryTotal },
      userId: status === 'using' ? `user${id}` : undefined,
      userName: status === 'using' ? `用户${id}` : undefined,
      createdAt: new Date(2024, 0, 15, 8, 0, 0).toISOString(),
      lastHeartbeat: new Date().toISOString()
    })
  }

  return instances
}

// 模拟API延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// GPU实例API类
export class InstanceAPI {
  // 获取实例列表
  static async getInstances(params: InstanceListParams): Promise<InstanceListResponse> {
    await delay()

    const allInstances = generateMockInstances(50)
    let filteredInstances = [...allInstances]

    // 搜索过滤
    if (params.search) {
      const search = params.search.toLowerCase()
      filteredInstances = filteredInstances.filter(
        (instance) =>
          instance.name.toLowerCase().includes(search) ||
          instance.type.toLowerCase().includes(search) ||
          instance.userName?.toLowerCase().includes(search)
      )
    }

    // 状态过滤
    if (params.status) {
      filteredInstances = filteredInstances.filter((instance) => instance.status === params.status)
    }

    // 类型过滤
    if (params.type) {
      filteredInstances = filteredInstances.filter((instance) => instance.type === params.type)
    }

    // 分页
    const total = filteredInstances.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredInstances.slice(start, end)

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

  // 重启实例
  static async restartInstance(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '实例重启成功',
      data: null
    }
  }

  // 停止实例
  static async stopInstance(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '实例停止成功',
      data: null
    }
  }

  // 启动实例
  static async startInstance(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '实例启动成功',
      data: null
    }
  }

  // 进入维护模式
  static async maintenanceInstance(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '实例已进入维护模式',
      data: null
    }
  }
}

export default InstanceAPI
