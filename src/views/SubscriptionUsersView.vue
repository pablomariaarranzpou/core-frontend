<template>
  <div class="subscription-users-view">
    <div class="container py-lg">
      <!-- Access Denied State (403 - No permissions) -->
      <div v-if="isForbidden" class="access-denied">
        <div class="access-denied-icon" style="background: rgba(255, 159, 10, 0.1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FF9F0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2 class="access-denied-title">Gestión de Usuarios Restringida</h2>
        <p class="access-denied-description">
          Solo los administradores y propietarios pueden gestionar usuarios de las aplicaciones.
          <br>Si necesitas añadir o eliminar usuarios, contacta con un administrador de tu organización.
        </p>
        <div class="access-denied-actions">
          <button class="btn-primary" @click="$router.push('/applications')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Volver a Mis Aplicaciones
          </button>
        </div>
      </div>

      <!-- No Subscription State -->
      <div v-else-if="!isSubscribed" class="access-denied">
        <div class="access-denied-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2 class="access-denied-title">Acceso Restringido</h2>
        <p class="access-denied-description">
          No tienes una suscripción activa para esta aplicación. 
          <br>Suscríbete para gestionar usuarios y acceder a todas las funcionalidades.
        </p>
        <div class="access-denied-actions">
          <button class="btn-primary" @click="goToApplication">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Ver Planes y Suscribirse
          </button>
          <button class="btn-secondary" @click="$router.push('/applications')">
            Volver a Aplicaciones
          </button>
        </div>
      </div>

      <!-- Main Content (only if subscribed) -->
      <template v-else>
        <!-- Header Section -->
        <header class="page-header">
          <button class="back-button" @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          
          <div class="header-content">
            <div class="app-info">
              <div class="app-icon" v-if="application">
                <img v-if="getAppLogo()" :src="getAppLogo()!" :alt="application.name" />
                <span v-else>{{ getAppInitials() }}</span>
              </div>
              <div class="app-details">
                <h1 class="page-title">Gestión de Usuarios</h1>
                <p class="page-subtitle">{{ application?.name || 'Aplicación' }}</p>
              </div>
            </div>
            
            <div class="subscription-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Suscrito
            </div>
          </div>
          
          <button 
            class="btn-primary" 
            @click="showAddUserModal = true"
            :disabled="canAddUsers === false"
            :title="canAddUsers === false ? 'No hay asientos disponibles' : 'Añadir nuevo usuario'"
            aria-label="Añadir nuevo usuario"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            Añadir Usuario
          </button>
        </header>

        <!-- Stats Cards -->
        <section class="stats-grid" aria-label="Estadísticas de usuarios">
          <div class="stat-card">
            <div class="stat-icon gradient-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ totalUsers }}</span>
              <span class="stat-label">Total Usuarios</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon gradient-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ activeUsersCount }}</span>
              <span class="stat-label">Usuarios Activos</span>
            </div>
          </div>
          
          <div class="stat-card" :class="{ 'stat-card-warning': availableSeats === 0, 'stat-card-success': availableSeats === null }">
            <div class="stat-icon" :class="availableSeats === null ? 'gradient-green' : availableSeats === 0 ? 'gradient-orange' : 'gradient-purple'">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value" :class="{ 'stat-value-warning': availableSeats === 0, 'stat-value-success': availableSeats === null }">{{ availableSeatsLabel }}</span>
              <span class="stat-label">Asientos Disponibles</span>
            </div>
          </div>
        </section>

        <!-- Users Table -->
        <DataTable
          title="Usuarios de la Suscripción"
          :columns="tableColumns"
          :data="filteredUsers"
          :loading="loadingUsers"
          :error="usersError"
          v-model="searchQuery"
          search-placeholder="Buscar usuarios..."
          :selectable="true"
          :row-clickable="true"
          loading-text="Cargando usuarios..."
          empty-text="No hay usuarios asignados a esta suscripción. Haz clic en 'Añadir Usuario' para empezar."
        >
          <!-- User Info Cell -->
          <template #cell-name="{ row }">
            <div class="user-info">
              <div class="user-avatar" :class="{ 'has-image': row.avatar }">
                <img v-if="row.avatar" :src="row.avatar" :alt="`Avatar de ${getUserDisplayName(row)}`" />
                <span v-else>{{ getUserInitial(row) }}</span>
              </div>
              <div class="user-details">
                <span class="user-name">{{ getUserDisplayName(row) }}</span>
                <span class="user-email">{{ row.email }}</span>
              </div>
            </div>
          </template>

          <!-- Role Cell -->
          <template #cell-role="{ row }">
            <span class="badge" :class="`badge-${row.role || 'user'}`">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {{ getRoleLabel(row.role || 'user') }}
            </span>
          </template>

          <!-- Status Cell -->
          <template #cell-status="{ row }">
            <span class="status-badge" :class="row.isActive ? 'status-active' : 'status-inactive'">
              <span class="status-dot"></span>
              {{ row.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </template>

          <!-- Last Access Cell -->
          <template #cell-lastAccess="{ row }">
            <span class="last-access">{{ formatDate(row.addedAt) }}</span>
          </template>

          <!-- Actions Cell -->
          <template #actions="{ row }">
            <DropdownActions :title="`Acciones para ${getUserDisplayName(row)}`">
              <DropdownItem icon="edit" label="Editar rol" @click="handleEditUser(row)" />
              <DropdownDivider />
              <DropdownItem icon="delete" label="Quitar de suscripción" variant="danger" @click="handleRemoveUser(row)" />
            </DropdownActions>
          </template>
        </DataTable>
      </template>
    </div>

    <!-- Add User Modal Component -->
    <AddUserToSubscriptionModal
      v-model="showAddUserModal"
      :available-users="availableUsers"
      :application-name="application?.name"
      :loading="loadingAvailableUsers"
      :error="availableUsersError"
      :confirming="addingUser"
      @confirm="handleAddUserToSubscription"
      @retry="loadAvailableUsers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useApplicationsStore } from '@/stores/applications'
import { useUsersStore } from '@/stores/users'
import { useTheme } from '@/composables/useTheme'
import { useConfirm } from '@/composables/useConfirm'
import httpService from '@/services/http'
import DataTable, { type TableColumn } from '@/components/table/DataTable.vue'
import DropdownActions from '@/components/table/DropdownActions.vue'
import DropdownItem from '@/components/table/DropdownItem.vue'
import DropdownDivider from '@/components/table/DropdownDivider.vue'
import AddUserToSubscriptionModal from '@/components/AddUserToSubscriptionModal.vue'

// ============================================
// STORES & ROUTER
// ============================================
const route = useRoute()
const router = useRouter()
const subscriptionsStore = useSubscriptionsStore()
const applicationsStore = useApplicationsStore()
const usersStore = useUsersStore()
const { isDark } = useTheme()
const { confirm } = useConfirm()

// ============================================
// STATE
// ============================================
const applicationId = computed(() => route.params.id as string)
const searchQuery = ref('')
const showAddUserModal = ref(false)
const loading = ref(false)
const error = ref('')
const isForbidden = ref(false)

// Subscription users state
const subscriptionUsersData = ref<any[]>([])
const loadingUsers = ref(false)
const usersError = ref('')

// Modal state
const loadingAvailableUsers = ref(false)
const availableUsersError = ref('')
const addingUser = ref(false)

// ============================================
// SUBSCRIPTION & APPLICATION DATA
// ============================================
const currentSubscription = computed(() => {
  return subscriptionsStore.subscriptions.find(sub => 
    sub.application?.id === applicationId.value &&
    (sub.status.toLowerCase() === 'active' || sub.status.toLowerCase() === 'trialing')
  )
})

const isSubscribed = computed(() => !!currentSubscription.value)

const application = computed(() => {
  return currentSubscription.value?.application || 
         applicationsStore.applications.find(app => app.id === applicationId.value)
})

// ============================================
// USERS DATA
// ============================================
const users = computed(() => subscriptionUsersData.value)

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value
  
  const query = searchQuery.value.toLowerCase().trim()
  return users.value.filter(user => {
    if (!user) return false
    
    const searchableText = [
      user.email,
      user.firstName,
      user.lastName,
      `${user.firstName} ${user.lastName}`,
      user.role
    ].filter(Boolean).join(' ').toLowerCase()
    
    return searchableText.includes(query)
  })
})

