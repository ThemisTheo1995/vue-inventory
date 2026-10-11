<!-- src/views/items/ItemBarcodeCard.vue -->
<template>
  <BaseCard 
    v-if="item.barcode_id" 
    class="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 flex flex-col"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <QrCode class="w-4 h-4 text-slate-400" />
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Item QR Code
        </h3>
      </div>

      <!-- Print Button -->
      <button
        @click="printLabels"
        :disabled="isGenerating"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm border border-slate-200/60 dark:border-slate-700/60 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Print item barcode labels"
      >
        <Printer class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        <span>Print Labels</span>
      </button>
    </div>
    
    <div class="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/60 min-h-[170px]">
      <!-- Generating / Polling Spinner State (polls for up to 6-8s before timing out) -->
      <div v-if="isGenerating" class="flex flex-col items-center justify-center space-y-3 py-2">
        <div class="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center ring-8 ring-blue-500/10">
          <Loader2 class="w-8 h-8 animate-spin" />
        </div>
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse text-center">
          Checking cloud storage for barcode...
        </p>
      </div>

      <!-- QR Code Container -->
      <div v-else-if="!barcodeImageError" class="bg-white dark:bg-slate-200 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
        <img 
          :src="barcodeImageUrl" 
          :alt="`QR Code for ${item.title}`"
          class="w-32 h-32 object-contain mix-blend-multiply dark:opacity-85 dark:brightness-90 transition-all"
          @error="barcodeImageError = true"
        />
      </div>
      <div v-else class="flex flex-col items-center justify-center w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400">
        <QrCode class="w-8 h-8 opacity-50 mb-2" />
        <span class="text-[10px] font-medium text-center px-2">Preview unavailable</span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { QrCode, Printer, Loader2 } from 'lucide-vue-next'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { Item } from '../types/item.types'

const props = defineProps<{
  workspaceId: string
  item: Item
}>()

const isGenerating = ref(false)
const barcodeImageError = ref(false)
let retryTimer: number | null = null

const barcodeImageUrl = computed<string | undefined>(() => {
  if (!props.item?.barcode_id) return undefined

  const baseUrl = import.meta.env.VITE_S3_BARCODE_URL
  const filename = props.item.barcode_id.endsWith('.png')
    ? props.item.barcode_id
    : `${props.item.barcode_id}.png`

  return `${baseUrl}/${props.workspaceId}/items/${filename}`
})

const checkImageAvailability = () => {
  if (!props.item?.barcode_id) return
  isGenerating.value = true
  barcodeImageError.value = false

  if (retryTimer) clearTimeout(retryTimer)

  const url = barcodeImageUrl.value
  if (!url) {
    isGenerating.value = false
    barcodeImageError.value = true
    return
  }

  let attempts = 0
  const maxAttempts = 3
  const intervalMs = 1500

  const attemptLoad = () => {
    attempts++
    const img = new Image()
    img.src = `${url}?t=${Date.now()}`

    img.onload = () => {
      isGenerating.value = false
      barcodeImageError.value = false
    }

    img.onerror = () => {
      if (attempts < maxAttempts) {
        retryTimer = window.setTimeout(attemptLoad, intervalMs)
      } else {
        isGenerating.value = false
        barcodeImageError.value = true
      }
    }
  }

  attemptLoad()
}

watch(
  () => props.item?.barcode_id,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      checkImageAvailability()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (retryTimer) clearTimeout(retryTimer)
})

const printLabels = () => {
  if (!barcodeImageUrl.value || !props.item) return

  const printWindow = window.open('', '_blank', 'width=800,height=600')
  if (!printWindow) return

  const labelsHtml = Array.from({ length: 18 })
    .map(
      () => `
      <div class="label">
        <img src="${barcodeImageUrl.value}" alt="QR Code" />
        <div class="title">${props.item.title || 'Item'}</div>
        <div class="sku">SKU: ${props.item.sku || ''}</div>
      </div>
    `
    )
    .join('')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Labels - ${props.item.title}</title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; background: #fff; }
          .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(50mm, 1fr)); gap: 6mm; }
          .label { width: 50mm; height: 32mm; border: 1px dashed #cbd5e1; border-radius: 4px; padding: 3mm; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; page-break-inside: avoid; }
          .label img { width: 18mm; height: 18mm; object-fit: contain; }
          .label .title { font-size: 8pt; font-weight: 700; color: #0f172a; margin-top: 1.5mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
          .label .sku { font-size: 6.5pt; font-family: monospace; color: #64748b; }
          @media print { .label { border: 1px solid #e2e8f0; } }
        </style>
      </head>
      <body>
        <div class="grid">${labelsHtml}</div>
        <script>
          window.onload = () => { window.print(); window.close(); };
        <\/script>
      </body>
    </html>
  `)

  printWindow.document.close()
}
</script>
