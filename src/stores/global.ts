import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  // 主题状态
  const isDark = ref(false)

  // 侧边栏状态
  const sidebarCollapsed = ref(false)

  // 全局加载状态
  const isLoading = ref(false)
  const loadingText = ref('加载中...')

  // 应用配置
  const appConfig = ref({
    title: 'GPU云算力平台',
    description: '专业的GPU云计算服务平台',
    version: '1.0.0'
  })

  // 用户权限
  const permissions = ref<string[]>([])

  // 面包屑导航
  const breadcrumbs = ref<{ name: string; title: string; path?: string }[]>([])

  // 计算属性
  const theme = computed(() => (isDark.value ? 'dark' : 'light'))
  const themeClass = computed(() => (isDark.value ? 'dark' : 'light'))

  // Actions
  const toggleTheme = () => {
    isDark.value = !isDark.value
    // 持久化到localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    // 持久化到localStorage
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
    localStorage.setItem('sidebarCollapsed', collapsed.toString())
  }

  const setLoading = (loading: boolean, text: string = '加载中...') => {
    isLoading.value = loading
    loadingText.value = text
  }

  const updateAppConfig = (config: Partial<typeof appConfig.value>) => {
    appConfig.value = { ...appConfig.value, ...config }
  }

  const setPermissions = (newPermissions: string[]) => {
    permissions.value = newPermissions
  }

  const hasPermission = (permission: string) => {
    return permissions.value.includes(permission) || permissions.value.includes('*')
  }

  const setBreadcrumbs = (crumbs: typeof breadcrumbs.value) => {
    breadcrumbs.value = crumbs
  }

  // 初始化
  const initializeStore = () => {
    // 从localStorage恢复状态
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    }

    const savedSidebarState = localStorage.getItem('sidebarCollapsed')
    if (savedSidebarState) {
      sidebarCollapsed.value = savedSidebarState === 'true'
    }
  }

  return {
    // State
    isDark,
    sidebarCollapsed,
    isLoading,
    loadingText,
    appConfig,
    permissions,
    breadcrumbs,

    // Getters
    theme,
    themeClass,

    // Actions
    toggleTheme,
    toggleSidebar,
    setSidebarCollapsed,
    setLoading,
    updateAppConfig,
    setPermissions,
    hasPermission,
    setBreadcrumbs,
    initializeStore
  }
})