// ============================================
// COMPUTED STATS
// ============================================
const totalUsers = computed(() => users.value.length)

const activeUsersCount = computed(() => {
  // Todos los usuarios en subscriptionUsers están activos
  return users.value.length
})

const maxUsers = computed(() => {
  // Obtener límite de usuarios directamente de la suscripción
  // El backend envía maxUsers en la suscripción, no dentro de un objeto 'plan'
  const subscriptionMaxUsers = currentSubscription.value?.maxUsers
  
  // Si no hay límite (null o undefined) = ilimitado
  return subscriptionMaxUsers ?? null
})

const availableSeats = computed(() => {
  const max = maxUsers.value
  
  // Si es null = ilimitado
  if (max === null) return null
  
  // Calcular asientos disponibles
  return Math.max(0, max - totalUsers.value)
})

const availableSeatsLabel = computed(() => {
  const seats = availableSeats.value
  
  if (seats === null) return 'Ilimitados'
  if (seats === 0) return 'Sin asientos disponibles'
  return seats.toString()
})

const canAddUsers = computed(() => {
  const seats = availableSeats.value
  
  // Si es null (ilimitado), siempre puede añadir
  if (seats === null) return true
  
  // Si tiene asientos disponibles, puede añadir
  return seats > 0
})

// ============================================
// AVAILABLE USERS FOR MODAL
// ============================================
const availableUsers = computed(() => {
  // Filtrar usuarios que NO están ya en la suscripción
  const currentUserIds = subscriptionUsersData.value.map((u: any) => u.id)
  return usersStore.users.filter(user => !currentUserIds.includes(user.id))
})

