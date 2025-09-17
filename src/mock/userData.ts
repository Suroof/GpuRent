import type { User } from '@/api/types'

// Mock用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    status: 'active',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-09-17T10:00:00Z',
    phone: '13800138000',
    realName: '系统管理员'
  },
  {
    id: '2',
    username: 'user001',
    email: 'user001@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    status: 'active',
    role: 'user',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-09-17T09:30:00Z',
    phone: '13800138001',
    realName: '张三'
  },
  {
    id: '3',
    username: 'user002',
    email: 'user002@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    status: 'active',
    role: 'user',
    createdAt: '2024-02-15T00:00:00Z',
    lastLogin: '2024-09-16T15:20:00Z',
    phone: '13800138002',
    realName: '李四'
  },
  {
    id: '4',
    username: 'user003',
    email: 'user003@example.com',
    status: 'inactive',
    role: 'user',
    createdAt: '2024-03-01T00:00:00Z',
    lastLogin: '2024-09-10T11:15:00Z',
    phone: '13800138003',
    realName: '王五'
  },
  {
    id: '5',
    username: 'user004',
    email: 'user004@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
    status: 'active',
    role: 'user',
    createdAt: '2024-03-15T00:00:00Z',
    lastLogin: '2024-09-17T08:45:00Z',
    phone: '13800138004',
    realName: '赵六'
  },
  {
    id: '6',
    username: 'moderator',
    email: 'mod@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/6?v=4',
    status: 'active',
    role: 'admin',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-09-17T09:00:00Z',
    phone: '13800138005',
    realName: '版主'
  }
]

// 生成更多Mock用户数据
export const generateMockUsers = (count: number = 50): User[] => {
  const users: User[] = [...mockUsers]

  for (let i = 7; i <= count; i++) {
    users.push({
      id: i.toString(),
      username: `user${i.toString().padStart(3, '0')}`,
      email: `user${i}@example.com`,
      avatar: Math.random() > 0.3 ? `https://avatars.githubusercontent.com/u/${i}?v=4` : undefined,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      role: Math.random() > 0.1 ? 'user' : 'admin',
      createdAt: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toISOString(),
      lastLogin:
        Math.random() > 0.1
          ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      phone: `138${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0')}`,
      realName: `用户${i}`
    })
  }

  return users
}
