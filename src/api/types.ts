// API类型定义

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  status: 'active' | 'inactive'
  role: 'admin' | 'user'
  createdAt: string
  lastLogin?: string
  phone?: string
  realName?: string
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  realName?: string
  phone?: string
}

export interface UpdateUserData {
  username?: string
  email?: string
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
  realName?: string
  phone?: string
}

export interface UserListParams extends PaginationParams {
  search?: string
  status?: 'active' | 'inactive'
  role?: 'admin' | 'user'
}

export type UserListResponse = ApiResponse<PaginationResponse<User>>
export type UserDetailResponse = ApiResponse<User>
export type UserResponse = ApiResponse<User>

// 统计数据类型
export interface Stats {
  totalRevenue: number
  totalUsers: number
  activeInstances: number
  cpuUsage: number
  memoryUsage: number
  revenueGrowth: number
  userGrowth: number
  instanceGrowth: number
}

export type StatsResponse = ApiResponse<Stats>

// 图表数据类型
export interface ChartDataPoint {
  date: string
  value: number
}

export interface ChartData {
  revenue: ChartDataPoint[]
  users: ChartDataPoint[]
  instances: ChartDataPoint[]
}

export type ChartType = 'revenue' | 'users' | 'instances'
export type ChartDataResponse = ApiResponse<ChartData>

// GPU实例类型
export interface GPUInstance {
  id: string
  name: string
  type: 'RTX3080' | 'RTX3090' | 'RTX4090' | 'A100'
  status: 'online' | 'offline' | 'using' | 'maintenance'
  usage: number
  temperature: number
  memory: {
    used: number
    total: number
  }
  userId?: string
  userName?: string
  createdAt: string
  lastHeartbeat: string
}

export interface InstanceListParams extends PaginationParams {
  search?: string
  status?: 'online' | 'offline' | 'using' | 'maintenance'
  type?: string
}

export type InstanceListResponse = ApiResponse<PaginationResponse<GPUInstance>>

// 订单类型
export interface Order {
  id: string
  userId: string
  userName: string
  instanceId: string
  instanceName: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  duration: number // 小时
  createdAt: string
  paidAt?: string
  refundedAt?: string
}

export interface OrderListParams extends PaginationParams {
  search?: string
  status?: 'pending' | 'paid' | 'cancelled' | 'refunded'
  userId?: string
}

export type OrderListResponse = ApiResponse<PaginationResponse<Order>>
