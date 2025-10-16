<template>
  <BaseModal
    v-model="isOpen"
    title="Invitar Nuevo Usuario"
    size="lg"
    :closable="true"
    :close-on-overlay="false"
    hide-footer
  >
    <form @submit.prevent="handleSubmit" class="add-user-form">
      <!-- Info Banner -->
      <div class="info-banner">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
        </svg>
        <span class="info-text">Se enviará un correo con instrucciones para configurar la cuenta</span>
      </div>

      <!-- Formulario en 2 columnas -->
      <div class="form-grid">
        <!-- Columna Izquierda: Información Personal -->
        <div class="form-column">
          <h3 class="section-title">Información Personal</h3>
          
          <div class="form-group">
            <label for="firstName" class="form-label">
              Nombre <span class="required">*</span>
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              class="form-input"
              placeholder="Juan"
              required
              :disabled="loading"
            />
            <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">
              Apellidos <span class="required">*</span>
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              class="form-input"
              placeholder="García"
              required
              :disabled="loading"
            />
            <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">
              Email <span class="required">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              :class="{ 'input-error': errors.email, 'input-success': formData.email && !errors.email && isValidEmail(formData.email) }"
              placeholder="juan.garcia@empresa.com"
              required
              :disabled="loading"
              @blur="validateEmailField"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            <span v-else-if="formData.email && isValidEmail(formData.email)" class="success-message">
              ✓ Email válido
            </span>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">
              Teléfono
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="form-input"
              placeholder="+34 600 000 000"
              :disabled="loading"
            />
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
          </div>
        </div>

        <!-- Columna Derecha: Rol y Permisos -->
        <div class="form-column">
          <h3 class="section-title">Rol y Permisos</h3>
          
          <div class="form-group">
            <label for="role" class="form-label">
              Rol del Usuario <span class="required">*</span>
            </label>
            <select
              id="role"
              v-model="formData.role"
              class="form-select"
              required
              :disabled="loading"
            >
              <option value="user">Usuario - Acceso estándar</option>
              <option value="admin">Administrador - Gestión completa</option>
              <option value="owner">Propietario - Control total</option>
            </select>
            <span v-if="errors.role" class="error-message">{{ errors.role }}</span>
          </div>

          <!-- Role Description Card -->
          <div v-if="formData.role" class="role-card">
            <div class="role-header">
              <div class="role-icon" :class="`role-icon-${formData.role}`">
                <svg v-if="formData.role === 'admin'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <svg v-else-if="formData.role === 'owner'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m2 3 2.5 7L8 7l4 3 4-3 3.5 3L22 3l-1 13H3L2 3z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span class="role-badge" :class="`role-badge-${formData.role}`">{{ getRoleTitle(formData.role) }}</span>
            </div>
            <p class="role-desc">{{ getRoleDescription(formData.role) }}</p>
            
            <!-- Permisos visuales -->
            <div class="permissions-list">
              <div class="permission-item" v-for="permission in getRolePermissions(formData.role)" :key="permission">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ permission }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="handleCancel"
          :disabled="loading"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading || !isFormValid"
        >
          <svg v-if="loading" class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
          {{ loading ? 'Enviando invitación...' : 'Enviar Invitación' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import { useUsersStore } from '@/stores/users'
import { useConfirm } from '@/composables/useConfirm'

interface Props {
  modelValue: boolean
}

interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'user' | 'admin' | 'owner' | ''
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'userCreated': [user: any]
}>()

const usersStore = useUsersStore()
const { confirm } = useConfirm()

const isOpen = ref(props.modelValue)
const loading = ref(false)

const formData = ref<CreateUserData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'user',
})

const errors = ref<Partial<Record<keyof CreateUserData, string>>>({})

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
  if (newValue) {
    resetForm()
  }
})

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

const isFormValid = computed(() => {
  return (
    formData.value.firstName.trim() !== '' &&
    formData.value.lastName.trim() !== '' &&
    formData.value.email.trim() !== '' &&
    isValidEmail(formData.value.email) &&
    formData.value.role !== ''
  )
})

