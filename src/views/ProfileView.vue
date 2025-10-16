<template>
  <div class="profile-view">
    <div class="container py-lg">
      <h1 class="page-title">Mi Perfil</h1>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando información del perfil...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadUserProfile" class="btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="authStore.user">
        <!-- Información Personal -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Información Personal</h2>
            <span class="status-badge status-active">Activo</span>
          </div>

          <div class="profile-avatar-section">
            <div class="avatar-large" :class="{ 'has-image': authStore.user.avatar }">
              <img v-if="authStore.user.avatar" :src="authStore.user.avatar" alt="Avatar" />
              <span v-else>{{ avatarInitial }}</span>
            </div>
            <div class="avatar-info">
              <p class="avatar-label">Foto de perfil</p>
              <p class="avatar-hint">JPG, PNG, WEBP o GIF - Máximo 5MB</p>
              <div class="avatar-actions">
                <label class="btn-upload" :class="{ 'uploading': usersStore.loading }">
                  <svg v-if="!usersStore.loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span class="spinner" v-else></span>
                  {{ usersStore.loading ? 'Subiendo...' : 'Cambiar foto' }}
                  <input 
                    type="file" 
                    ref="avatarInput"
                    accept="image/jpeg,image/png,image/webp,image/gif" 
                    @change="handleAvatarChange"
                    :disabled="usersStore.loading"
                    style="display: none;"
                  />
                </label>
                <button 
                  v-if="authStore.user.avatar" 
                  @click="handleRemoveAvatar"
                  class="btn-remove-avatar"
                  :disabled="usersStore.loading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                v-model="formData.firstName" 
                placeholder="Tu nombre"
              />
            </div>

            <div class="form-group">
              <label>Apellidos</label>
              <input 
                type="text" 
                v-model="formData.lastName" 
                placeholder="Tus apellidos"
              />
            </div>

            <div class="form-group full-width">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                :value="authStore.user.email" 
                disabled
                class="input-disabled"
              />
              <span class="field-hint">El correo no se puede cambiar</span>
            </div>

            <div class="form-group full-width">
              <label>Teléfono</label>
              <input 
                type="tel" 
                v-model="formData.phone" 
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <div class="form-actions">
            <button 
              @click="handleUpdateProfile" 
              class="btn-primary"
              :disabled="saving"
            >
              <svg v-if="!saving" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span class="spinner" v-else></span>
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>

        <!-- Información de la Organización (Solo Lectura) -->
        <div class="profile-section info-section">
          <h2>Mi Organización</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Organización</label>
              <span>{{ authStore.user.account?.name || 'Sin organización' }}</span>
            </div>
            <div class="info-item">
              <label>Rol</label>
              <span class="role-badge" :class="`role-${authStore.user.role}`">
                {{ getRoleLabel(authStore.user.role || 'user') }}
              </span>
            </div>
            <div class="info-item">
              <label>ID de Usuario</label>
              <span class="monospace">{{ authStore.user.id }}</span>
            </div>
          </div>
        </div>

        <!-- Seguridad -->
        <div class="profile-section">
          <h2>Seguridad</h2>
          <div class="security-actions">
            <button @click="handleChangePassword" class="security-button">
              <div class="security-button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div class="security-button-content">
                <div class="security-button-title">Cambiar Contraseña</div>
                <div class="security-button-description">Actualiza tu contraseña de acceso</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-right">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            <button @click="handleManage2FA" class="security-button">
              <div class="security-button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div class="security-button-content">
                <div class="security-button-title">Autenticación de Dos Factores</div>
                <div class="security-button-description">Protege tu cuenta con 2FA</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-right">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Zona de Peligro -->
        <div class="profile-section danger-section">
          <h2>Zona de Peligro</h2>
          <p class="danger-description">Las acciones en esta sección son permanentes y no se pueden deshacer.</p>
          <div class="danger-actions">
            <button @click="handleDeleteAccount" class="btn-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Eliminar mi cuenta
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <ChangePasswordModal 
      v-model="showChangePasswordModal"
      :loading="passwordLoading"
      :error="passwordError"
      @confirm="handlePasswordChange"
    />

    <Setup2FAModal 
      v-model="show2FAModal"
      :is-enabled="mfaEnabled"
      :secret-code="totpSecret"
      :user-email="authStore.user?.email || ''"
      :loading="mfaLoading"
      :error="mfaError"
      @disable="handleDisable2FA"
      @setup="handleSetup2FA"
      @verify="handleVerify2FA"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useConfirm } from '@/composables/useConfirm'
