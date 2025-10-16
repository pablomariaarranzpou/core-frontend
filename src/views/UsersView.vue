<template>
  <div class="users-view">
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
          La gestión de usuarios está restringida a administradores y propietarios de la organización.
        </p>
      </div>

      <!-- Normal Content (only if not forbidden) -->
      <template v-else>
        <!-- Header Section -->
        <header class="users-header">
          <div class="header-content">
            <h1 class="page-title">Gestión de Usuarios</h1>
            <p class="page-subtitle">Administra los usuarios y roles de tu organización</p>
          </div>
          <button 
            class="btn-primary" 
            @click="handleAddUser"
            aria-label="Añadir nuevo usuario"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            Añadir Usuario
          </button>
        </header>

      <!-- Stats Cards -->
      <section class="users-stats" aria-label="Estadísticas de usuarios">
        <div class="stat-card">
          <div class="stat-icon gradient-blue" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalUsers || users.length }}</span>
            <span class="stat-label">Total Usuarios</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon gradient-green" aria-hidden="true">
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
        
        <div class="stat-card">
          <div class="stat-icon gradient-orange" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ adminUsersCount }}</span>
            <span class="stat-label">Administradores</span>
          </div>
        </div>
      </section>

      <!-- Users Table -->
      <DataTable
        title="Lista de Usuarios"
        :columns="tableColumns"
        :data="filteredUsers"
        :loading="loading"
        :error="error"
        v-model="searchQuery"
        search-placeholder="Buscar usuarios..."
        :selectable="true"
        :row-clickable="false"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalUsers"
        :items-per-page="itemsPerPage"
        loading-text="Cargando usuarios..."
        :empty-text="searchQuery ? `No se encontraron usuarios que coincidan con &quot;${searchQuery}&quot;` : 'No hay usuarios registrados'"
        @page-change="loadUsers"
        @select="handleSelection"
      >
        <!-- User Info Cell -->
        <template #cell-name="{ row }">
          <div class="user-info">
            <div class="user-avatar">
              {{ getUserInitial(row) }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ getUserDisplayName(row) }}</span>
              <span class="user-email">{{ row.email }}</span>
            </div>
          </div>
        </template>

        <!-- Role Cell -->
        <template #cell-role="{ row }">
          <span class="badge" :class="`badge-${row.role}`">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <!-- Admin: Shield -->
              <path v-if="row.role === 'admin'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <!-- Owner: Crown -->
              <path v-else-if="row.role === 'owner'" d="m2 3 2.5 7L8 7l4 3 4-3 3.5 3L22 3l-1 13H3L2 3z"></path>
              <!-- User: User icon -->
              <template v-else>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </template>
            </svg>
            {{ getRoleLabel(row.role) }}
          </span>
        </template>

        <!-- Status Cell -->
        <template #cell-status="{ row }">
          <span class="status-badge" :class="getStatusClass(row.isActive)">
            <span class="status-dot"></span>
            {{ getStatusLabel(row.isActive) }}
          </span>
        </template>

        <!-- Last Access Cell -->
        <template #cell-lastLoginAt="{ row }">
          <span class="last-access">{{ formatLastAccess(row.lastLoginAt) }}</span>
        </template>

        <!-- Actions Cell -->
        <template #actions="{ row }">
          <DropdownActions 
            ref="dropdownRefs"
            :title="row ? `Acciones para ${getUserDisplayName(row)}` : 'Acciones'"
          >
            <DropdownItem icon="edit" label="Editar rol" @click="handleEditUser(row)" />
            <DropdownDivider />
            <DropdownItem icon="delete" label="Eliminar usuario" variant="danger" @click="handleDeleteUser(row)" />
          </DropdownActions>
        </template>
      </DataTable>
      </template>
    </div>
    
    <!-- Add User Modal -->
    <AddUserModal
      v-model="showAddUserModal"
      @user-created="handleUserCreated"
    />
    
    <!-- Edit User Role Modal -->
    <EditUserRoleModal
      v-model="showEditRoleModal"
      :user="selectedUserForEdit"
      @role-updated="handleRoleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/stores/users'
import DataTable, { type TableColumn } from '@/components/table/DataTable.vue'
import DropdownActions from '@/components/table/DropdownActions.vue'
import DropdownItem from '@/components/table/DropdownItem.vue'
import DropdownDivider from '@/components/table/DropdownDivider.vue'
import AddUserModal from '@/components/AddUserModal.vue'
import EditUserRoleModal from '@/components/EditUserRoleModal.vue'
import { useConfirm } from '@/composables/useConfirm'

// ============================================
// STORE & STATE
// ============================================
const usersStore = useUsersStore()
const { confirm } = useConfirm()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedUsers = ref<User[]>([])
const showAddUserModal = ref(false)
const showEditRoleModal = ref(false)
const selectedUserForEdit = ref<User | null>(null)
const isForbidden = ref(false)

// ============================================
// COMPUTED PROPERTIES
// ============================================
const users = computed(() => usersStore.users || [])
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error || '')
const totalUsers = computed(() => usersStore.pagination.total || users.value.length)
const totalPages = computed(() => usersStore.pagination.totalPages || Math.ceil(filteredUsers.value.length / itemsPerPage.value))

// Stats
const activeUsersCount = computed(() => 
  users.value.filter(user => user.isActive).length
)

const adminUsersCount = computed(() => 
  users.value.filter(user => user.role === 'admin' || user.role === 'owner').length
)