// ============================================
// TABLE CONFIGURATION
// ============================================
const tableColumns: TableColumn[] = [
  { key: 'name', label: 'Usuario', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'status', label: 'Estado', sortable: false },
  { key: 'lastAccess', label: 'Último Acceso', sortable: true }
]

// ============================================
// HELPER FUNCTIONS
// ============================================
function getAppLogo(): string | null {
  if (!application.value) return null
  if (isDark.value && application.value.logoDark) {
    return application.value.logoDark
  }
  return application.value.logo || null
}

function getAppInitials(): string {
  if (!application.value) return '?'
  return application.value.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getUserDisplayName(user: any): string {
  if (!user) return 'Usuario desconocido'
  
  console.log('👤 User data:', user) // Debug
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  if (user.firstName) {
    return user.firstName
  }
  if (user.email) {
    return user.email
  }
  return 'Usuario'
}

function getUserInitial(user: any): string {
  if (!user) return '?'
  
  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase()
  }
  if (user.email) {
    return user.email.charAt(0).toUpperCase()
  }
  return '?'
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Fecha inválida'
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}

function formatLastAccess(lastLoginAt?: string | null): string {
  if (!lastLoginAt) return 'Nunca'
  
  try {
    const date = new Date(lastLoginAt)
    if (isNaN(date.getTime())) return 'Fecha inválida'
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 1) return 'Justo ahora'
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  } catch {
    return 'Fecha inválida'
  }
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  user: 'Usuario',
  viewer: 'Solo Lectura'
}

function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] || 'Usuario'
}

function getStatusClass(isActive: boolean): string {
  return isActive ? 'status-active' : 'status-inactive'
}

function getStatusLabel(isActive: boolean): string {
  return isActive ? 'Activo' : 'Inactivo'
}

