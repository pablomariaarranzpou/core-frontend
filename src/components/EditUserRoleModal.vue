<template>
  <BaseModal
    v-model="isOpen"
    title="Editar Rol de Usuario"
    size="sm"
    @close="handleClose"
  >
    <div class="edit-role-content">
      <!-- User Info -->
      <div class="user-info-section">
        <div class="user-avatar">
          {{ getUserInitial() }}
        </div>
        <div class="user-details">
          <h3 class="user-name">{{ getUserDisplayName() }}</h3>
          <p class="user-email">{{ user?.email }}</p>
        </div>
      </div>

      <!-- Role Selection -->
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="role-select" class="form-label">
            Seleccionar Rol
            <span class="required">*</span>
          </label>
          <select 
            id="role-select"
            v-model="selectedRole" 
            class="form-select"
            required
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="owner">Propietario</option>
          </select>
        </div>

        <!-- Role Description -->
        <div v-if="selectedRole" class="role-description">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p>{{ getRoleDescription(selectedRole) }}</p>
        </div>
      </form>
    </div>

    <template #footer>
      <button 
        type="button" 
        class="btn-secondary" 
        @click="handleClose"
        :disabled="loading"
      >
        Cancelar
      </button>
      <button 
        type="button" 
        class="btn-primary" 
        @click="handleSubmit"
        :disabled="loading || !selectedRole || selectedRole === user?.role"
      >
        <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </template>
  </BaseModal>
  
  <!-- Confirmation Dialog -->
  <ConfirmationDialog
    v-model="showConfirmDialog"
    :title="confirmDialogConfig.title"
    :message="confirmDialogConfig.message"
    :details="confirmDialogConfig.details"
    :type="confirmDialogConfig.type"
    :confirm-text="confirmDialogConfig.confirmText"
    :cancel-text="confirmDialogConfig.cancelText"
    :show-cancel="confirmDialogConfig.showCancel"
    @confirm="handleConfirmAction"
    @cancel="handleCancelConfirm"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import type { User } from '@/stores/users'
import { useUsersStore } from '@/stores/users'

interface Props {
  modelValue: boolean
  user: User | null
}

interface ConfirmDialogConfig {
  title: string
  message: string
  details?: string
  type: 'success' | 'warning' | 'error' | 'info' | 'question'
  confirmText: string
  cancelText: string
  showCancel: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'role-updated': [user: User]
}>()

const usersStore = useUsersStore()

const isOpen = ref(props.modelValue)
const selectedRole = ref<string>('')
const loading = ref(false)
const showConfirmDialog = ref(false)
const confirmDialogConfig = ref<ConfirmDialogConfig>({
  title: '',
  message: '',
  details: '',
  type: 'question',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  showCancel: true
})
const pendingAction = ref<(() => Promise<void>) | null>(null)

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
  if (newValue && props.user) {
    selectedRole.value = props.user.role
  }
})

// Watch for isOpen changes
watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

function getUserDisplayName(): string {
  if (!props.user) return 'Usuario desconocido'
  
  const fullName = [props.user.firstName, props.user.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
  
  return fullName || props.user.email || 'Usuario'
}

function getUserInitial(): string {
  if (!props.user) return '?'
  
  return props.user.firstName?.charAt(0)?.toUpperCase() 
    || props.user.email?.charAt(0)?.toUpperCase() 
    || '?'
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  user: 'Usuario',
  owner: 'Propietario'
}

function getRoleLabel(role?: string): string {
  if (!role) return ''
  return ROLE_LABELS[role] || role
}

function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    user: 'Puede gestionar sus propios recursos y acceder a funcionalidades básicas.',
    admin: 'Puede gestionar usuarios y configuraciones de la organización.',
    owner: 'Tiene control total sobre la organización y todos sus recursos.'
  }
  return descriptions[role] || ''
}

async function handleSubmit() {
  if (!props.user || !selectedRole.value || selectedRole.value === props.user.role) return
  
  // Configurar el diálogo de confirmación
  confirmDialogConfig.value = {
    title: 'Confirmar Cambio de Rol',
    message: `¿Estás seguro de cambiar el rol de ${getUserDisplayName()}?`,
    details: `El rol cambiará de "${getRoleLabel(props.user.role)}" a "${getRoleLabel(selectedRole.value)}".`,
    type: 'warning',
    confirmText: 'Sí, cambiar rol',
    cancelText: 'Cancelar',
    showCancel: true
  }
  
  // Guardar la acción pendiente
  pendingAction.value = async () => {
    loading.value = true
    
    try {
      await usersStore.changeUserRole(props.user!.id, selectedRole.value as 'admin' | 'user' | 'owner')
      
      // Mostrar diálogo de éxito
      confirmDialogConfig.value = {
        title: 'Rol Actualizado',
        message: `El rol de ${getUserDisplayName()} ha sido actualizado correctamente.`,
        type: 'success',
        confirmText: 'Entendido',
        cancelText: '',
        showCancel: false
      }
      
      showConfirmDialog.value = true
      
      emit('role-updated', { ...props.user!, role: selectedRole.value as 'admin' | 'user' | 'owner' })
    } catch (err: any) {
      console.error('Error updating user role:', err)
      
      // Mostrar diálogo de error
      confirmDialogConfig.value = {
        title: 'Error',
        message: 'No se pudo actualizar el rol del usuario',
        details: err?.message || 'Por favor, inténtalo nuevamente.',
        type: 'error',
        confirmText: 'Cerrar',
        cancelText: '',
        showCancel: false
      }
      
      showConfirmDialog.value = true
    } finally {
      loading.value = false
    }
  }
  
  // Mostrar el diálogo de confirmación
  showConfirmDialog.value = true
}

async function handleConfirmAction() {
  if (pendingAction.value) {
    await pendingAction.value()
    pendingAction.value = null
    
    // Si fue exitoso, cerrar el modal principal
    if (confirmDialogConfig.value.type === 'success') {
      handleClose()
    }
  }
}

function handleCancelConfirm() {
  pendingAction.value = null
}

function handleClose() {
  if (!loading.value) {
    selectedRole.value = ''
    isOpen.value = false
  }
}
</script>

<style scoped>
.edit-role-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-info-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

:global(.dark) .user-info-section {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.2;
}

.user-email {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: all var(--transition-base);
  cursor: pointer;
}

:global(.dark) .form-select {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:global(.dark) .form-select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-select option {
  background: var(--color-background);
  color: var(--color-text);
}

:global(.dark) .form-select option {
  background: var(--color-background-mute);
}

.role-description {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--color-text);
  line-height: 1.5;
}

:global(.dark) .role-description {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
}

.role-description svg {
  flex-shrink: 0;
  color: var(--color-primary);
  margin-top: 0.125rem;
}

.role-description p {
  margin: 0;
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  line-height: 1;
}

.btn-secondary {
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

:global(.dark) .btn-secondary {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.btn-primary {
  background: var(--color-primary);
  color: white !important;
}

.btn-primary svg {
  color: white !important;
  stroke: white !important;
}

:global(.dark) .btn-primary,
:global(html.dark) .btn-primary {
  color: white !important;
}

:global(.dark) .btn-primary svg,
:global(html.dark) .btn-primary svg {
  color: white !important;
  stroke: white !important;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  background: #1d4ed8;
  transform: scale(0.98);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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
</style>
