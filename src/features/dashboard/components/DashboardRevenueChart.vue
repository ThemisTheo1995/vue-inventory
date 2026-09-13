<!-- src/features/dashboard/components/DashboardRevenueChart.vue -->
<template>
  <section class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5 sm:p-6 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
          <ChartColumn class="w-5 h-5 text-brand-500" />
          Revenue Overview
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Last 30 Days Performance</p>
      </div>
    </div>
    <div class="relative w-full h-64 sm:h-72">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChartColumn } from 'lucide-vue-next'
import { formatDate } from '../utils/formatters'
import type { DashboardResponse } from '../types/dashboard.types'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  type ChartConfiguration
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

const props = defineProps<{
  chartData: DashboardResponse['revenue_chart']
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const initChart = () => {
  if (!chartCanvas.value || !props.chartData?.length) return
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const labels = props.chartData.map(d => formatDate(String(d.date)))
  const data = props.chartData.map(d => d.revenue / 100)

  const brandGradient = ctx.createLinearGradient(0, 0, 0, 250)
  brandGradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)')
  brandGradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)')

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#3b82f6',
        borderWidth: 3,
        backgroundColor: brandGradient,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false }, 
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          usePointStyle: true,
          callbacks: { label: (context) => ` Revenue: £${(context.parsed.y ?? 0).toLocaleString()}` }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11, weight: 600 } } },
        y: {
          border: { display: false },
          grid: { color: 'rgba(148, 163, 184, 0.12)' },
          ticks: { color: '#94a3b8', font: { size: 11, weight: 600 }, callback: (value) => `£${Number(value).toLocaleString()}` }
        }
      }
    }
  }

  chartInstance = new Chart(ctx, config)
}

onMounted(() => initChart())
onUnmounted(() => { if (chartInstance) chartInstance.destroy() })
</script>
