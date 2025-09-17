<template>
  <div ref="chartRef" class="chart-container" :style="{ width, height }" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, type PropType } from 'vue'
import { useECharts } from '@/composables/useECharts'
import type { EChartsOption } from 'echarts'

interface Props {
  option: EChartsOption
  width?: string
  height?: string
  loading?: boolean
  theme?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '300px',
  loading: false,
  theme: 'default'
})

const chartRef = ref<HTMLElement | null>(null)
const { setOption, showLoading, hideLoading } = useECharts(chartRef, props.theme)

// 初始化图表
const initChart = async () => {
  await nextTick()
  if (props.option) {
    setOption(props.option)
  }
}

// 监听选项变化
watch(
  () => props.option,
  (newOption) => {
    if (newOption) {
      setOption(newOption)
    }
  },
  { deep: true, immediate: false }
)

// 监听加载状态
watch(
  () => props.loading,
  (loading) => {
    if (loading) {
      showLoading()
    } else {
      hideLoading()
    }
  },
  { immediate: true }
)

// 组件挂载后初始化图表
onMounted(() => {
  initChart()
})
</script>

<style scoped>
.chart-container {
  min-height: 200px;
  position: relative;
}
</style>
