// src/composables/useTooltipState.ts
import { reactive } from 'vue'

export const tooltipState = reactive({
  visible: false,
  text: '',
  x: 0,
  y: 0,
  position: 'top' as 'top' | 'bottom'
})