// ============================================
// NAVIGATION
// ============================================
function goBack() {
  router.back()
}

function goToApplication() {
  router.push(`/applications/${applicationId.value}`)
}

// ============================================
// EVENT HANDLERS
// ============================================
async function handleEditUser(user: any) {
  console.log('Edit user role:', user)
  // TODO: Implement edit role modal
  await confirm({
    title: 'Función en desarrollo',
    message: 'La edición de roles estará disponible próximamente',
    details: 'Esta funcionalidad se está implementando.',
    type: 'info',
    confirmText: 'Entendido',
    showCancel: false,
  })
}

async function handleRemoveUser(user: any) {
  const userName = getUserDisplayName(user)
  
  const confirmed = await confirm({
    title: 'Quitar Usuario',
    message: `¿Estás seguro de que deseas quitar a ${userName} de esta suscripción?`,
    details: 'El usuario perderá acceso a esta aplicación.',
    type: 'warning',
    confirmText: 'Sí, quitar',
    cancelText: 'Cancelar',
  })
  
  if (!confirmed) return
  
  console.log('Remove user from subscription:', user)
  // TODO: Implement remove user from subscription API call
  await confirm({
    title: 'Función en desarrollo',
    message: 'La eliminación de usuarios estará disponible próximamente',
    details: 'Esta funcionalidad se está implementando.',
    type: 'info',
    confirmText: 'Entendido',
    showCancel: false,
  })
}

// ============================================
// MODAL FUNCTIONS
// ============================================
async function loadSubscriptionUsers() {
  if (!currentSubscription.value?.id) {
    console.log('⚠️ No hay suscripción para cargar usuarios')
    return
  }
  
  loadingUsers.value = true
  usersError.value = ''
  
  try {
    console.log('🔄 Cargando usuarios de la suscripción:', currentSubscription.value.id)
    
    const response = await httpService.get<any[]>(
      `/subscriptions/${currentSubscription.value.id}/users`
    )
    
    subscriptionUsersData.value = response
    console.log('✅ Usuarios cargados:', response.length)
  } catch (err: any) {
    console.error('❌ Error al cargar usuarios de la suscripción:', err)
    
    // Check if it's a 403 Forbidden error
    const status = err?.statusCode || err?.status || err?.response?.status
    if (status === 403) {
      console.log('🔒 Usuario sin permisos para ver usuarios (403)')
      isForbidden.value = true
    } else {
      usersError.value = err.message || 'Error al cargar usuarios'
    }
  } finally {
    loadingUsers.value = false
  }
}

async function loadAvailableUsers() {
  loadingAvailableUsers.value = true
  availableUsersError.value = ''
  
  try {
    await usersStore.fetchUsers(1, 100) // Cargar todos los usuarios de la organización
  } catch (err: any) {
    console.error('Error loading available users:', err)
    availableUsersError.value = err.message || 'Error al cargar usuarios'
  } finally {
    loadingAvailableUsers.value = false
  }
}