function isValidEmail(email: string): boolean {
  // Limpiar espacios y convertir a minúsculas
  const cleanEmail = email.trim().toLowerCase()
  
  // Regex más estricta para validar emails
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
  
  return cleanEmail.length > 0 && emailRegex.test(cleanEmail)
}

function validateForm(): boolean {
  errors.value = {}
  let isValid = true

  // Validar nombre
  if (!formData.value.firstName.trim()) {
    errors.value.firstName = 'El nombre es obligatorio'
    isValid = false
  } else if (formData.value.firstName.trim().length < 2) {
    errors.value.firstName = 'El nombre debe tener al menos 2 caracteres'
    isValid = false
  }

  // Validar apellidos
  if (!formData.value.lastName.trim()) {
    errors.value.lastName = 'Los apellidos son obligatorios'
    isValid = false
  } else if (formData.value.lastName.trim().length < 2) {
    errors.value.lastName = 'Los apellidos deben tener al menos 2 caracteres'
    isValid = false
  }

  // Validar email
  const cleanEmail = formData.value.email.trim().toLowerCase()
  if (!formData.value.email.trim()) {
    errors.value.email = 'El email es obligatorio'
    isValid = false
  } else if (!isValidEmail(cleanEmail)) {
    errors.value.email = 'Introduce un email válido (ej: usuario@empresa.com)'
    isValid = false
  } else if (cleanEmail.length > 255) {
    errors.value.email = 'El email es demasiado largo'
    isValid = false
  }

  // Validar teléfono si se proporciona
  if (formData.value.phone.trim()) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/
    if (!phoneRegex.test(formData.value.phone.trim())) {
      errors.value.phone = 'Formato de teléfono inválido'
      isValid = false
    }
  }

  // Validar rol
  if (!formData.value.role) {
    errors.value.role = 'Debes seleccionar un rol'
    isValid = false
  }

  return isValid
}

function validateEmailField() {
  if (formData.value.email.trim()) {
    const cleanEmail = formData.value.email.trim().toLowerCase()
    if (!isValidEmail(cleanEmail)) {
      errors.value.email = 'Introduce un email válido (ej: usuario@empresa.com)'
    } else {
      delete errors.value.email
    }
  }
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Invitar usuario (envía email automáticamente)
    const newUser = await usersStore.inviteUser({
      firstName: formData.value.firstName.trim(),
      lastName: formData.value.lastName.trim(),
      email: formData.value.email.trim().toLowerCase(),
      phone: formData.value.phone.trim() || undefined,
      role: formData.value.role as 'user' | 'admin' | 'owner',
    })

    // Cerrar modal
    isOpen.value = false

    // Mostrar mensaje de éxito
    await confirm({
      title: '¡Invitación Enviada!',
      message: `Se ha enviado una invitación a ${formData.value.email}`,
      details: `${formData.value.firstName} ${formData.value.lastName} recibirá un email con un enlace para configurar su contraseña y acceder a la plataforma.`,
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })

    // Emitir evento de usuario creado
    emit('userCreated', newUser)

    // Resetear formulario
    resetForm()
  } catch (error: any) {
    console.error('Error inviting user:', error)
    
    // Determinar el mensaje de error
    let errorMessage = 'No se pudo enviar la invitación'
    let errorDetails = 'Por favor, inténtalo de nuevo más tarde.'

    if (error.message?.includes('already exists') || error.message?.includes('duplicate') || error.message?.includes('ya existe')) {
      errorMessage = 'Usuario ya registrado'
      errorDetails = `Ya existe un usuario con el email ${formData.value.email}`
    } else if (error.message) {
      errorDetails = error.message
    }

    await confirm({
      title: 'Error',
      message: errorMessage,
      details: errorDetails,
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
  }
  errors.value = {}
}

function getRoleTitle(role: string): string {
  const titles: Record<string, string> = {
    admin: 'Administrador',
    user: 'Usuario Estándar',
    owner: 'Propietario',
  }
  return titles[role] || role
}

function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    admin: 'Gestión completa de usuarios y configuración del sistema.',
    user: 'Acceso estándar a las aplicaciones asignadas.',
    owner: 'Control total de la organización y todos sus recursos.',
  }
  return descriptions[role] || ''
}

function getRolePermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    admin: [
      'Gestionar usuarios y roles',
      'Acceso a todas las aplicaciones',
      'Configurar ajustes del sistema',
      'Ver reportes y estadísticas'
    ],
    user: [
      'Acceso a aplicaciones asignadas',
      'Ver información del perfil',
      'Actualizar datos personales'
    ],
    owner: [
      'Control total de la organización',
      'Gestionar administradores',
      'Acceso a facturación',
      'Configuración avanzada del sistema',
      'Eliminar o transferir cuenta'
    ],
  }
  return permissions[role] || []
}
</script>

<style scoped>
.add-user-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Info Banner - Más compacto */
.info-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(147, 51, 234, 0.06) 100%);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 10px;
}

.info-banner svg {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.info-text {
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--color-text);
  font-weight: 500;
}

/* Grid de 2 columnas */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0; /* Permite que las columnas se reduzcan */
}

.section-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.02em;
}

/* Form Groups - Más compactos */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-heading);
  letter-spacing: -0.01em;
}

.required {
  color: #ef4444;
  margin-left: 0.125rem;
}

/* Form Inputs - Más elegantes */
.form-input,
.form-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-background-soft);
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
  background: var(--color-background);
}

.form-input.input-error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.04);
}

.form-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.form-input.input-success {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.04);
}

.form-input.input-success:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.08);
}

.form-input:disabled,
.form-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-select {
  cursor: pointer;
}

/* Error/Success Messages */
.error-message {
  font-size: 0.75rem;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.success-message {
  font-size: 0.75rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
}

/* Role Card - Diseño mejorado */
.role-card {
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-background-soft) 0%, var(--color-background-mute) 100%);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.role-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.role-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.role-icon-admin {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.role-icon-owner {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.role-icon-user {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.role-icon svg {
  color: white;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.role-badge-admin {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.role-badge-owner {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.role-badge-user {
  background: rgba(139, 92, 246, 0.15);
  color: #7c3aed;
}

:global(.dark) .role-badge-admin {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

:global(.dark) .role-badge-owner {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

:global(.dark) .role-badge-user {
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
}

.role-desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text);
}

/* Permissions List */
.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-text);
  line-height: 1.4;
}

.permission-item svg {
  width: 16px;
  height: 16px;
  color: #10b981;
  flex-shrink: 0;
}

:global(.dark) .permission-item svg {
  color: #34d399;
}

/* Checkbox Group */
.checkbox-group {
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.875rem;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.checkbox-label:hover {
  background: var(--color-background-mute);
}

.form-checkbox {
  width: 20px;
  height: 20px;
  margin-top: 0.125rem;
  cursor: pointer;
  accent-color: var(--color-primary);
  flex-shrink: 0;
}

.checkbox-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.checkbox-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-heading);
}

.checkbox-desc {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
  margin-top: 0.25rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-primary svg {
  color: white;
}

.btn-secondary {
  background: var(--color-background-mute);
  color: var(--color-heading);
  border: 1.5px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-background);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Spinner Animation */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .role-card {
    padding: 0.875rem;
  }
  
  .permissions-list {
    gap: 0.375rem;
  }
  
  .permission-item {
    font-size: 0.75rem;
  }
}

@media (max-width: 640px) {
  .info-banner {
    padding: 0.75rem;
  }
  
  .info-text {
    font-size: 0.8125rem;
  }
  
  .section-title {
    font-size: 0.9375rem;
  }
  
  .form-input,
  .form-select {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
