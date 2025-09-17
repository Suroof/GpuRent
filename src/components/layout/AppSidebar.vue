<template>
  <div class="app-sidebar">
    <!-- Logo区域 -->
    <div class="sidebar-logo">
      <div class="logo-container">
        <div class="logo-icon">
          <NIcon size="28">
            <ServerOutlined />
          </NIcon>
        </div>
        <transition name="logo-text">
          <span v-show="!collapsed" class="logo-text">GPU租借平台</span>
        </transition>
      </div>
    </div>

    <!-- 导航菜单 -->
    <div class="sidebar-menu">
      <NMenu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NMenu, NIcon } from 'naive-ui'
import {
  Grid as DashboardOutlined,
  Person as UserOutlined,
  Desktop as DesktopOutlined,
  Cart as ShoppingCartOutlined,
  Settings as SettingOutlined,
  Server as ServerOutlined
} from '@vicons/ionicons5'

interface Props {
  collapsed: boolean
}

defineProps<Props>()

const router = useRouter()
const route = useRoute()

// 当前激活的菜单项
const activeKey = computed(() => route.name as string)

// 菜单配置
const menuOptions = [
  {
    label: '仪表盘',
    key: 'dashboard',
    icon: () => h(NIcon, null, { default: () => h(DashboardOutlined) })
  },
  {
    label: '用户管理',
    key: 'users',
    icon: () => h(NIcon, null, { default: () => h(UserOutlined) }),
    children: [
      {
        label: '用户列表',
        key: 'user-list'
      }
    ]
  },
  {
    label: 'GPU实例',
    key: 'instances',
    icon: () => h(NIcon, null, { default: () => h(DesktopOutlined) }),
    children: [
      {
        label: '实例列表',
        key: 'instance-list'
      },
      {
        label: '实例监控',
        key: 'instance-monitor'
      }
    ]
  },
  {
    label: '订单管理',
    key: 'orders',
    icon: () => h(NIcon, null, { default: () => h(ShoppingCartOutlined) }),
    children: [
      {
        label: '订单列表',
        key: 'order-list'
      }
    ]
  },
  {
    label: '系统设置',
    key: 'settings',
    icon: () => h(NIcon, null, { default: () => h(SettingOutlined) }),
    children: [
      {
        label: '基础配置',
        key: 'basic-settings'
      },
      {
        label: '费率管理',
        key: 'rate-settings'
      }
    ]
  }
]

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  router.push({ name: key })
}
</script>

<style scoped>
.app-sidebar {
  height: 100%;
  background: white;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
}

.logo-text-enter-active,
.logo-text-leave-active {
  transition: all 0.3s ease;
}

.logo-text-enter-from,
.logo-text-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.sidebar-menu {
  padding: 16px 0;
}

:deep(.n-menu-item-content) {
  padding-left: 24px !important;
}

:deep(.n-menu-item-content--collapsed) {
  padding-left: 24px !important;
}

:deep(.n-submenu-children .n-menu-item-content) {
  padding-left: 48px !important;
}
</style>
