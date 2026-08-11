import { ref } from 'vue'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

// State is outside the function so it acts as a global singleton
const state = ref({
  isVisible: false,
  title: '',
  message: '',
  variant: 'info' as ToastVariant
})

let timeoutId: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  const showToast = (
    message: string, 
    variant: ToastVariant = 'info', 
    title?: string, 
    duration = 4000
  ) => {
    state.value = { 
      isVisible: true, 
      message, 
      variant, 
      title: title || '' 
    }

    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      hideToast()
    }, duration)
  }

  const hideToast = () => {
    state.value.isVisible = false
  }

  return {
    state,
    showToast,
    hideToast
  }
}
