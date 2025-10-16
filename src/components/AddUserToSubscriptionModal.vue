<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <Transition name="modal-scale">
          <div v-if="modelValue" class="modal-container">
            <!-- Header -->
            <div class="modal-header">
              <div class="modal-header-content">
                <div class="modal-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                  </svg>
                </div>
                <div class="modal-title-group">
                  <h3 class="modal-title">Añadir Usuario</h3>
                  <p class="modal-subtitle">{{ applicationName }}</p>
                </div>
              </div>
              <button class="modal-close" @click="closeModal" aria-label="Cerrar modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <!-- Search -->
              <div class="search-section">
                <label class="search-label">Buscar Usuario</label>
                <div class="search-input-wrapper">
                  <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Buscar por nombre o email..."
                    class="search-input"
                    @keydown.escape="closeModal"
                  />
                  <button 
                    v-if="searchQuery" 
                    class="search-clear"
                    @click="searchQuery = ''"
                    aria-label="Limpiar búsqueda"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="state-container state-loading">
                <div class="loading-spinner"></div>
                <p class="state-text">Cargando usuarios disponibles...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="state-container state-error">
                <div class="state-icon error-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <p class="state-text error-text">{{ error }}</p>
                <button class="btn-secondary" @click="$emit('retry')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Reintentar
                </button>
              </div>

              <!-- Empty State -->
              <div v-else-if="filteredUsers.length === 0" class="state-container state-empty">
                <div class="state-icon empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <p class="state-text">
                  {{ searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios disponibles' }}
                </p>
                <p v-if="!searchQuery" class="state-subtext">
                  Todos los usuarios de la organización ya están asignados a esta suscripción.
                </p>
              </div>

              <!-- Users List -->
              <div v-else class="users-list-container">
                <div class="users-count">
                  {{ filteredUsers.length }} {{ filteredUsers.length === 1 ? 'usuario disponible' : 'usuarios disponibles' }}
                </div>
                <div class="users-list">
                  <div 
                    v-for="user in filteredUsers" 
                    :key="user.id"
                    class="user-card"
                    :class="{ 'user-card-selected': selectedUserId === user.id }"
                    @click="selectUser(user.id)"
                    role="button"
                    :aria-pressed="selectedUserId === user.id"
                    tabindex="0"
                    @keydown.enter="selectUser(user.id)"
                    @keydown.space.prevent="selectUser(user.id)"
                  >
                    <div class="user-avatar">
                      {{ getInitials(user.firstName, user.lastName) }}
                    </div>
                    <div class="user-info">
                      <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="user-email">{{ user.email }}</div>
                      <div v-if="user.role" class="user-role">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        {{ getRoleLabel(user.role) }}
                      </div>
                    </div>
                    <div class="user-check">
                      <Transition name="check-scale">
                        <svg v-if="selectedUserId === user.id" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </Transition>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button class="btn-cancel" @click="closeModal">
                Cancelar
              </button>
              <button 
                class="btn-confirm" 
                @click="handleConfirm"
                :disabled="!selectedUserId || confirming"
              >
                <span v-if="confirming" class="btn-spinner"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {{ confirming ? 'Añadiendo...' : 'Añadir Usuario' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// ============================================
// TYPES
// ============================================
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role?: 'admin' | 'user' | 'owner'
  isActive?: boolean
}

// ============================================
// PROPS & EMITS
// ============================================
interface Props {
  modelValue: boolean
  availableUsers: User[]
  applicationName?: string
  loading?: boolean
  error?: string
  confirming?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  applicationName: 'Suscripción',
  loading: false,
  error: '',
  confirming: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [userId: string]
  'retry': []
}>()

// ============================================
// STATE
// ============================================
const searchQuery = ref('')
const selectedUserId = ref<string | null>(null)

// ============================================
// COMPUTED
// ============================================
const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return props.availableUsers
  
  const query = searchQuery.value.toLowerCase().trim()
  return props.availableUsers.filter(user => {
    const searchableText = [
      user.firstName,
      user.lastName,
      user.email,
      user.role,
    ].filter(Boolean).join(' ').toLowerCase()
    
    return searchableText.includes(query)
  })
})

// ============================================
// METHODS
// ============================================
function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return `${first}${last}` || '?'
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    user: 'Usuario',
    owner: 'Propietario',
  }
  return labels[role] || role
}

