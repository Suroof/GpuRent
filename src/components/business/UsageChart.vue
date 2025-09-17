<template>
  <ChartComponent :option="chartOption" :loading="loading" height="300px" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'
import { chartColors, defaultGrid, defaultTooltip } from '@/composables/useECharts'
import type { EChartsOption } from 'echarts'

interface UsageData {
  type: string
  usage: number
  total: number
}

const props = withDefaults(
  defineProps<{
    data?: UsageData[]
    loading?: boolean
  }>(),
  {
    data: () => [],
    loading: false
  }
)

const chartOption = computed<EChartsOption>(() => {
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      formatter: (params: any) => {
        const percentage = ((params.value / params.data.total) * 100).toFixed(1)
        return `
          <div style="margin-bottom: 4px; font-weight: 600;">${params.name}</div>
          <div style="display: flex; align-items: center;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${params.color}; margin-right: 8px;"></span>
            <span style="flex: 1;">使用中</span>
            <span style="font-weight: 600; margin-left: 16px;">${params.value}/${params.data.total} (${percentage}%)</span>
          </div>
        `
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: props.data.map((item) => item.type),
      textStyle: {
        color: '#374151'
      }
    },
    series: [
      {
        name: 'GPU使用情况',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data.map((item, index) => ({
          value: item.usage,
          name: item.type,
          total: item.total,
          itemStyle: {
            color: chartColors[index % chartColors.length]
          }
        }))
      }
    ]
  }
})
</script>
