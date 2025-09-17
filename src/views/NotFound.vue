<template>
  <div class="not-found">
    <NResult
      status="404"
      title="404"
      description="抱歉，您访问的页面不存在"
    >
      <template #footer>
        <NSpace>
          <NButton @click="$router.back()">返回上页</NButton>
          <NButton type="primary" @click="$router.push({ name: 'dashboard' })">
            返回首页
          </NButton>
        </NSpace>
      </template>
    </NResult>
  </div>
</template>

<script setup lang="ts">
import { NResult, NButton, NSpace } from 'naive-ui'
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>