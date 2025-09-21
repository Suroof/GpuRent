<template>
  <div class="app-header" :class="globalStore.themeClass">
    <div class="header-left">
      <NButton text type="primary" class="collapse-btn" @click="$emit('toggleCollapsed')">
        <template #icon>
          <NIcon size="18">
            <MenuOutlined />
          </NIcon>
        </template>
      </NButton>

      <NBreadcrumb class="breadcrumb">
        <NBreadcrumbItem
          v-for="item in breadcrumbItems"
          :key="item.name"
          :clickable="item.clickable"
          @click="item.clickable ? handleBreadcrumbClick(item) : undefined"
        >
          <NIcon v-if="item.icon" style="margin-right: 4px">
            <component :is="item.icon" />
          </NIcon>
          {{ item.label }}
        </NBreadcrumbItem>
      </NBreadcrumb>
    </div>

    <!-- 右侧：通知 + 主题切换 + 用户菜单 -->
    <div class="header-right">
      <!-- 通知铃铛 -->
      <NButton text class="header-action">
        <template #icon>
          <NBadge :value="notificationCount" :max="99">
            <NIcon size="18">
              <BellOutlined />
            </NIcon>
          </NBadge>
        </template>
      </NButton>

      <!-- 主题切换 -->
      <NButton text class="header-action" @click="toggleTheme">
        <template #icon>
          <NIcon size="18">
            <SunOutlined v-if="isDark" />
            <MoonOutlined v-else />
          </NIcon>
        </template>
      </NButton>

      <!-- 用户下拉菜单 -->
      <NDropdown :options="userMenuOptions" @select="handleUserMenuSelect">
        <div class="user-info">
          <NAvatar :size="32" :src="currentUser?.avatar" :fallback-src="defaultAvatar" round>
            {{ currentUser?.username?.charAt(0)?.toUpperCase() }}
          </NAvatar>
          <span class="username">{{ currentUser?.username || '用户' }}</span>
          <NIcon size="14" class="dropdown-icon">
            <DownOutlined />
          </NIcon>
        </div>
      </NDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  NButton,
  NIcon,
  NBreadcrumb,
  NBreadcrumbItem,
  NBadge,
  NDropdown,
  NAvatar,
  useMessage
} from 'naive-ui'
import {
  Menu as MenuOutlined,
  Notifications as BellOutlined,
  Sunny as SunOutlined,
  Moon as MoonOutlined,
  ChevronDown as DownOutlined,
  Person as UserOutlined,
  Settings as SettingOutlined,
  LogOut as LogoutOutlined,
  Grid as DashboardOutlined
} from '@vicons/ionicons5'
import { useGlobalStore } from '@/stores/global'
import { useUserStore } from '@/stores/user'

// 组件事件定义
defineEmits<{
  toggleCollapsed: []
}>()

const router = useRouter()
const route = useRoute()
const message = useMessage()
const globalStore = useGlobalStore()
const userStore = useUserStore()

// 使用全局状态的主题
const isDark = computed(() => globalStore.theme === 'dark')

// 通知数量
const notificationCount = ref(5)

// 默认头像
const defaultAvatar = 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'

// 使用用户状态管理的当前用户信息
const currentUser = computed(() => userStore.user)

// 面包屑路由配置类型
interface BreadcrumbRoute {
  label: string
  icon?: any
  parent?: string
}

// 面包屑导航配置
const breadcrumbRoutes: Record<string, BreadcrumbRoute> = {
  dashboard: { label: '仪表盘', icon: DashboardOutlined },
  'user-list': { label: '用户管理', parent: 'users' },
  users: { label: '用户管理', icon: UserOutlined },
  'user-detail': { label: '用户详情', parent: 'user-list' },
  'instance-list': { label: 'GPU实例', parent: 'instances' },
  instances: { label: 'GPU实例' },
  'order-list': { label: '订单管理', parent: 'orders' },
  orders: { label: '订单管理' },
  settings: { label: '系统设置' }
}

// 计算面包屑项目
const breadcrumbItems = computed(() => {
  const items = []
  const currentRouteName = route.name as string

  if (!currentRouteName || currentRouteName === 'dashboard') {
    return [
      {
        name: 'dashboard',
        label: '仪表盘',
        icon: DashboardOutlined,
        clickable: false
      }
    ]
  }

  // 构建面包屑层级
  let routeName = currentRouteName
  const chain = []

  while (routeName && breadcrumbRoutes[routeName]) {
    const routeConfig = breadcrumbRoutes[routeName]
    chain.unshift({
      name: routeName,
      label: routeConfig.label,
      icon: routeConfig.icon,
      clickable: routeName !== currentRouteName
    })
    routeName = routeConfig.parent || ''
  }

  // 始终包含首页
  if (chain.length > 0 && chain[0].name !== 'dashboard') {
    chain.unshift({
      name: 'dashboard',
      label: '仪表盘',
      icon: DashboardOutlined,
      clickable: true
    })
  }

  return chain
})

// 用户下拉菜单选项
const userMenuOptions = [
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h(NIcon, null, { default: () => h(UserOutlined) })
  },
  {
    label: '账户设置',
    key: 'account',
    icon: () => h(NIcon, null, { default: () => h(SettingOutlined) })
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogoutOutlined) })
  }
]

// 面包屑点击处理
const handleBreadcrumbClick = (item: any) => {
  if (item.clickable && item.name) {
    router.push({ name: item.name })
  }
}

// 主题切换
const toggleTheme = () => {
  globalStore.toggleTheme()
  message.info(globalStore.theme === 'dark' ? '已切换到暗色主题' : '已切换到亮色主题')
}

// 用户菜单选择处理
const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'profile':
      message.info('个人资料')
      break
    case 'account':
      message.info('账户设置')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    globalStore.setLoading(true)
    await userStore.logout()
    message.success('已退出登录')
    router.push({ name: 'dashboard' })
  } catch (error) {
    message.error('退出登录失败')
  } finally {
    globalStore.setLoading(false)
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  background: white;
  transition: background-color 0.3s ease;
}

/* 亮色主题 */
.app-header.light {
  background: white;
}

.app-header.light .header-action:hover {
  background-color: #f5f5f5;
}

.app-header.light .user-info:hover {
  background-color: #f5f5f5;
}

.app-header.light .username {
  color: #333;
}

.app-header.light .dropdown-icon {
  color: #999;
}

/* 暗色主题 */
.app-header.dark {
  background: #1e293b;
}

.app-header.dark .header-action:hover {
  background-color: #334155;
}

.app-header.dark .user-info:hover {
  background-color: #334155;
}

.app-header.dark .username {
  color: #f1f5f9;
}

.app-header.dark .dropdown-icon {
  color: #94a3b8;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.collapse-btn {
  margin-right: 16px;
  padding: 8px;
}

.breadcrumb {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-action {
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.username {
  font-size: 14px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.dropdown-icon {
  transition:
    transform 0.2s,
    color 0.3s ease;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .username {
    display: none;
  }

  .breadcrumb {
    display: none;
  }

  .header-left {
    flex: none;
  }
}
</style>
