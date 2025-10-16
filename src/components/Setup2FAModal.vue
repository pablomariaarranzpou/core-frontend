<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="handleClose">
        <div class="modal-container">
          <div class="modal-header">
            <h2>{{ isEnabled ? 'Desactivar' : 'Activar' }} Autenticación 2FA</h2>
            <button @click="handleClose" class="close-button" aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Desactivar 2FA -->
            <div v-if="isEnabled && step === 'disable'">
              <div class="warning-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                  <h3>⚠️ Desactivar 2FA</h3>
                  <p>Tu cuenta será menos segura sin la autenticación de dos factores. Podrás reactivarla en cualquier momento.</p>
                </div>
              </div>
            </div>

            <!-- Paso 1: Introducción -->
            <div v-else-if="step === 'intro'">
              <div class="info-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div>
                  <h3>Aumenta la seguridad de tu cuenta</h3>
                  <p>La autenticación de dos factores (2FA) añade una capa extra de seguridad a tu cuenta. Necesitarás una app de autenticación como:</p>
                  <ul>
                    <li>Google Authenticator</li>
                    <li>Microsoft Authenticator</li>
                    <li>Authy</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Paso 2: Mostrar QR y código -->
            <div v-else-if="step === 'setup'">
              <p class="step-description">
                <strong>Paso 1:</strong> Escanea el código QR con tu app de autenticación
              </p>

              <div class="qr-section">
                <div class="qr-code-container">
                  <QrcodeVue 
                    v-if="secretCode"
                    :value="totpUri"
                    :size="200"
                    level="M"
                    :margin="2"
                    render-as="svg"
                    class="qr-code"
                  />
                  <div v-else class="qr-code-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                      <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                      <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                      <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                    </svg>
                    <p class="qr-hint">Generando código QR...</p>
                  </div>
                </div>

                <div class="divider">
                  <span>o</span>
                </div>

                <div class="manual-code">
                  <p><strong>Paso 2:</strong> O ingresa este código manualmente:</p>
                  <div class="code-box">
                    <code>{{ secretCode }}</code>
                    <button @click="copyCode" class="copy-button" :class="{ copied: codeCopied }">
                      <svg v-if="!codeCopied" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {{ codeCopied ? '¡Copiado!' : 'Copiar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paso 3: Verificar código -->
            <div v-else-if="step === 'verify'">
              <p class="step-description">
                <strong>Paso 3:</strong> Ingresa el código de 6 dígitos de tu app
              </p>

              <form @submit.prevent="handleVerify">
                <div class="form-group">
                  <label for="verificationCode">Código de Verificación</label>
                  <input
                    id="verificationCode"
                    type="text"
                    v-model="verificationCode"
                    placeholder="000000"
                    maxlength="6"
                    pattern="[0-9]{6}"
                    :disabled="loading"
                    autocomplete="off"
                    class="code-input"
                    @input="formatCodeInput"
                  />
                  <small class="field-hint">Ingresa el código de 6 dígitos que aparece en tu app</small>
                </div>
              </form>
            </div>

            <div v-if="error" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>
          </div>

          <div class="modal-footer">
            <button 
              @click="handleClose" 
              class="btn-secondary"
              :disabled="loading"
            >
              Cancelar
            </button>

            <!-- Desactivar 2FA -->
            <button 
              v-if="isEnabled && step === 'disable'"
              @click="handleDisable" 
              class="btn-danger"
              :disabled="loading"
            >
              <span v-if="!loading">Sí, desactivar</span>
              <span v-else class="loading-content">
                <span class="spinner"></span>
                Desactivando...
              </span>
            </button>

            <!-- Paso intro - Comenzar -->
            <button 
              v-else-if="step === 'intro'"
              @click="handleStart" 
              class="btn-primary"
              :disabled="loading"
            >
              <span v-if="!loading">Comenzar Configuración</span>
              <span v-else class="loading-content">
                <span class="spinner"></span>
                Cargando...
              </span>
            </button>

            <!-- Paso setup - Siguiente -->
            <button 
              v-else-if="step === 'setup'"
              @click="step = 'verify'" 
              class="btn-primary"
              :disabled="loading"
            >
              Siguiente
            </button>

            <!-- Paso verify - Verificar -->
            <button 
              v-else-if="step === 'verify'"
              @click="handleVerify" 
              class="btn-primary"
              :disabled="loading || !isCodeValid"
            >
              <span v-if="!loading">Verificar y Activar</span>
              <span v-else class="loading-content">
                <span class="spinner"></span>
                Verificando...
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
import QrcodeVue from 'qrcode.vue'

interface Props {
  modelValue: boolean
  isEnabled?: boolean
  secretCode?: string
  userEmail?: string
  loading?: boolean
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'disable'): void
  (e: 'setup'): void
  (e: 'verify', code: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isEnabled: false,
  secretCode: '',
  userEmail: '',
  loading: false,
  error: ''
})

const emit = defineEmits<Emits>()

// Estado del modal
const step = ref<'intro' | 'setup' | 'verify' | 'disable'>(
  props.isEnabled ? 'disable' : 'intro'
)

const verificationCode = ref('')
const codeCopied = ref(false)

// Generar URI para TOTP (formato otpauth)
const totpUri = computed(() => {
  if (!props.secretCode) return ''
  
  // Formato: otpauth://totp/Issuer:AccountName?secret=SECRET&issuer=Issuer
  const issuer = 'MiApp' // Nombre de tu aplicación
  const accountName = props.userEmail || 'usuario' // Email del usuario o nombre por defecto
  
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${props.secretCode}&issuer=${encodeURIComponent(issuer)}`
})

const isCodeValid = computed(() => {
  return /^\d{6}$/.test(verificationCode.value)
})

function handleClose() {
  if (!props.loading) {
    emit('update:modelValue', false)
    // Reset después de cerrar
    setTimeout(() => {
      step.value = props.isEnabled ? 'disable' : 'intro'
      verificationCode.value = ''
      codeCopied.value = false
    }, 300)
  }
}

function handleStart() {
  step.value = 'setup'
  emit('setup')
}

function handleDisable() {
  emit('disable')
}

function handleVerify() {
  if (isCodeValid.value && !props.loading) {
    emit('verify', verificationCode.value)
  }
}

function formatCodeInput(e: Event) {
  const input = e.target as HTMLInputElement
  verificationCode.value = input.value.replace(/\D/g, '').slice(0, 6)
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.secretCode)
    codeCopied.value = true
    setTimeout(() => {
      codeCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Error al copiar:', err)
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

// Reset step cuando cambia isEnabled
watch(() => props.isEnabled, (newValue) => {
  step.value = newValue ? 'disable' : 'intro'
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
  max-width: 600px;
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

.step-description {
  margin: 0 0 1.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

/* Info/Warning Boxes */
.info-box,
.warning-box {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.info-box {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.info-box svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.warning-box {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.warning-box svg {
  color: #f59e0b;
  flex-shrink: 0;
}

.info-box h3,
.warning-box h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.info-box p,
.warning-box p {
  margin: 0 0 0.75rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.info-box ul {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-text);
}

.info-box li {
  margin-bottom: 0.375rem;
}

/* QR Section */
.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.qr-code-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-code {
  display: block;
}

.qr-code-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background: var(--color-background-mute);
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  color: var(--vt-c-text-2);
}

.qr-hint {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
}

.divider {
  width: 100%;
  text-align: center;
  position: relative;
  color: var(--vt-c-text-2);
  font-weight: 600;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: var(--color-border);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.manual-code {
  width: 100%;
}

.manual-code p {
  margin: 0 0 1rem 0;
  color: var(--color-text);
}

.code-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  min-width: 0; /* Permite que el contenedor se reduzca */
}

.code-box code {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-heading);
  letter-spacing: 0.025em;
  word-break: break-all; /* Rompe palabras largas */
  overflow-wrap: break-word; /* Alternativa para compatibilidad */
  line-height: 1.8;
  min-width: 0; /* Permite que el código se reduzca */
  padding-right: 0.5rem;
  display: block;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
  align-self: flex-start;
}

.copy-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.copy-button.copied {
  background: #10b981;
}

/* Form */
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

.code-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-heading);
  font-size: 1.75rem;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5em;
  transition: all 0.2s ease;
}

.code-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.code-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-background-mute);
}

.field-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--vt-c-text-2);
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
.btn-secondary,
.btn-danger {
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

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

:global(.dark) .btn-danger {
  background: rgba(248, 113, 113, 0.15);
  color: #fca5a5;
  border-color: rgba(248, 113, 113, 0.3);
}

:global(.dark) .btn-danger:hover:not(:disabled) {
  background: rgba(248, 113, 113, 0.2);
  border-color: rgba(248, 113, 113, 0.4);
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
  
  .qr-code-container,
  .qr-code-placeholder {
    width: 160px;
    height: 160px;
  }
  
  .code-box {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .code-box code {
    font-size: 0.75rem;
    line-height: 1.6;
  }
  
  .copy-button {
    width: 100%;
    justify-content: center;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-danger {
    width: 100%;
  }
}
</style>
