import type { Directive } from 'vue'
import { tooltipState } from '@/composables/useTooltipState'

export const vTooltip: Directive = {
  mounted(el, binding) {
    el._text = binding.value

    const show = () => {
      if (!el._text) return
      const rect = el.getBoundingClientRect()
      tooltipState.text = el._text
      
      // Horizontal center of the target element
      tooltipState.x = rect.left + rect.width / 2
      
      // If element is too close to the top of the viewport, flip to bottom
      if (rect.top < 40) {
        tooltipState.position = 'bottom'
        tooltipState.y = rect.bottom + 8 // 8px spacing
      } else {
        tooltipState.position = 'top'
        tooltipState.y = rect.top - 8 // 8px spacing
      }
      
      tooltipState.visible = true
    }

    const hide = () => {
      tooltipState.visible = false
    }

    el._showTooltip = show
    el._hideTooltip = hide

    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)
    el.addEventListener('focus', show)
    el.addEventListener('blur', hide)
  },
  updated(el, binding) {
    el._text = binding.value
    
    // Only update the state text if this specific element is the one currently showing the tooltip
    if (tooltipState.visible && tooltipState.text === binding.oldValue) {
      tooltipState.text = binding.value
    }
  },
  unmounted(el) {
    if (el._showTooltip) {
      el.removeEventListener('mouseenter', el._showTooltip)
      el.removeEventListener('mouseleave', el._hideTooltip)
      el.removeEventListener('focus', el._showTooltip)
      el.removeEventListener('blur', el._hideTooltip)
    }
  }
}
