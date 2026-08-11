import { ref } from 'vue'

export type ConfirmVariant = 'danger' | 'warning' | 'primary'

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
}

// Global reactive states shared across all instances
const isOpen = ref(false)
const modalOptions = ref<Required<ConfirmOptions>>({
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'danger'
})

// Holds the intercepting resolver function
let resolvePromise: (value: boolean) => void

export function useConfirm() {
  const confirm = (options: ConfirmOptions) => {
    modalOptions.value = {
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'danger',
      ...options
    }
    isOpen.value = true
    
    // Return a promise that waits for the user to click OK or Cancel
    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  const handleConfirm = () => {
    isOpen.value = false
    if (resolvePromise) resolvePromise(true)
  }

  const handleCancel = () => {
    isOpen.value = false
    if (resolvePromise) resolvePromise(false)
  }

  return {
    isOpen,
    options: modalOptions,
    confirm,
    handleConfirm,
    handleCancel
  }
}