async function handleAddUserToSubscription(userId: string) {
  if (!userId || !currentSubscription.value) return
  
  const selectedUser = usersStore.users.find(u => u.id === userId)
  if (!selectedUser) return
  
  // Confirmar acción
  const confirmed = await confirm({
    title: 'Añadir Usuario',
    message: `¿Deseas añadir a ${selectedUser.firstName} ${selectedUser.lastName} a esta suscripción?`,
    details: `El usuario tendrá acceso a ${application.value?.name}.`,
    type: 'question',
    confirmText: 'Sí, añadir',
    cancelText: 'Cancelar',
  })
  
  if (!confirmed) return
  
  addingUser.value = true
  
  try {
    console.log('🔄 Añadiendo usuario a suscripción:', {
      subscriptionId: currentSubscription.value.id,
      userId: userId,
    })
    
    // Llamar al endpoint del backend para añadir usuario a la suscripción
    const response = await httpService.post(
      `/subscriptions/${currentSubscription.value.id}/users`,
      { userId }
    )
    
    console.log('✅ Usuario añadido correctamente:', response)
    
    // Mostrar éxito
    await confirm({
      title: '¡Usuario Añadido!',
      message: `${selectedUser.firstName} ${selectedUser.lastName} ha sido añadido a la suscripción.`,
      details: 'El usuario ahora tiene acceso a esta aplicación.',
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
    
    // Cerrar modal
    showAddUserModal.value = false
    
    // Recargar usuarios de la suscripción
    await loadSubscriptionUsers()
    
  } catch (err: any) {
    console.error('❌ Error al añadir usuario a suscripción:', err)
    
    // Extraer mensaje de error más específico
    let errorMessage = 'No se pudo añadir el usuario'
    let errorDetails = 'Por favor, inténtalo de nuevo más tarde.'
    
    if (err.message) {
      try {
        const errorData = JSON.parse(err.message)
        errorMessage = errorData.message || errorMessage
        errorDetails = errorData.error || errorDetails
      } catch {
        errorMessage = err.message
      }
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
    addingUser.value = false
  }
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  // Load subscriptions if not loaded
  if (subscriptionsStore.subscriptions.length === 0) {
    try {
      await subscriptionsStore.fetchSubscriptions()
    } catch (err: any) {
      // Check if it's a 403 Forbidden error
      const status = err?.statusCode || err?.status || err?.response?.status
      if (status === 403) {
        console.log('🔒 Usuario sin permisos para gestionar usuarios (403)')
        isForbidden.value = true
        return
      }
    }
  }
  
  // Load application if not loaded
  if (!application.value && applicationId.value) {
    await applicationsStore.fetchApplicationById(applicationId.value)
  }
  
  // Cargar usuarios de la suscripción usando el endpoint correcto
  await loadSubscriptionUsers()
})

// Watch for subscription changes to reload users
watch(currentSubscription, (newSub) => {
  if (newSub?.id) {
    loadSubscriptionUsers()
  }
})

// Watch for modal open to load available users
watch(showAddUserModal, (isOpen) => {
  if (isOpen) {
    loadAvailableUsers()
  }
})
</script>

<style scoped>
/* ============================================
   BASE
   ============================================ */
.subscription-users-view {
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
}

/* ============================================
   ACCESS DENIED
   ============================================ */
.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  padding: 2rem;
}

.access-denied-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  color: #ef4444;
  margin-bottom: 2rem;
  border: 3px solid rgba(239, 68, 68, 0.2);
}

.access-denied-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 1rem 0;
}

.access-denied-description {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin: 0 0 2.5rem 0;
  max-width: 600px;
}

.access-denied-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* ============================================
   HEADER
   ============================================ */
.page-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.back-button {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.back-button:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  transform: translateX(-2px);
}

.header-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.app-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.app-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.app-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.2;
}

.page-subtitle {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.subscription-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

/* ============================================
   STATS CARDS
   ============================================ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1;
}

.stat-value-warning {
  color: #f59e0b;
}

.stat-value-success {
  color: #10b981;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.stat-card-warning {
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.05);
}

.stat-card-success {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}

/* ============================================
   TABLE CELLS
   ============================================ */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.user-avatar.has-image {
  background: var(--color-background-mute);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.2;
}

.user-email {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   BADGES
   ============================================ */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid;
}

.badge-admin {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.2);
}

.badge-user {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.2);
}

.badge-viewer {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border-color: rgba(107, 114, 128, 0.2);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid;
}

.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.2);
}

.status-inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.last-access {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

/* ============================================
   BUTTONS
   ============================================ */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
}

.btn-primary:hover {
  background: #2563eb;
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-background-soft);
  color: var(--color-heading);
  padding: 0.875rem 1.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .page-header {
    flex-wrap: wrap;
  }
  
  .header-content {
    width: 100%;
  }
  
  .btn-primary {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .app-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .subscription-badge {
    align-self: flex-start;
  }
}
</style>