function selectUser(userId: string) {
  selectedUserId.value = userId
}

function closeModal() {
  emit('update:modelValue', false)
}

function handleConfirm() {
  if (selectedUserId.value) {
    emit('confirm', selectedUserId.value)
  }
}

// ============================================
// WATCHERS
// ============================================
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    // Reset state when opening
    searchQuery.value = ''
    selectedUserId.value = null
  }
})

// Close on Escape key
watch(() => props.modelValue, (isOpen) => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
  }
  
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
  }
  
  return () => {
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
/* ============================================
   OVERLAY & TRANSITIONS
   ============================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: overlay-appear 0.2s ease-out;
}

@keyframes overlay-appear {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.6);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ============================================
   MODAL CONTAINER
   ============================================ */
.modal-container {
  background: var(--color-background);
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px var(--color-border);
  overflow: hidden;
}

/* ============================================
   HEADER
   ============================================ */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem;
  border-bottom: 1px solid var(--color-border);
  gap: 1rem;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.modal-icon svg {
  color: white;
}

.modal-title-group {
  flex: 1;
  min-width: 0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close:hover {
  background: var(--color-background-mute);
  color: var(--color-heading);
  transform: scale(1.05);
}

.modal-close:active {
  transform: scale(0.95);
}

/* ============================================
   BODY
   ============================================ */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Custom scrollbar */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover);
}

/* ============================================
   SEARCH SECTION
   ============================================ */
.search-section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.search-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-heading);
  letter-spacing: -0.01em;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-background-soft);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-background);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-clear {
  position: absolute;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  border: none;
  background: var(--color-background-mute);
  border-radius: 8px;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-clear:hover {
  background: var(--color-border);
  color: var(--color-heading);
}

/* ============================================
   STATE CONTAINERS
   ============================================ */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  gap: 1rem;
}

.state-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.empty-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  color: #3b82f6;
}

.error-icon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
  color: #ef4444;
}

.state-text {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-heading);
  line-height: 1.5;
}

.error-text {
  color: #ef4444;
}

.state-subtext {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 320px;
}

.state-loading .loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================
   USERS LIST
   ============================================ */
.users-list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.users-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-background-soft);
}

.user-card:hover {
  border-color: var(--color-primary);
  background: var(--color-background);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.user-card:active {
  transform: translateY(0);
}

.user-card-selected {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.08);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.user-card-selected:hover {
  background: rgba(59, 130, 246, 0.1);
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
  letter-spacing: -0.01em;
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.user-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-heading);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
  text-transform: capitalize;
}

.user-check {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.user-card-selected .user-check {
  opacity: 1;
}

.user-check svg {
  color: white;
}

.check-scale-enter-active,
.check-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.check-scale-enter-from,
.check-scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* ============================================
   FOOTER
   ============================================ */
.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.btn-cancel {
  background: var(--color-background);
  color: var(--color-heading);
  border: 2px solid var(--color-border);
}

.btn-cancel:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

.btn-cancel:active {
  transform: translateY(0);
}

.btn-confirm {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-confirm:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.btn-confirm:active:not(:disabled) {
  transform: translateY(0);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-header {
    padding: 1.25rem;
  }
  
  .modal-icon {
    width: 40px;
    height: 40px;
  }
  
  .modal-title {
    font-size: 1.125rem;
  }
  
  .modal-body {
    padding: 1.25rem;
  }
  
  .user-avatar {
    width: 44px;
    height: 44px;
    font-size: 1rem;
  }
  
  .modal-footer {
    padding: 1.25rem;
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}

/* ============================================
   DARK MODE ENHANCEMENTS
   ============================================ */
:global(.dark) .modal-container {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

:global(.dark) .search-input {
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark) .user-card {
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark) .user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
