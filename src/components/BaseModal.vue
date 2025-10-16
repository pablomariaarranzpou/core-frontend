<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" :class="customClass" @click="handleOverlayClick">
        <Transition name="modal-scale">
          <div v-if="modelValue" class="modal-container" @click.stop :class="[sizeClass, customClass]">
            <!-- Header -->
            <div v-if="!hideHeader" class="modal-header">
              <div class="modal-header-content">
                <div v-if="icon" class="modal-icon" :class="iconClass" v-html="iconSvg"></div>
                <h2 v-if="title" class="modal-title">{{ title }}</h2>
              </div>
              <button v-if="closable" class="modal-close" @click="close" aria-label="Cerrar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body" :class="{ 'no-header': hideHeader }">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="!hideFooter" class="modal-footer">
              <slot name="footer">
                <button v-if="showCancel" class="modal-btn modal-btn-secondary" @click="cancel">
                  {{ cancelText }}
                </button>
                <button v-if="showConfirm" class="modal-btn modal-btn-primary" @click="confirm">
                  {{ confirmText }}
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  icon?: 'success' | 'warning' | 'error' | 'info' | 'question'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  closeOnOverlay?: boolean
  hideHeader?: boolean
  hideFooter?: boolean
  showCancel?: boolean
  showConfirm?: boolean
  cancelText?: string
  confirmText?: string
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
  closeOnOverlay: true,
  hideHeader: false,
  hideFooter: false,
  showCancel: false,
  showConfirm: false,
  cancelText: 'Cancelar',
  confirmText: 'Confirmar',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'cancel': []
  'confirm': []
}>()

const sizeClass = computed(() => `modal-${props.size}`)

const iconClass = computed(() => {
  if (!props.icon) return ''
  return `modal-icon-${props.icon}`
})

const iconSvg = computed(() => {
  const svgs: Record<string, string> = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 9 10 15 8 13"></polyline></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    question: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  }
  return props.icon ? svgs[props.icon] : ''
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function cancel() {
  emit('cancel')
  close()
}

function confirm() {
  emit('confirm')
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* Container */
.modal-container {
  background: var(--color-background-soft);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 3rem);
  overflow: hidden;
  width: 100%;
}

/* Sizes */
.modal-sm { max-width: 400px; }
.modal-md { max-width: 500px; }
.modal-lg { max-width: 700px; }
.modal-xl { max-width: 900px; }

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem 2rem 1.5rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
}

.modal-icon {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon-success {
  color: rgb(52, 199, 89);
}

.modal-icon-warning {
  color: rgb(255, 159, 10);
}

.modal-icon-error {
  color: rgb(255, 69, 58);
}

.modal-icon-info {
  color: rgb(59, 130, 246);
}

.modal-icon-question {
  color: rgb(139, 92, 246);
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.modal-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-background-mute);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-background);
  transform: scale(1.1);
}

/* Body */
.modal-body {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  flex: 1;
  color: var(--vt-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
}

.modal-body.no-header {
  padding-top: 2rem;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem 2rem 2rem 2rem;
  border-top: 1px solid var(--color-border);
  justify-content: center;
}

.modal-btn {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
  min-width: 120px;
}

.modal-btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.modal-btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.modal-btn-primary:active {
  transform: translateY(0);
}

.modal-btn-secondary {
  background: var(--color-background-mute);
  color: var(--color-heading);
  border: 1px solid var(--color-border);
}

.modal-btn-secondary:hover {
  background: var(--color-background);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-scale-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-container {
    max-height: calc(100vh - 2rem);
    border-radius: 16px;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1.25rem 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body {
    padding: 1.25rem 1.5rem;
  }

  .modal-footer {
    padding: 1.25rem 1.5rem 1.5rem 1.5rem;
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
  }

  .modal-close {
    top: 1rem;
    right: 1rem;
  }
}
</style>
