import { ref } from 'vue'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

// State is outside the function so it acts as a global singleton
const state = ref({
  isVisible: false,
  title: '',
  message: '',
  variant: 'info' as ToastVariant,
  duration: 10000,
  progress: 100
})

let animationFrameId: number
let startTime: number = 0
let pausedTime: number = 0
let isPaused: boolean = false

export function useToast() {
  const showToast = (
    message: string, 
    variant: ToastVariant = 'info', 
    title?: string, 
    duration = 10000 // default 10 seconds
  ) => {
    state.value = { 
      isVisible: true, 
      message, 
      variant, 
      title: title || '',
      duration,
      progress: 100
    }

    // Reset timer variables
    pausedTime = 0
    isPaused = false
    cancelAnimationFrame(animationFrameId)
    startTimer()
  }

  const startTimer = () => {
    // Calculate the actual start time factoring in any paused duration
    startTime = performance.now() - pausedTime

    const animate = (currentTime: number) => {
      if (isPaused) return

      const elapsed = currentTime - startTime
      const remaining = Math.max(0, state.value.duration - elapsed)
      
      // Update progress percentage for the UI bar
      state.value.progress = (remaining / state.value.duration) * 100

      if (remaining > 0) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        hideToast()
      }
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  const pauseToast = () => {
    if (!state.value.isVisible) return
    isPaused = true
    cancelAnimationFrame(animationFrameId)
    pausedTime = performance.now() - startTime
  }

  const resumeToast = () => {
    if (!state.value.isVisible) return
    isPaused = false
    startTimer()
  }

  const hideToast = () => {
    state.value.isVisible = false
    cancelAnimationFrame(animationFrameId)
  }

  return {
    state,
    showToast,
    hideToast,
    pauseToast,
    resumeToast
  }
}