import httpService from '@/services/http'
import { 
  updatePassword, 
  setUpTOTP, 
  verifyTOTPSetup, 
  updateMFAPreference,
  fetchMFAPreference 
} from '@/amplify-config'
import ChangePasswordModal from '@/components/ChangePasswordModal.vue'
import Setup2FAModal from '@/components/Setup2FAModal.vue'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const { confirm } = useConfirm()

const loading = ref(false)
const saving = ref(false)
const error = ref('')

// Estados de Avatar (ahora manejado por el store)
const avatarInput = ref<HTMLInputElement | null>(null)

// Estados de los modales
const showChangePasswordModal = ref(false)
const show2FAModal = ref(false)

// Estados de cambio de contraseña
const passwordLoading = ref(false)
const passwordError = ref('')

// Estados de 2FA
const mfaLoading = ref(false)
const mfaError = ref('')
const mfaEnabled = ref(false)
const totpSecret = ref('')

// Datos del formulario
const formData = ref({
  firstName: '',
  lastName: '',
  phone: ''
})

const avatarInitial = computed(() => {
  const user = authStore.user
  if (!user) return 'U'
  
  // Si tiene avatar, no mostramos inicial
  if ((user as any).avatar) return ''
  
  const name = user.firstName || user.email
  return (name?.[0] || 'U').toUpperCase()
})

// Cargar datos del perfil
async function loadUserProfile() {
  loading.value = true
  error.value = ''
  
  try {
    // Los datos del usuario ya están en authStore
    if (authStore.user) {
      formData.value = {
        firstName: authStore.user.firstName || '',
        lastName: authStore.user.lastName || '',
        phone: '' // Agregar cuando esté disponible en el backend
      }
    }
  } catch (err: any) {
    console.error('Error al cargar perfil:', err)
    error.value = err.message || 'Error al cargar el perfil'
  } finally {
    loading.value = false
  }
}

