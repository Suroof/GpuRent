<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NConfigProvider, NMessageProvider, NDialogProvider, NLoadingBarProvider } from 'naive-ui'
import { lightThemeOverrides } from '@/styles/theme'
</script>

<template>
  <NConfigProvider :theme-overrides="lightThemeOverrides">
    <NLoadingBarProvider>
      <NDialogProvider>
        <NMessageProvider>
          <div id="app">
            <RouterView />
          </div>
        </NMessageProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<style>
#app {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>
