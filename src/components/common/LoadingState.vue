<template>
  <div class="loading-state" :class="{ fullscreen: fullscreen }">
    <div class="loading-content">
      <NSpin :size="size" :show="true">
        <div class="loading-placeholder">
          <slot name="placeholder">
            <div class="default-placeholder" />
          </slot>
        </div>
      </NSpin>

      <div v-if="message" class="loading-message">
        {{ message }}
      </div>

      <div v-if="description" class="loading-description">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSpin } from 'naive-ui'

interface Props {
  size?: 'small' | 'medium' | 'large'
  message?: string
  description?: string
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  fullscreen: false
})
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 200px;
}

.loading-state.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  min-height: 100vh;
}

.loading-content {
  text-align: center;
  max-width: 400px;
}

.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.default-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #f0f0f0;
}

.loading-message {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.loading-description {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-state {
    padding: 16px;
    min-height: 150px;
  }

  .loading-message {
    font-size: 14px;
  }

  .loading-description {
    font-size: 12px;
  }

  .default-placeholder {
    width: 50px;
    height: 50px;
  }
}
</style>