// Actualizar perfil
async function handleUpdateProfile() {
  saving.value = true
  
  try {
    // Llamada al endpoint del backend para actualizar perfil
    await httpService.patch('/users/profile', {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      phone: formData.value.phone
    })
    
    // Recargar datos del usuario
    await authStore.fetchUserFromBackend()
    
    await confirm({
      title: '¡Perfil Actualizado!',
      message: 'Tus datos se han actualizado correctamente.',
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
  } catch (err: any) {
    console.error('Error al actualizar perfil:', err)
    await confirm({
      title: 'Error',
      message: 'No se pudo actualizar tu perfil',
      details: err.message || 'Por favor, inténtalo de nuevo más tarde.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
  } finally {
    saving.value = false
  }
}

// Gestión de Avatar
async function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  try {
    // Usar la función del store que ya tiene todas las validaciones
    await usersStore.uploadAvatar(file)
    
    // Recargar datos del usuario
    await authStore.fetchUserFromBackend()
    
    await confirm({
      title: '¡Avatar Actualizado!',
      message: 'Tu foto de perfil se ha actualizado correctamente.',
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
  } catch (err: any) {
    console.error('Error al subir avatar:', err)
    await confirm({
      title: 'Error',
      message: err.message || 'No se pudo subir tu foto de perfil',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
  } finally {
    // Limpiar input
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  }
}

async function handleRemoveAvatar() {
  const confirmed = await confirm({
    title: 'Eliminar foto de perfil',
    message: '¿Estás seguro de que deseas eliminar tu foto de perfil?',
    details: 'Volverás a tener un avatar con tu inicial.',
    type: 'warning',
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar',
  })
  
  if (!confirmed) return
  
  try {
    // Usar la función del store
    await usersStore.removeAvatar()
    
    // Recargar datos del usuario
    await authStore.fetchUserFromBackend()
    
    await confirm({
      title: 'Foto eliminada',
      message: 'Tu foto de perfil ha sido eliminada correctamente.',
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
  } catch (err: any) {
    console.error('Error al eliminar avatar:', err)
    await confirm({
      title: 'Error',
      message: err.message || 'No se pudo eliminar tu foto de perfil',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
  }
}

// Cambiar contraseña
async function handleChangePassword() {
  showChangePasswordModal.value = true
  passwordError.value = ''
}

async function handlePasswordChange(data: { oldPassword: string; newPassword: string }) {
  passwordLoading.value = true
  passwordError.value = ''
  
  try {
    await updatePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword })
    
    // Cerrar modal
    showChangePasswordModal.value = false
    
    // Mostrar confirmación
    await confirm({
      title: '¡Contraseña Actualizada!',
      message: 'Tu contraseña se ha cambiado correctamente.',
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
  } catch (err: any) {
    console.error('Error al cambiar contraseña:', err)
    
    if (err.name === 'NotAuthorizedException' || err.message?.includes('Incorrect')) {
      passwordError.value = 'La contraseña actual no es correcta.'
    } else if (err.name === 'InvalidPasswordException') {
      passwordError.value = 'La nueva contraseña debe cumplir con los requisitos de seguridad.'
    } else if (err.name === 'LimitExceededException') {
      passwordError.value = 'Has excedido el límite de intentos. Espera unos minutos.'
    } else {
      passwordError.value = err.message || 'No se pudo cambiar tu contraseña.'
    }
  } finally {
    passwordLoading.value = false
  }
}

// Gestionar 2FA
async function handleManage2FA() {
  mfaLoading.value = true
  mfaError.value = ''
  
  try {
    // Verificar el estado actual de MFA
    const mfaPreference = await fetchMFAPreference()
    mfaEnabled.value = !!(mfaPreference?.preferred === 'TOTP' || mfaPreference?.enabled?.includes('TOTP'))
    
    // Abrir modal
    show2FAModal.value = true
  } catch (err: any) {
    console.error('Error al verificar estado de MFA:', err)
    await confirm({
      title: 'Error',
      message: 'No se pudo verificar el estado de 2FA',
      details: err.message || 'Por favor, inténtalo de nuevo más tarde.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
  } finally {
    mfaLoading.value = false
  }
}

async function handleSetup2FA() {
  mfaLoading.value = true
  mfaError.value = ''
  
  try {
    // Iniciar configuración de TOTP
    const totpSetupDetails = await setUpTOTP()
    totpSecret.value = totpSetupDetails.sharedSecret
  } catch (err: any) {
    console.error('Error al iniciar configuración de TOTP:', err)
    mfaError.value = err.message || 'No se pudo iniciar la configuración de 2FA.'
  } finally {
    mfaLoading.value = false
  }
}

async function handleVerify2FA(code: string) {
  mfaLoading.value = true
  mfaError.value = ''
  
  try {
    // Verificar el código TOTP
    await verifyTOTPSetup({ code })
    
    // Establecer TOTP como preferencia de MFA
    await updateMFAPreference({ totp: 'PREFERRED' })
    
    // Cerrar modal
    show2FAModal.value = false
    
    // Mostrar confirmación
    await confirm({
      title: '¡2FA Activado!',
      message: 'La autenticación de dos factores ha sido activada correctamente.',
      details: 'A partir de ahora necesitarás tu app de autenticación para iniciar sesión.',
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
  } catch (err: any) {
    console.error('Error al verificar código TOTP:', err)
    mfaError.value = 'El código de verificación no es válido. Por favor, inténtalo de nuevo.'
  } finally {
    mfaLoading.value = false
  }
}

async function handleDisable2FA() {
  mfaLoading.value = true
  mfaError.value = ''
  
  try {
    await updateMFAPreference({ totp: 'DISABLED' })
    
    // Cerrar modal
    show2FAModal.value = false
    
    // Mostrar confirmación
    await confirm({
      title: '2FA Desactivado',
      message: 'La autenticación de dos factores ha sido desactivada.',
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
  } catch (err: any) {
    console.error('Error al desactivar 2FA:', err)
    mfaError.value = err.message || 'No se pudo desactivar la autenticación de dos factores.'
  } finally {
    mfaLoading.value = false
  }
}

// Eliminar cuenta
async function handleDeleteAccount() {
  const confirmed = await confirm({
    title: '⚠️ Eliminar Cuenta',
    message: '¿Estás completamente seguro de que deseas eliminar tu cuenta?',
    details: 'Esta acción es PERMANENTE y no se puede deshacer. Perderás acceso a todas tus aplicaciones y datos.',
    type: 'warning',
    confirmText: 'Sí, eliminar mi cuenta',
    cancelText: 'Cancelar',
  })
  
  if (confirmed) {
    await confirm({
      title: 'Función no disponible',
      message: 'La eliminación de cuentas debe ser gestionada por un administrador.',
      details: 'Por favor, contacta con el soporte para más información.',
      type: 'info',
      confirmText: 'Entendido',
      showCancel: false,
    })
  }
}

// Utilidades
function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    owner: 'Propietario',
    admin: 'Administrador',
    user: 'Usuario'
  }
  return labels[role] || role
}

// Cargar datos al montar
onMounted(() => {
  loadUserProfile()
  
  // Debug: verificar avatar del usuario
  console.log('🖼️ ProfileView - Usuario completo:', authStore.user)
  console.log('🖼️ ProfileView - Avatar URL:', authStore.user?.avatar)
  console.log('🖼️ ProfileView - Has avatar:', !!authStore.user?.avatar)
})
</script>

<style scoped>
.profile-view {
  width: 100%;
  min-height: 100%;
  background: var(--color-background);
}

.page-title {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
}

/* Estados de carga y error */
.loading-state,
.error-state {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 800px;
}

:global(.dark) .loading-state,
:global(.dark) .error-state {
  background: var(--color-background-soft);
  border-color: rgba(255, 255, 255, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state p {
  color: #ef4444;
  margin-bottom: 1rem;
}

:global(.dark) .error-state p {
  color: #f87171;
}

/* Secciones */
.profile-section {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  max-width: 800px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

:global(.dark) .profile-section {
  background: var(--color-background-soft);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.profile-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin-bottom: 0;
}

/* Avatar Section */
.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--color-background-mute);
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid transparent;
}

:global(.dark) .profile-avatar-section {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  overflow: hidden;
  position: relative;
}

.avatar-large.has-image {
  background: var(--color-background-mute);
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.avatar-info {
  flex: 1;
}

.avatar-label {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: var(--color-heading);
}

.avatar-hint {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.avatar-actions {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

.btn-upload:hover:not(.uploading) {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.btn-upload.uploading {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-remove-avatar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove-avatar:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);
}

.btn-remove-avatar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:global(.dark) .btn-remove-avatar {
  background: rgba(220, 38, 38, 0.2);
  color: #ff6b6b;
  border-color: rgba(220, 38, 38, 0.4);
}

:global(.dark) .btn-remove-avatar svg {
  color: #ff6b6b;
  stroke: #ff6b6b;
}

:global(.dark) .btn-remove-avatar:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.3);
  border-color: rgba(220, 38, 38, 0.6);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.5);
  color: #ff8787;
}

:global(.dark) .btn-remove-avatar:hover:not(:disabled) svg {
  color: #ff8787;
  stroke: #ff8787;
}

/* Badge de estado */
.status-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-active {
  background: rgba(16, 185, 129, 0.12);
  color: rgb(16, 185, 129);
}

:global(.dark) .status-active {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

/* Formularios */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-heading);
}

.form-group input {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:global(.dark) .form-group input {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
}

:global(.dark) .form-group input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-background-mute) !important;
}

:global(.dark) .input-disabled {
  background: rgba(255, 255, 255, 0.05) !important;
  color: var(--color-text-muted);
}

.field-hint {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

/* Botones */
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

:global(.dark) .btn-primary {
  background: var(--color-primary);
  color: white !important;
}

:global(.dark) .btn-primary:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
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

.btn-secondary:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

:global(.dark) .btn-secondary {
  background: var(--color-background-mute);
  color: var(--color-text);
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark) .btn-secondary:hover {
  background: var(--color-background-soft);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-danger svg {
  color: currentColor;
  stroke: currentColor;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}

:global(.dark) .btn-danger,
:global(html.dark) .btn-danger,
:global(:root.dark) .btn-danger {
  background: rgba(220, 38, 38, 0.25);
  color: #ff8787 !important;
  border-color: rgba(220, 38, 38, 0.5);
}

:global(.dark) .btn-danger svg,
:global(html.dark) .btn-danger svg,
:global(:root.dark) .btn-danger svg {
  color: #ff8787 !important;
  stroke: #ff8787 !important;
}

:global(.dark) .btn-danger:hover,
:global(html.dark) .btn-danger:hover,
:global(:root.dark) .btn-danger:hover {
  background: rgba(220, 38, 38, 0.35);
  border-color: rgba(220, 38, 38, 0.7);
  box-shadow: 0 2px 10px rgba(220, 38, 38, 0.5);
  color: #ffa3a3 !important;
}

:global(.dark) .btn-danger:hover svg,
:global(html.dark) .btn-danger:hover svg,
:global(:root.dark) .btn-danger:hover svg {
  color: #ffa3a3 !important;
  stroke: #ffa3a3 !important;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Sección de información */
.info-section {
  background: var(--color-background-mute);
  border-color: var(--color-border);
}

:global(.dark) .info-section {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item span {
  color: var(--color-heading);
  font-size: 1rem;
  font-weight: 500;
}

.monospace {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem !important;
}

.role-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  border: 1px solid transparent;
}

.role-owner {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.1));
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

:global(.dark) .role-owner {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.15));
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.5);
}

.role-admin {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1));
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.3);
}

:global(.dark) .role-admin {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(59, 130, 246, 0.15));
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.5);
}

.role-user {
  background: linear-gradient(135deg, rgba(107, 114, 128, 0.15), rgba(107, 114, 128, 0.1));
  color: #6b7280;
  border-color: rgba(107, 114, 128, 0.3);
}

:global(.dark) .role-user {
  background: linear-gradient(135deg, rgba(156, 163, 175, 0.25), rgba(156, 163, 175, 0.15));
  color: #d1d5db;
  border-color: rgba(156, 163, 175, 0.4);
}

/* Botones de seguridad */
.security-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

:global(.dark) .security-button {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
}

.security-button:hover {
  border-color: var(--color-border-hover);
  background: var(--color-background-mute);
  transform: translateX(4px);
}

:global(.dark) .security-button:hover {
  background: var(--color-background-soft);
  border-color: rgba(255, 255, 255, 0.2);
}

.security-button-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

.security-button-content {
  flex: 1;
}

.security-button-title {
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.security-button-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.chevron-right {
  color: var(--color-text-muted);
  opacity: 0.5;
  transition: all 0.2s ease;
}

.security-button:hover .chevron-right {
  opacity: 1;
  transform: translateX(4px);
}

/* Zona de peligro */
.danger-section {
  border-color: rgba(239, 68, 68, 0.2);
}

:global(.dark) .danger-section {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.08);
}

:global(.dark) .danger-section h2 {
  color: #ff8787;
}

.danger-description {
  margin: 0 0 1.5rem 0;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}

:global(.dark) .danger-description {
  color: #fca5a5;
}

.danger-actions {
  display: flex;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>
