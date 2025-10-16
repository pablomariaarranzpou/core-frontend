<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="handleClose">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Cambiar Contraseña</h2>
            <button @click="handleClose" class="close-button" aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-description">
              Ingresa tu contraseña actual y tu nueva contraseña para actualizar tu cuenta.
            </p>

            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="currentPassword">Contraseña Actual</label>
                <div class="password-input-wrapper">
                  <input
                    id="currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    v-model="formData.currentPassword"
                    placeholder="Tu contraseña actual"
                    :disabled="loading"
                    autocomplete="current-password"
                  />
                  <button 
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="toggle-password"
                    :aria-label="showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  >
                    <svg v-if="!showCurrentPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="newPassword">Nueva Contraseña</label>
                <div class="password-input-wrapper">
                  <input
                    id="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    v-model="formData.newPassword"
                    placeholder="Tu nueva contraseña"
                    :disabled="loading"
                    autocomplete="new-password"
                  />
                  <button 
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="toggle-password"
                    :aria-label="showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  >
                    <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
                <div class="password-requirements">
                  <small :class="{ valid: formData.newPassword.length >= 8 }">
                    • Mínimo 8 caracteres
                  </small>
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirmar Nueva Contraseña</label>
                <div class="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="formData.confirmPassword"
                    placeholder="Confirma tu nueva contraseña"
                    :disabled="loading"
                    autocomplete="new-password"
                  />
                  <button 
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="toggle-password"
                    :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  >
                    <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
                <small v-if="formData.confirmPassword && formData.newPassword !== formData.confirmPassword" class="error-text">
                  Las contraseñas no coinciden
                </small>
              </div>

              <div v-if="error" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ error }}</span>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button 
              @click="handleClose" 
              class="btn-secondary"
              :disabled="loading"
            >
              Cancelar
            </button>
            <button 
              @click="handleSubmit" 
              class="btn-primary"
              :disabled="loading || !isValid"
            >
              <span v-if="!loading">Cambiar Contraseña</span>
              <span v-else class="loading-content">
                <span class="spinner"></span>
                Cambiando...
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  loading?: boolean
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', data: { oldPassword: string; newPassword: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
})

const emit = defineEmits<Emits>()

const formData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const isValid = computed(() => {
  return (
    formData.value.currentPassword.length > 0 &&
    formData.value.newPassword.length >= 8 &&
    formData.value.newPassword === formData.value.confirmPassword
  )
})

function handleClose() {
  if (!props.loading) {
    emit('update:modelValue', false)
    // Reset form después de cerrar
    setTimeout(() => {
      formData.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      showCurrentPassword.value = false
      showNewPassword.value = false
      showConfirmPassword.value = false
    }, 300)
  }
}

function handleSubmit() {
  if (isValid.value && !props.loading) {
    emit('confirm', {
      oldPassword: formData.value.currentPassword,
      newPassword: formData.value.newPassword
    })
  }
}

// Cerrar con Escape
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !props.loading) {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: var(--color-background);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
}

.close-button {
  background: transparent;
  border: none;
  color: var(--vt-c-text-2);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: var(--color-background-mute);
  color: var(--color-heading);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.modal-description {
  margin: 0 0 1.5rem 0;
  color: var(--vt-c-text-2);
  line-height: 1.6;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-heading);
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.password-input-wrapper input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-input-wrapper input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-background-mute);
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: var(--vt-c-text-2);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: var(--color-heading);
}

.password-requirements {
  margin-top: 0.5rem;
}

.password-requirements small {
  display: block;
  font-size: 0.8125rem;
  color: var(--vt-c-text-2);
  transition: color 0.2s ease;
}

.password-requirements small.valid {
  color: #10b981;
}

.error-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: #ef4444;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #ef4444;
  margin-top: 1rem;
}

:global(.dark) .error-message {
  background: rgba(248, 113, 113, 0.15);
  border-color: rgba(248, 113, 113, 0.3);
  color: #fca5a5;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transiciones */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-width: calc(100% - 2rem);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.25rem 1.5rem;
  }
}
</style>
