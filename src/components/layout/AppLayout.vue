<template>
  <div class="app-layout">
    <NLayout has-sider position="absolute">
      <NLayoutSider
        :collapsed="collapsed.value"
        :collapsed-width="isMobile ? 0 : 64"
        :width="240"
        collapse-mode="width"
        bordered
        :show-trigger="!isMobile"
        @collapse="handleCollapse"
        @expand="handleExpand"
        :class="{ 'mobile-sidebar': isMobile }"
      >
        <AppSidebar :collapsed="collapsed.value" />
      </NLayoutSider>

      <!-- 移动端遮罩 -->
      <div
        v-if="isMobile && !collapsed.value"
        class="mobile-overlay"
        @click="handleToggleCollapsed"
      />

      <NLayout>
        <NLayoutHeader bordered class="app-header">
          <AppHeader :collapsed="collapsed.value" @toggle-collapsed="handleToggleCollapsed" />
        </NLayoutHeader>

        <NLayoutContent class="app-content" content-style="padding: 24px;">
          <router-view />
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent } from 'naive-ui'
import { useGlobalStore } from '@/stores/global'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const globalStore = useGlobalStore()

// 响应式设计状态
const screenWidth = ref(window.innerWidth)
const isMobile = computed(() => screenWidth.value < 768)

// 使用全局状态管理的侧边栏折叠状态
const collapsed = computed(() => {
  // 移动端默认折叠
  if (isMobile.value) {
    return { value: globalStore.sidebarCollapsed }
  }
  return { value: globalStore.sidebarCollapsed }
})

// 屏幕尺寸监听
const handleResize = () => {
  screenWidth.value = window.innerWidth
  // 移动端自动折叠侧边栏
  if (isMobile.value && !globalStore.sidebarCollapsed) {
    globalStore.setSidebarCollapsed(true)
  }
}

const handleToggleCollapsed = () => {
  globalStore.toggleSidebar()
}

const handleCollapse = () => {
  globalStore.setSidebarCollapsed(true)
}

const handleExpand = () => {
  globalStore.setSidebarCollapsed(false)
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始化时检查是否为移动端
  if (isMobile.value) {
    globalStore.setSidebarCollapsed(true)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.app-layout {
  height: 100vh;
}

.app-header {
  height: 64px;
  display: flex;
  align-items: center;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 100;
}

.app-content {
  height: calc(100vh - 64px);
  background: #f0f2f5;
  overflow-y: auto;
}

/* 移动端侧边栏样式 */
.mobile-sidebar {
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

/* 移动端遮罩 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-content {
    padding: 16px !important;
  }
}

@media (max-width: 480px) {
  .app-content {
    padding: 12px !important;
  }
}
</style>
