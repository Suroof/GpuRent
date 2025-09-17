<template>
  <div class="login-page">
    <NResult status="info" title="登录页面" description="此功能正在开发中，敬请期待">
      <template #footer>
        <NButton @click="$router.push({ name: 'dashboard' })">返回仪表盘</NButton>
      </template>
    </NResult>
  </div>
</template>

<script setup lang="ts">
import { NResult, NButton } from 'naive-ui'
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
