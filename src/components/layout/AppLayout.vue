<template>
  <div class="app-layout">
    <NLayout has-sider position="absolute">
      <NLayoutSider
        :collapsed="collapsed"
        :collapsed-width="64"
        :width="240"
        collapse-mode="width"
        bordered
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <AppSidebar :collapsed="collapsed" />
      </NLayoutSider>

      <NLayout>
        <NLayoutHeader bordered class="app-header">
          <AppHeader :collapsed="collapsed" @toggle-collapsed="handleToggleCollapsed" />
        </NLayoutHeader>

        <NLayoutContent class="app-content" content-style="padding: 24px;">
          <router-view />
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent } from 'naive-ui'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const collapsed = ref(false)

const handleToggleCollapsed = () => {
  collapsed.value = !collapsed.value
}
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
}

.app-content {
  height: calc(100vh - 64px);
  background: #f0f2f5;
  overflow-y: auto;
}
</style>
