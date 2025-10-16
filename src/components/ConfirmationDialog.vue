<template>
  <BaseModal
    v-model="isOpen"
    :title="title"
    :icon="type"
    :size="size"
    :closable="closable"
    :close-on-overlay="closeOnOverlay"
    :show-cancel="showCancel"
    show-confirm
    :cancel-text="cancelText"
    :confirm-text="confirmText"
    custom-class="confirmation-dialog-modal"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <div class="confirmation-message">
      {{ message }}
    </div>
    <div v-if="details" class="confirmation-details">
      {{ details }}
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  details?: string
  type?: 'success' | 'warning' | 'error' | 'info' | 'question'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  closeOnOverlay?: boolean
  cancelText?: string
  confirmText?: string
  showCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar acción',
  type: 'question',
  size: 'sm',
  closable: true,
  closeOnOverlay: true,
  cancelText: 'Cancelar',
  confirmText: 'Confirmar',
  showCancel: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

function handleConfirm() {
  emit('confirm')
  isOpen.value = false
}

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}
</script>

<style scoped>
.confirmation-message {
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: 0;
}

.confirmation-details {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-background-mute);
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vt-c-text-2);
  text-align: left;
  border: 1px solid var(--color-border);
}
</style>

<style>
/* Global style para aumentar z-index del modal de confirmación */
.confirmation-dialog-modal {
  z-index: 10001 !important;
}
</style>
