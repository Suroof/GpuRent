import { ref, nextTick, onMounted, onUnmounted, watch, readonly, type Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

export function useECharts(elRef: Ref<HTMLElement | null>, theme: string = 'default') {
  let chartInstance: echarts.ECharts | null = null
  const isLoading = ref(false)

  // 初始化图表
  const initChart = () => {
    if (!elRef.value) return

    chartInstance = echarts.init(elRef.value, theme)

    // 监听窗口大小变化
    window.addEventListener('resize', resize)
  }

  // 设置图表选项
  const setOption = (option: EChartsOption) => {
    if (!chartInstance) {
      // 如果图表实例还未初始化，等待一段时间再试
      setTimeout(() => {
        if (chartInstance) {
          chartInstance.setOption(option, true)
        }
      }, 100)
      return
    }

    chartInstance.setOption(option, true)
  }

  // 调整图表尺寸
  const resize = () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }

  // 显示加载状态
  const showLoading = () => {
    if (chartInstance) {
      isLoading.value = true
      chartInstance.showLoading('default', {
        text: '加载中...',
        color: '#3b82f6',
        textColor: '#666',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      })
    }
  }

  // 隐藏加载状态
  const hideLoading = () => {
    if (chartInstance) {
      isLoading.value = false
      chartInstance.hideLoading()
    }
  }

  // 销毁图表
  const dispose = () => {
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    window.removeEventListener('resize', resize)
  }

  // 监听容器变化
  watch(
    () => elRef.value,
    (el) => {
      if (el) {
        nextTick(() => {
          initChart()
        })
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    nextTick(() => {
      initChart()
    })
  })

  onUnmounted(() => {
    dispose()
  })

  return {
    chartInstance: readonly(ref(chartInstance)),
    isLoading: readonly(isLoading),
    setOption,
    resize,
    showLoading,
    hideLoading,
    dispose
  }
}

// 导出一些常用的图表配置
export const chartColors = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#f97316'
]

export const defaultGrid = {
  left: '3%',
  right: '4%',
  bottom: '3%',
  containLabel: true
}

export const defaultTooltip = {
  trigger: 'axis',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderColor: '#e5e7eb',
  borderWidth: 1,
  textStyle: {
    color: '#374151'
  }
}
