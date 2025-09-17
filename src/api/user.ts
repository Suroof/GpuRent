import { HttpClient } from './http'
import type {
  UserListParams,
  UserListResponse,
  UserDetailResponse,
  CreateUserData,
  UpdateUserData,
  UserResponse,
  ApiResponse,
  PaginationResponse,
  User
} from './types'
import { mockUsers, generateMockUsers } from '@/mock/userData'

// 模拟API延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// 用户API类
export class UserAPI {
  // 获取用户列表
  static async getUsers(params: UserListParams): Promise<UserListResponse> {
    await delay()

    // 使用Mock数据
    const allUsers = generateMockUsers(100)
    let filteredUsers = [...allUsers]

    // 搜索过滤
    if (params.search) {
      const search = params.search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.realName?.toLowerCase().includes(search)
      )
    }

    // 状态过滤
    if (params.status) {
      filteredUsers = filteredUsers.filter((user) => user.status === params.status)
    }

    // 角色过滤
    if (params.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === params.role)
    }

    // 分页
    const total = filteredUsers.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredUsers.slice(start, end)

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

  // 获取用户详情
  static async getUserById(id: string): Promise<UserDetailResponse> {
    await delay()

    const allUsers = generateMockUsers(100)
    const user = allUsers.find((u) => u.id === id)

    if (!user) {
      return {
        code: 404,
        message: '用户不存在',
        data: {} as User // 使用空对象代替null
      }
    }

    return {
      code: 200,
      message: 'success',
      data: user
    }
  }

  // 创建用户
  static async createUser(data: CreateUserData): Promise<UserResponse> {
    await delay()

    const newUser: User = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      status: 'active',
      role: data.role,
      createdAt: new Date().toISOString(),
      realName: data.realName,
      phone: data.phone
    }

    return {
      code: 200,
      message: '用户创建成功',
      data: newUser
    }
  }

  // 更新用户
  static async updateUser(id: string, data: UpdateUserData): Promise<UserResponse> {
    await delay()

    const allUsers = generateMockUsers(100)
    const user = allUsers.find((u) => u.id === id)

    if (!user) {
      return {
        code: 404,
        message: '用户不存在',
        data: {} as User // 使用空对象代替null
      }
    }

    const updatedUser: User = {
      ...user,
      ...data
    }

    return {
      code: 200,
      message: '用户更新成功',
      data: updatedUser
    }
  }

  // 删除用户
  static async deleteUser(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '用户删除成功',
      data: null
    }
  }

  // 批量删除用户
  static async batchDeleteUsers(ids: string[]): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: `成功删除 ${ids.length} 个用户`,
      data: null
    }
  }

  // 重置用户密码
  static async resetPassword(id: string): Promise<ApiResponse<null>> {
    await delay()

    return {
      code: 200,
      message: '密码重置成功',
      data: null
    }
  }
}

// 导出默认实例
export default UserAPI
