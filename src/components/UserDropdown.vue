<template>
  <div class="user-dropdown" v-click-outside="closeDropdown">
    <button 
      @click="toggleDropdown" 
      class="user-dropdown-trigger"
      :class="{ 'is-open': isOpen }"
    >
      <div class="user-avatar">
        <span>{{ avatarInitial }}</span>
      </div>
      <div class="user-info-compact">
        <span class="user-name">{{ displayName }}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          class="chevron"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="user-dropdown-menu">
        <div class="dropdown-header">
          <div class="user-avatar-large">
            <span>{{ avatarInitial }}</span>
          </div>
          <div class="user-details">
            <div class="user-name-full">{{ displayName }}</div>
            <div class="user-email">{{ authStore.user?.email }}</div>
          </div>
        </div>
        
        <div class="dropdown-divider"></div>
        
        <nav class="dropdown-nav">
          <RouterLink to="/profile" class="dropdown-item" @click="closeDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Mi Cuenta</span>
          </RouterLink>
          
          <RouterLink to="/preferences" class="dropdown-item" @click="closeDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6"></path>
              <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"></path>
              <path d="M1 12h6m6 0h6"></path>
              <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"></path>
            </svg>
            <span>Preferencias</span>
          </RouterLink>
          
          <div class="dropdown-divider"></div>
          
          <button class="dropdown-item dropdown-item-danger" @click="handleLogout" :disabled="authStore.loading">
            <svg v-if="!authStore.loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span class="spinner" v-else></span>
            <span>{{ authStore.loading ? 'Cerrando sesión...' : 'Cerrar Sesión' }}</span>
          </button>
        </nav>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isOpen = ref(false)

const avatarInitial = computed(() => {
  // Prioridad: firstName > name attribute > given_name attribute > email
  const name = authStore.user?.firstName || 
               authStore.user?.attributes?.name || 
               authStore.user?.attributes?.given_name || 
               authStore.user?.email
  return (name?.[0] || 'U').toUpperCase()
})

const displayName = computed(() => {
  // Prioridad: fullName > firstName + lastName > firstName > attributes > email
  if (authStore.user?.fullName) {
    return authStore.user.fullName
  }
  if (authStore.user?.firstName && authStore.user?.lastName) {
    return `${authStore.user.firstName} ${authStore.user.lastName}`
  }
  if (authStore.user?.firstName) {
    return authStore.user.firstName
  }
  if (authStore.user?.attributes?.name) {
    return authStore.user.attributes.name
  }
  if (authStore.user?.attributes?.given_name) {
    return authStore.user.attributes.given_name
  }
  if (authStore.user?.email) {
    const emailPart = authStore.user.email.split('@')[0]
    if (emailPart) {
      // Capitalizar la primera letra
      return emailPart.charAt(0).toUpperCase() + emailPart.slice(1)
    }
  }
  return 'Usuario'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleLogout = async () => {
  const result = await authStore.logout()
  if (result.success) {
    closeDropdown()
    router.push({ name: 'auth' })
  }
}

// Directiva personalizada para cerrar al hacer click fuera
interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

const vClickOutside = {
  mounted(el: ClickOutsideElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}
</script>

<style scoped>
.user-dropdown {
  position: relative;
}

.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.user-dropdown-trigger::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-background-soft);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-dropdown-trigger:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.user-dropdown-trigger:hover::before {
  opacity: 1;
}

.user-dropdown-trigger.is-open {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.user-dropdown-trigger.is-open::before {
  opacity: 1;
}

.user-dropdown-trigger > * {
  position: relative;
  z-index: 1;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
  box-shadow: 0 2px 4px 0 rgba(59, 130, 246, 0.3);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-dropdown-trigger:hover .user-avatar {
  box-shadow: 0 4px 8px 0 rgba(59, 130, 246, 0.4);
  transform: scale(1.05);
}

.user-info-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-info-compact .user-name {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.875rem;
  white-space: nowrap;
}

.chevron {
  transition: transform 0.2s;
  color: var(--color-text);
  opacity: 0.6;
}

.user-dropdown-trigger.is-open .chevron {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 280px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-background-mute);
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name-full {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
}

.dropdown-nav {
  padding: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-background-mute);
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-item:hover:not(:disabled) {
  color: var(--color-heading);
  transform: translateX(4px);
}

.dropdown-item:hover:not(:disabled)::before {
  opacity: 1;
}

.dropdown-item > * {
  position: relative;
  z-index: 1;
}

.dropdown-item svg {
  flex-shrink: 0;
  opacity: 0.7;
}

.dropdown-item-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.dropdown-item-danger:hover:not(:disabled) svg {
  opacity: 1;
}

/* Modo oscuro: botón de peligro más visible */
:root.dark .dropdown-item-danger {
  color: var(--color-text);
}

:root.dark .dropdown-item-danger:hover:not(:disabled) {
  color: #fca5a5;
}

:root.dark .dropdown-item-danger:hover:not(:disabled)::before {
  background: rgba(248, 113, 113, 0.15);
}

.dropdown-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-border);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transición del dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .user-info-compact .user-name {
    display: none;
  }
  
  .user-dropdown-menu {
    right: -1rem;
    min-width: 260px;
  }
}
</style>
