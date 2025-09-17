import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/api/types'

export const useUserStore = defineStore('user', () => {
  // 当前用户信息
  const currentUser = ref<User | null>(null)

  // 认证状态
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)

  // 用户权限
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])

  // 用户设置
  const userSettings = ref({
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    pageSize: 10,
    notifications: {
      email: true,
      browser: true,
      mobile: false
    }
  })

  // 计算属性
  const isAdmin = computed(() => {
    return roles.value.includes('admin') || roles.value.includes('super_admin')
  })

  const userName = computed(() => {
    return currentUser.value?.realName || currentUser.value?.username || '未知用户'
  })

  const userAvatar = computed(() => {
    return currentUser.value?.avatar || '/default-avatar.png'
  })

  // Actions
  const login = async (userData: User, authToken: string) => {
    currentUser.value = userData
    token.value = authToken
    isAuthenticated.value = true

    // 存储到localStorage
    localStorage.setItem('access_token', authToken)
    localStorage.setItem('user_info', JSON.stringify(userData))

    // 设置权限
    if (userData.role === 'admin') {
      roles.value = ['admin']
      permissions.value = ['*'] // 管理员拥有所有权限
    } else {
      roles.value = ['user']
      permissions.value = ['read'] // 普通用户只有读权限
    }
  }

  const logout = () => {
    currentUser.value = null
    token.value = null
    isAuthenticated.value = false
    roles.value = []
    permissions.value = []

    // 清除localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
  }

  const updateUser = (userData: Partial<User>) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...userData }
      localStorage.setItem('user_info', JSON.stringify(currentUser.value))
    }
  }

  const updateSettings = (settings: Partial<typeof userSettings.value>) => {
    userSettings.value = { ...userSettings.value, ...settings }
    localStorage.setItem('user_settings', JSON.stringify(userSettings.value))
  }

  const hasRole = (role: string) => {
    return roles.value.includes(role)
  }

  const hasPermission = (permission: string) => {
    return permissions.value.includes('*') || permissions.value.includes(permission)
  }

  const canAccess = (requiredPermissions: string[]) => {
    if (permissions.value.includes('*')) return true
    return requiredPermissions.some((permission) => permissions.value.includes(permission))
  }

  // 初始化用户状态
  const initializeUser = () => {
    const savedToken = localStorage.getItem('access_token')
    const savedUserInfo = localStorage.getItem('user_info')
    const savedSettings = localStorage.getItem('user_settings')

    if (savedToken && savedUserInfo) {
      try {
        const userData = JSON.parse(savedUserInfo)
        token.value = savedToken
        currentUser.value = userData
        isAuthenticated.value = true

        // 恢复权限
        if (userData.role === 'admin') {
          roles.value = ['admin']
          permissions.value = ['*']
        } else {
          roles.value = ['user']
          permissions.value = ['read']
        }
      } catch (error) {
        console.error('Failed to parse user info:', error)
        logout()
      }
    }

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        userSettings.value = { ...userSettings.value, ...settings }
      } catch (error) {
        console.error('Failed to parse user settings:', error)
      }
    }
  }

  return {
    // State
    currentUser,
    isAuthenticated,
    token,
    roles,
    permissions,
    userSettings,

    // Getters
    isAdmin,
    userName,
    userAvatar,

    // Actions
    login,
    logout,
    updateUser,
    updateSettings,
    hasRole,
    hasPermission,
    canAccess,
    initializeUser
  }
})
