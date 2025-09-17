<template>
  <NCard class="stats-card" :class="{ loading: loading }">
    <div class="stats-content">
      <!-- 图标区域 -->
      <div class="stats-icon" :style="{ backgroundColor: `${color}15`, borderColor: color }">
        <NIcon :size="24" :color="color">
          <component :is="icon" />
        </NIcon>
      </div>

      <!-- 数据区域 -->
      <div class="stats-data">
        <div class="stats-title">{{ title }}</div>
        <div class="stats-value-wrapper">
          <NSkeleton v-if="loading" text :repeat="1" />
          <template v-else>
            <span class="stats-value">{{ value }}</span>
            <span v-if="suffix" class="stats-suffix">{{ suffix }}</span>
          </template>
        </div>

        <!-- 增长率 -->
        <div v-if="!loading && growth !== undefined" class="stats-growth">
          <NIcon :size="14" :color="growth >= 0 ? '#10B981' : '#EF4444'" class="growth-icon">
            <TrendingUp v-if="growth >= 0" />
            <TrendingDown v-else />
          </NIcon>
          <span class="growth-text" :style="{ color: growth >= 0 ? '#10B981' : '#EF4444' }">
            {{ Math.abs(growth).toFixed(1) }}%
          </span>
          <span class="growth-label">较上月</span>
        </div>
      </div>
    </div>

    <!-- 加载状态遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <NSpin size="small" />
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NIcon, NSkeleton, NSpin } from 'naive-ui'
import { TrendingUp, TrendingDown } from '@vicons/ionicons5'

interface Props {
  title: string
  value: string | number
  suffix?: string
  growth?: number
  icon: any
  color?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: '#3B82F6',
  loading: false
})

// 格式化数值显示
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})
</script>

<style scoped>
.stats-card {
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stats-card.loading {
  pointer-events: none;
}

.stats-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 4px;
}

.stats-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.stats-card:hover .stats-icon {
  transform: scale(1.1);
}

.stats-data {
  flex: 1;
  min-width: 0;
}

.stats-title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.stats-value-wrapper {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stats-suffix {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}

.stats-growth {
  display: flex;
  align-items: center;
  gap: 4px;
}

.growth-icon {
  display: flex;
  align-items: center;
}

.growth-text {
  font-size: 14px;
  font-weight: 600;
}

.growth-label {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 4px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(1px);
}

/* 数值动画 */
.stats-value {
  transition: all 0.3s ease;
}

.stats-card:hover .stats-value {
  color: var(--primary-color, #3b82f6);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .stats-content {
    gap: 12px;
  }

  .stats-icon {
    width: 40px;
    height: 40px;
  }

  .stats-value {
    font-size: 24px;
  }

  .stats-suffix {
    font-size: 14px;
  }
}

/* 暗色主题支持 */
:deep(.n-card.n-card--bordered) {
  transition: all 0.3s ease;
}

.stats-card:hover :deep(.n-card.n-card--bordered) {
  border-color: var(--primary-color, #3b82f6);
}
</style>
