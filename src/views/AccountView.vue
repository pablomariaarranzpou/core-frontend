<template>
  <div class="account-view">
    <div class="container py-lg">
      
      <!-- Forbidden Access Message -->
      <div v-if="isForbidden" class="forbidden-message">
        <div class="forbidden-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <h2 class="forbidden-title">Acceso Denegado</h2>
        <p class="forbidden-description">
          No tienes permisos para acceder a esta página.
        </p>
        <p class="forbidden-details">
          La gestión de cuentas está restringida a administradores y propietarios de la organización.
        </p>
      </div>

      <!-- Normal Content (only if not forbidden) -->
      <template v-else>
        <h1 class="page-title">Mi Organización</h1>

        <div v-if="loading" class="loading-state">
          <p>Cargando información de la organización...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="loadAccount" class="btn-secondary">Reintentar</button>
        </div>

        <div v-else-if="currentAccount">
        <!-- Información básica de la cuenta -->
        <div class="account-section">
          <div class="section-header">
            <h2>Información de la Cuenta</h2>
            <span class="status-badge" :class="currentAccount.isActive ? 'status-active' : 'status-inactive'">
              {{ currentAccount.isActive ? 'Activa' : 'Inactiva' }}
            </span>
          </div>

          <div class="form-group">
            <label>Nombre de la Organización</label>
            <input 
              type="text" 
              v-model="formData.name" 
              placeholder="Nombre de la organización"
            />
          </div>

          <div class="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              v-model="formData.phone" 
              placeholder="+34 600 000 000"
            />
          </div>

          <div class="form-actions">
            <button 
              @click="handleUpdateAccount" 
              class="btn-primary"
              :disabled="saving"
            >
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>

        <!-- Información adicional (solo lectura) -->
        <div class="account-section info-section">
          <h2>Información del Sistema</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>ID de Cuenta</label>
              <span>{{ currentAccount.id }}</span>
            </div>
            <div class="info-item">
              <label>Fecha de Creación</label>
              <span>{{ formatDate(currentAccount.createdAt) }}</span>
            </div>
            <div class="info-item">
              <label>Última Actualización</label>
              <span>{{ formatDate(currentAccount.updatedAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Lista de usuarios (solo lectura) -->
        <div class="account-section" v-if="currentAccount.users && currentAccount.users.length > 0">
          <h2>Usuarios de la Cuenta</h2>
          <div class="users-list">
            <div 
              v-for="user in currentAccount.users" 
              :key="user.id"
              class="user-card"
            >
              <div class="user-info">
                <div class="user-name">
                  {{ user.firstName }} {{ user.lastName }}
                </div>
                <div class="user-email">{{ user.email }}</div>
              </div>
              <div class="user-meta">
                <span class="user-role" :class="`role-${user.role}`">
                  {{ getRoleLabel(user.role) }}
                </span>
                <span 
                  class="user-status" 
                  :class="user.isActive ? 'status-active' : 'status-inactive'"
                >
                  {{ user.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Suscripciones (solo lectura) -->
        <div class="account-section" v-if="currentAccount.subscriptions && currentAccount.subscriptions.length > 0">
          <h2>Suscripciones Activas</h2>
          <div class="subscriptions-list">
            <div 
              v-for="subscription in currentAccount.subscriptions" 
              :key="subscription.id"
              class="subscription-card"
            >
              <div class="subscription-info">
                <div class="subscription-app">
                  {{ subscription.application?.name || 'Aplicación desconocida' }}
                </div>
                <div class="subscription-details">
                  Status: {{ getStatusLabel(subscription.status) }}
                  <span v-if="subscription.trialEndsAt">
                    • Prueba hasta: {{ formatDate(subscription.trialEndsAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountsStore, type UpdateAccountDto } from '@/stores/accounts'
import { storeToRefs } from 'pinia'
import { useConfirm } from '@/composables/useConfirm'

const accountsStore = useAccountsStore()
const { confirm } = useConfirm()

const { currentAccount, loading, error } = storeToRefs(accountsStore)
const saving = ref(false)
const isForbidden = ref(false)

// Datos del formulario
const formData = ref<UpdateAccountDto>({
  name: '',
  phone: ''
})

// Cargar datos de la cuenta
async function loadAccount() {
  try {
    isForbidden.value = false
    await accountsStore.fetchCurrentAccount()
    if (currentAccount.value) {
      // Inicializar el formulario con los datos actuales
      formData.value = {
        name: currentAccount.value.name,
        phone: currentAccount.value.phone || ''
      }
    }
  } catch (err: any) {
    console.error('Error al cargar cuenta:', err)
    
    // Check if it's a 403 Forbidden error
    const status = err?.statusCode || err?.status || err?.response?.status
    if (status === 403) {
      isForbidden.value = true
    }
  }
}

// Actualizar información de la cuenta
async function handleUpdateAccount() {
  if (!currentAccount.value) return
  
  saving.value = true
  try {
    await accountsStore.updateAccount(formData.value)
    await confirm({
      title: 'Cuenta Actualizada',
      message: 'La información de tu cuenta se ha actualizado correctamente.',
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
  } catch (err) {
    console.error('Error al actualizar cuenta:', err)
    await confirm({
      title: 'Error',
      message: 'No se pudo actualizar la cuenta',
      details: 'Por favor, inténtalo de nuevo más tarde.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
  } finally {
    saving.value = false
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

function getStatusLabel(status: string): string {
  const statusLower = status?.toLowerCase() || ''
  
  if (statusLower === 'active' || statusLower === 'activa') return 'Activa'
  if (statusLower === 'trialing') return 'En Prueba'
  if (statusLower === 'canceled' || statusLower === 'cancelled' || statusLower === 'cancelada') return 'Cancelada'
  if (statusLower === 'expired' || statusLower === 'expirada') return 'Expirada'
  if (statusLower === 'pending' || statusLower === 'pendiente' || statusLower === 'incomplete') return 'Pendiente'
  if (statusLower === 'past_due') return 'Pago Vencido'
  
  return 'Activa'
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Cargar datos al montar el componente
onMounted(() => {
  loadAccount()
})
</script>

<style scoped>
.account-view {
  width: 100%;
  min-height: 100%;
  background: var(--color-background);
}

/* ============================================
   FORBIDDEN MESSAGE
   ============================================ */
.forbidden-message {
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  padding: 3rem 2rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

:global(.dark) .forbidden-message {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
}

.forbidden-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
}

.forbidden-icon svg {
  color: #ef4444;
  width: 48px;
  height: 48px;
}

:global(.dark) .forbidden-icon svg {
  color: #f87171;
}

.forbidden-title {
  margin: 0 0 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.02em;
}

.forbidden-description {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  color: var(--color-text);
  line-height: 1.6;
}

.forbidden-details {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
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
  padding: 2rem;
  text-align: center;
  max-width: 800px;
}

.error-state p {
  color: #e74c3c;
  margin-bottom: 1rem;
}

/* Secciones */
.account-section {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  max-width: 800px;
}

.account-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
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

/* Badge de estado */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

/* Formularios */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-heading);
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

/* Botones */
.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: 500;
}

.btn-primary {
  background: var(--color-heading);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-background-soft);
}

/* Sección de información */
.info-section {
  background: var(--color-background-mute);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.7;
  font-weight: 500;
}

.info-item span {
  color: var(--color-text);
  font-size: 0.9375rem;
}

/* Lista de usuarios */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.8;
}

.user-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.user-role {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-owner {
  background: #fff3cd;
  color: #856404;
}

.role-admin {
  background: #d1ecf1;
  color: #0c5460;
}

.role-user {
  background: #e2e3e5;
  color: #383d41;
}

.user-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Lista de suscripciones */
.subscriptions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subscription-card {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
}

.subscription-app {
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.subscription-details {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .user-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
