<template>
  <div class="error-state" :class="{ fullscreen: fullscreen }">
    <div class="error-content">
      <div class="error-icon">
        <NIcon :size="iconSize" :color="iconColor">
          <component :is="errorIcon" />
        </NIcon>
      </div>

      <div class="error-message">
        {{ message || '出现了一些问题' }}
      </div>

      <div v-if="description" class="error-description">
        {{ description }}
      </div>

      <div v-if="showRetry || showHome" class="error-actions">
        <NButton v-if="showRetry" type="primary" @click="handleRetry" :loading="retrying">
          重试
        </NButton>

        <NButton v-if="showHome" @click="handleGoHome"> 返回首页 </NButton>

        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon, NButton } from 'naive-ui'
import {
  Warning as WarningIcon,
  AlertCircle as ErrorIcon,
  WifiOff as NetworkIcon,
  Refresh as RefreshIcon
} from '@vicons/ionicons5'

interface Props {
  type?: 'error' | 'network' | 'warning' | '404'
  message?: string
  description?: string
  showRetry?: boolean
  showHome?: boolean
  fullscreen?: boolean
  onRetry?: () => void | Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  showRetry: true,
  showHome: true,
  fullscreen: false
})

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()
const retrying = ref(false)

// 错误图标映射
const errorIconMap = {
  error: ErrorIcon,
  network: NetworkIcon,
  warning: WarningIcon,
  '404': ErrorIcon
}

// 错误颜色映射
const errorColorMap = {
  error: '#f56565',
  network: '#ed8936',
  warning: '#ecc94b',
  '404': '#9f7aea'
}

const errorIcon = computed(() => errorIconMap[props.type])
const iconColor = computed(() => errorColorMap[props.type])
const iconSize = computed(() => (props.fullscreen ? 64 : 48))

// 重试处理
const handleRetry = async () => {
  if (props.onRetry) {
    try {
      retrying.value = true
      await props.onRetry()
    } catch (error) {
      console.error('重试失败:', error)
    } finally {
      retrying.value = false
    }
  }
  emit('retry')
}

// 返回首页
const handleGoHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 300px;
}

.error-state.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: 9999;
  min-height: 100vh;
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  margin-bottom: 24px;
}

.error-message {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 12px;
  line-height: 1.5;
}

.error-description {
  font-size: 14px;
  color: #718096;
  margin-bottom: 24px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-state {
    padding: 16px;
    min-height: 250px;
  }

  .error-message {
    font-size: 16px;
  }

  .error-description {
    font-size: 13px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .error-actions :deep(.n-button) {
    width: 200px;
  }
}
</style>
