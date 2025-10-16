import { ref } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  details?: string
  type?: 'success' | 'warning' | 'error' | 'info' | 'question'
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

const confirmState = ref({
  isOpen: false,
  title: '',
  message: '',
  details: '',
  type: 'question' as 'success' | 'warning' | 'error' | 'info' | 'question',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  showCancel: true,
  onConfirm: undefined as (() => void | Promise<void>) | undefined,
  onCancel: undefined as (() => void) | undefined,
})

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      confirmState.value = {
        isOpen: true,
        title: options.title || 'Confirmar acción',
        message: options.message,
        details: options.details || '',
        type: options.type || 'question',
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        showCancel: options.showCancel !== undefined ? options.showCancel : true,
        onConfirm: async () => {
          if (options.onConfirm) {
            await options.onConfirm()
          }
          resolve(true)
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel()
          }
          resolve(false)
        },
      }
    })
  }

  function handleConfirm() {
    if (confirmState.value.onConfirm) {
      confirmState.value.onConfirm()
    }
    confirmState.value.isOpen = false
  }

  function handleCancel() {
    if (confirmState.value.onCancel) {
      confirmState.value.onCancel()
    }
    confirmState.value.isOpen = false
  }

  return {
    confirmState,
    confirm,
    handleConfirm,
    handleCancel,
  }
}
