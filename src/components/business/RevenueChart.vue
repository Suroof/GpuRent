<template>
  <ChartComponent :option="chartOption" :loading="loading" height="300px" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'
import { chartColors, defaultGrid, defaultTooltip } from '@/composables/useECharts'
import type { EChartsOption } from 'echarts'

interface RevenueData {
  date: string
  revenue: number
  orders: number
}

const props = withDefaults(
  defineProps<{
    data?: RevenueData[]
    loading?: boolean
  }>(),
  {
    data: () => [],
    loading: false
  }
)

const chartOption = computed<EChartsOption>(() => {
  const dates = props.data.map((item) => item.date)
  const revenues = props.data.map((item) => item.revenue)
  const orders = props.data.map((item) => item.orders)

  return {
    tooltip: {
      ...defaultTooltip,
      formatter: (params: any) => {
        const data = Array.isArray(params) ? params : [params]
        let html = `<div style="margin-bottom: 4px; font-weight: 600;">${data[0].axisValue}</div>`

        data.forEach((item: any) => {
          const color = item.color
          const value =
            item.seriesName === '收入' ? `¥${item.value.toLocaleString()}` : `${item.value}单`
          html += `
            <div style="display: flex; align-items: center; margin: 2px 0;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; margin-right: 8px;"></span>
              <span style="flex: 1;">${item.seriesName}</span>
              <span style="font-weight: 600; margin-left: 16px;">${value}</span>
            </div>
          `
        })

        return html
      }
    },
    legend: {
      data: ['收入', '订单数'],
      top: 30,
      itemGap: 20
    },
    grid: {
      ...defaultGrid,
      top: 70
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '收入 (元)',
        position: 'left',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
          formatter: (value: number) => {
            if (value >= 10000) {
              return `${(value / 10000).toFixed(1)}万`
            }
            return value.toString()
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: '订单数',
        position: 'right',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '收入',
        type: 'line',
        yAxisIndex: 0,
        data: revenues,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: chartColors[0]
        },
        itemStyle: {
          color: chartColors[0]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${chartColors[0]}20` },
              { offset: 1, color: `${chartColors[0]}05` }
            ]
          }
        }
      },
      {
        name: '订单数',
        type: 'bar',
        yAxisIndex: 1,
        data: orders,
        itemStyle: {
          color: chartColors[1],
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '40%'
      }
    ]
  }
})
</script>