// Filtered users based on search
const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value
  
  const query = searchQuery.value.toLowerCase().trim()
  return users.value.filter(user => {
    const searchableText = [
      user.firstName,
      user.lastName,
      user.email,
      getRoleLabel(user.role)
    ].filter(Boolean).join(' ').toLowerCase()
    
    return searchableText.includes(query)
  })
})

// ============================================
// TABLE CONFIGURATION
// ============================================
const tableColumns: TableColumn[] = [
  { key: 'name', label: 'Usuario', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'status', label: 'Estado', sortable: false },
  { key: 'lastLoginAt', label: 'Último Acceso', sortable: true }
]

// ============================================
// HELPER FUNCTIONS
// ============================================
function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return 'Usuario desconocido'
  
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
  
  return fullName || user.email || 'Usuario'
}

function getUserInitial(user: User | null | undefined): string {
  if (!user) return '?'
  
  return user.firstName?.charAt(0)?.toUpperCase() 
    || user.email?.charAt(0)?.toUpperCase() 
    || '?'
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
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  } catch {
    return 'Fecha inválida'
  }
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  user: 'Usuario',
  owner: 'Propietario'
}

function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] || role
}

function getStatusClass(isActive: boolean): string {
  return isActive ? 'status-active' : 'status-inactive'
}

function getStatusLabel(isActive: boolean): string {
  return isActive ? 'Activo' : 'Inactivo'
}

// ============================================
// DATA LOADING
// ============================================
async function loadUsers(page = 1) {
  currentPage.value = page
  try {
    isForbidden.value = false
    await usersStore.fetchUsers(page, itemsPerPage.value)
  } catch (err: any) {
    console.error('Error loading users:', err)
    
    // Check if it's a 403 Forbidden error
    // Check multiple possible error structures
    const status = err?.statusCode || err?.status || err?.response?.status
    if (status === 403) {
      isForbidden.value = true
    }
  }
}

// ============================================
// EVENT HANDLERS
// ============================================
function handleSelection(users: User[]) {
  selectedUsers.value = users
  console.log('Selected users:', users)
  // TODO: Implement bulk actions
}

async function handleEditUser(user: User) {
  selectedUserForEdit.value = user
  showEditRoleModal.value = true
}

async function handleRoleUpdated(user: User) {
  console.log('Role updated:', user)
  // Recargar la lista de usuarios para reflejar el cambio
  await loadUsers(currentPage.value)
}

async function handleDeleteUser(user: User) {
  const userName = getUserDisplayName(user)
  
  const confirmed = await confirm({
    title: 'Eliminar Usuario',
    message: `¿Estás seguro de que deseas eliminar a ${userName}?`,
    details: 'Esta acción no se puede deshacer.',
    type: 'error',
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar',
  })
  
  if (!confirmed) return
  
  try {
    await usersStore.deleteUser(user.id)
    // Reload current page after deletion
    await loadUsers(currentPage.value)
    
    await confirm({
      title: 'Usuario Eliminado',
      message: `${userName} ha sido eliminado correctamente.`,
      type: 'success',
      confirmText: 'Entendido',
      showCancel: false,
    })
  } catch (err) {
    console.error('Error deleting user:', err)
    await confirm({
      title: 'Error',
      message: `Error al eliminar a ${userName}`,
      details: 'Por favor, inténtalo nuevamente.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
  }
}

function handleAddUser() {
  showAddUserModal.value = true
}

async function handleUserCreated(user: User) {
  console.log('User created:', user)
  // Recargar la lista de usuarios
  await loadUsers(currentPage.value)
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  loadUsers()
})

// Watch for search changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* ============================================
   BASE
   ============================================ */
.users-view {
  width: 100%;
  min-height: 100vh;
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

/* ============================================
   HEADER
   ============================================ */
.users-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.page-title {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* ============================================
   STATS CARDS
   ============================================ */
.users-stats {
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
  transition: all var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

:global(.dark) .stat-card {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark) .stat-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
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

/* Gradientes del sistema de diseño */
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

/* ============================================
   CUSTOM TABLE CELLS
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

.badge-owner {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border-color: rgba(139, 92, 246, 0.2);
}

:global(.dark) .badge-admin {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.35);
}

:global(.dark) .badge-user {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.35);
}

:global(.dark) .badge-owner {
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  border-color: rgba(139, 92, 246, 0.35);
}

/* ============================================
   STATUS BADGES
   ============================================ */
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

:global(.dark) .status-active {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.35);
}

:global(.dark) .status-inactive {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.35);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.status-active .status-dot {
  animation: pulse-subtle 2s ease-in-out infinite;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
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
  color: white !important;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  line-height: 1;
}

/* Alinear SVG dentro del botón */
.btn-primary svg {
  flex-shrink: 0;
  vertical-align: middle;
  margin-top: -2px;
  color: white !important;
  stroke: white !important;
}

/* Modo oscuro: forzar texto blanco */
:global(.dark) .btn-primary,
:global(html.dark) .btn-primary {
  color: white !important;
  background: var(--color-primary);
}

:global(.dark) .btn-primary svg,
:global(html.dark) .btn-primary svg {
  color: white !important;
  stroke: white !important;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: var(--shadow-md);
  color: white !important;
}

.btn-primary:hover:not(:disabled) svg {
  color: white !important;
  stroke: white !important;
}

.btn-primary:active:not(:disabled) {
  background: #1d4ed8;
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .users-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-primary {
    width: 100%;
  }
  
  .users-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 0.9375rem;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .users-header {
    margin-bottom: 1.5rem;
  }
  
  .users-stats {
    margin-bottom: 2rem;
    gap: 1rem;
  }
  
  .badge,
  .status-badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.75rem;
  }
}
</style>
