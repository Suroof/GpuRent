<template>
  <div class="app-header">
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

// 组件事件定义
defineEmits<{
  toggleCollapsed: []
}>()

const router = useRouter()
const route = useRoute()
const message = useMessage()

// 主题切换状态
const isDark = ref(false)

// 通知数量
const notificationCount = ref(5)

// 默认头像
const defaultAvatar = 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'

// 模拟当前用户信息
const currentUser = ref({
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  role: 'admin'
})

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
  isDark.value = !isDark.value
  message.info(isDark.value ? '已切换到暗色主题' : '已切换到亮色主题')
  // TODO: 实际的主题切换逻辑
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
const handleLogout = () => {
  // 清除用户信息
  localStorage.removeItem('access_token')
  localStorage.removeItem('user_info')

  message.success('已退出登录')

  // 跳转到登录页（这里暂时跳转到首页）
  router.push({ name: 'dashboard' })
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background: white;
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

.header-action:hover {
  background-color: #f5f5f5;
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

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  color: #999;
  transition: transform 0.2s;
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
