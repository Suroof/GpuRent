<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NLoadingBarProvider,
  NSpin,
  darkTheme
} from 'naive-ui'
import { lightThemeOverrides, darkThemeOverrides } from '@/styles/theme'
import { useGlobalStore } from '@/stores/global'
import { computed } from 'vue'

const globalStore = useGlobalStore()

// 初始化全局状态
globalStore.initializeStore()

// 计算当前主题和主题覆盖
const currentTheme = computed(() => (globalStore.isDark ? darkTheme : null))
const currentThemeOverrides = computed(() =>
  globalStore.isDark ? darkThemeOverrides : lightThemeOverrides
)
</script>

<template>
  <NConfigProvider
    :theme="currentTheme"
    :theme-overrides="currentThemeOverrides"
    :class="globalStore.themeClass"
  >
    <NLoadingBarProvider>
      <NDialogProvider>
        <NMessageProvider>
          <NSpin :show="globalStore.isLoading" size="large">
            <div id="app">
              <RouterView />
            </div>
          </NSpin>
        </NMessageProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<style>
#app {
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

/* 亮色主题 */
.light #app {
  background-color: #f8fafc;
}

/* 暗色主题 */
.dark #app {
  background-color: #0f172a;
}
</style>
