<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import ThemeToggle from '@/components/ThemeToggle.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import logoLight from '@/assets/logo-light.svg'
import logoDark from '@/assets/logo-dark.svg'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const mobileMenuOpen = ref(false)
const applicationsMenuOpen = ref(false)
const teamMenuOpen = ref(false)

const hideNavigation = computed(() => route.meta.hideNavigation === true)
const isAdminOrOwner = computed(() => {
  const role = authStore.user?.role?.toLowerCase()
  return role === 'admin' || role === 'owner'
})

const currentLogo = computed(() => themeStore.effectiveTheme === 'dark' ? logoLight : logoDark)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleApplicationsMenu = () => {
  applicationsMenuOpen.value = !applicationsMenuOpen.value
}

const closeApplicationsMenu = () => {
  applicationsMenuOpen.value = false
}

const toggleTeamMenu = () => {
  teamMenuOpen.value = !teamMenuOpen.value
}

const closeTeamMenu = () => {
  teamMenuOpen.value = false
}
</script>

<template>
  <header v-if="!hideNavigation && authStore.isAuthenticated" class="app-header">
    <div class="header-wrapper">
  <div class="header-content container">
        <!-- Logo -->
        <RouterLink to="/" class="logo" @click="closeMobileMenu">
          <img :alt="'Logo Nima ' + themeStore.effectiveTheme" :src="currentLogo" class="logo-image" />
        </RouterLink>

        <!-- Desktop navigation -->
        <nav class="main-nav desktop-nav">
          <RouterLink to="/" class="nav-link" exact-active-class="router-link-active">
            <span>Dashboard</span>
          </RouterLink>
          <RouterLink to="/marketplace" class="nav-link">
            <span>Descubrir</span>
          </RouterLink>
          
          <!-- Aplicaciones con dropdown -->
          <div class="nav-dropdown" @mouseenter="applicationsMenuOpen = true" @mouseleave="closeApplicationsMenu">
            <button class="nav-link" :class="{ 'is-active': route.path.startsWith('/applications') || route.path.startsWith('/subscriptions') }">
              <span>Aplicaciones</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon" :class="{ 'is-open': applicationsMenuOpen }">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <transition name="dropdown">
              <div v-if="applicationsMenuOpen" class="dropdown-menu">
                <RouterLink to="/applications" class="dropdown-item" @click="closeApplicationsMenu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                  <div class="dropdown-item-content">
                    <span class="dropdown-item-title">Mis Aplicaciones</span>
                    <span class="dropdown-item-subtitle">Apps instaladas</span>
                  </div>
                </RouterLink>
                
                <RouterLink to="/subscriptions" class="dropdown-item" @click="closeApplicationsMenu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <div class="dropdown-item-content">
                    <span class="dropdown-item-title">Suscripciones</span>
                    <span class="dropdown-item-subtitle">Gestiona tus planes</span>
                  </div>
                </RouterLink>
                
                <div class="dropdown-divider"></div>
                
                <RouterLink to="/marketplace" class="dropdown-item" @click="closeApplicationsMenu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <div class="dropdown-item-content">
                    <span class="dropdown-item-title">Explorar Mercado</span>
                    <span class="dropdown-item-subtitle">Descubre nuevas apps</span>
                  </div>
                </RouterLink>
              </div>
            </transition>
          </div>
          
          <!-- Equipo con dropdown (solo para admin/owner) -->
          <div v-if="isAdminOrOwner" class="nav-dropdown" @mouseenter="teamMenuOpen = true" @mouseleave="closeTeamMenu">
            <button class="nav-link" :class="{ 'is-active': route.path.startsWith('/users') || route.path.startsWith('/account') }">
              <span>Organización</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon" :class="{ 'is-open': teamMenuOpen }">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <transition name="dropdown">
              <div v-if="teamMenuOpen" class="dropdown-menu">
                <RouterLink to="/users" class="dropdown-item" @click="closeTeamMenu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <div class="dropdown-item-content">
                    <span class="dropdown-item-title">Miembros del Equipo</span>
                    <span class="dropdown-item-subtitle">Gestiona usuarios y permisos</span>
                  </div>
                </RouterLink>
                
                <RouterLink to="/account" class="dropdown-item" @click="closeTeamMenu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="14" x2="23" y2="14"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="14" x2="4" y2="14"></line>
                  </svg>
                  <div class="dropdown-item-content">
                    <span class="dropdown-item-title">Configuración de Empresa</span>
                    <span class="dropdown-item-subtitle">Datos y ajustes de la organización</span>
                  </div>
                </RouterLink>
              </div>
            </transition>
          </div>
        </nav>

        <!-- Right side actions -->
        <div class="header-actions">
          <!-- Desktop menu -->
          <div class="desktop-menu">
            <ThemeToggle />
            <div class="divider"></div>
            <UserDropdown />
          </div>

          <!-- Mobile menu button -->
          <button 
            class="mobile-menu-button" 
            @click="toggleMobileMenu" 
            :class="{ 'is-open': mobileMenuOpen }"
            aria-label="Toggle menu"
          >
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile navigation overlay -->
      <transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="mobile-nav-overlay" @click="closeMobileMenu">
          <nav class="mobile-nav" @click.stop>
            <div class="mobile-nav-header">
              <span class="mobile-nav-title">Navegación</span>
              <button class="close-button" @click="closeMobileMenu" aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="mobile-nav-content">
              <RouterLink to="/" class="mobile-nav-link" exact-active-class="router-link-active" @click="closeMobileMenu">
                <div class="mobile-nav-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <div class="mobile-nav-link-content">
                  <span class="mobile-nav-link-title">Dashboard</span>
                  <span class="mobile-nav-link-subtitle">Vista general</span>
                </div>
                <svg class="mobile-nav-link-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </RouterLink>

              <RouterLink to="/marketplace" class="mobile-nav-link" @click="closeMobileMenu">
                <div class="mobile-nav-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <div class="mobile-nav-link-content">
                  <span class="mobile-nav-link-title">Descubrir</span>
                  <span class="mobile-nav-link-subtitle">Explora el mercado</span>
                </div>
                <svg class="mobile-nav-link-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </RouterLink>

              <!-- Applications Section -->
              <div class="mobile-nav-section">
                <div class="mobile-nav-section-header" @click="applicationsMenuOpen = !applicationsMenuOpen">
                  <div class="mobile-nav-section-header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                  </div>
                  <span class="mobile-nav-section-title">Aplicaciones</span>
                  <svg class="mobile-nav-section-arrow" :class="{ 'is-open': applicationsMenuOpen }" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                
                <transition name="mobile-dropdown">
                  <div v-if="applicationsMenuOpen" class="mobile-nav-section-items">
                    <RouterLink to="/applications" class="mobile-nav-sub-link" @click="closeMobileMenu">
                      <div class="mobile-nav-sub-link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                      </div>
                      <span class="mobile-nav-sub-link-title">Mis Aplicaciones</span>
                    </RouterLink>
                    
                    <RouterLink to="/subscriptions" class="mobile-nav-sub-link" @click="closeMobileMenu">
                      <div class="mobile-nav-sub-link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                      </div>
                      <span class="mobile-nav-sub-link-title">Suscripciones</span>
                    </RouterLink>
                  </div>
                </transition>
              </div>

              <!-- Organización Section (solo para admin/owner) -->
              <div v-if="isAdminOrOwner" class="mobile-nav-section">
                <div class="mobile-nav-section-header" @click="teamMenuOpen = !teamMenuOpen">
                  <div class="mobile-nav-section-header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                      <rect x="9" y="9" width="6" height="6"></rect>
                      <line x1="9" y1="1" x2="9" y2="4"></line>
                      <line x1="15" y1="1" x2="15" y2="4"></line>
                      <line x1="9" y1="20" x2="9" y2="23"></line>
                      <line x1="15" y1="20" x2="15" y2="23"></line>
                      <line x1="20" y1="9" x2="23" y2="9"></line>
                      <line x1="20" y1="14" x2="23" y2="14"></line>
                      <line x1="1" y1="9" x2="4" y2="9"></line>
                      <line x1="1" y1="14" x2="4" y2="14"></line>
                    </svg>
                  </div>
                  <span class="mobile-nav-section-title">Organización</span>
                  <svg class="mobile-nav-section-arrow" :class="{ 'is-open': teamMenuOpen }" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                
                <transition name="mobile-dropdown">
                  <div v-if="teamMenuOpen" class="mobile-nav-section-items">
                    <RouterLink to="/users" class="mobile-nav-sub-link" @click="closeMobileMenu">
                      <div class="mobile-nav-sub-link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <span class="mobile-nav-sub-link-title">Miembros del Equipo</span>
                    </RouterLink>
                    
                    <RouterLink to="/account" class="mobile-nav-sub-link" @click="closeMobileMenu">
                      <div class="mobile-nav-sub-link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                          <rect x="9" y="9" width="6" height="6"></rect>
                          <line x1="9" y1="1" x2="9" y2="4"></line>
                          <line x1="15" y1="1" x2="15" y2="4"></line>
                          <line x1="9" y1="20" x2="9" y2="23"></line>
                          <line x1="15" y1="20" x2="15" y2="23"></line>
                          <line x1="20" y1="9" x2="23" y2="9"></line>
                          <line x1="20" y1="14" x2="23" y2="14"></line>
                          <line x1="1" y1="9" x2="4" y2="9"></line>
                          <line x1="1" y1="14" x2="4" y2="14"></line>
                        </svg>
                      </div>
                      <span class="mobile-nav-sub-link-title">Config. Empresa</span>
                    </RouterLink>
                  </div>
                </transition>
              </div>
            </div>

            <div class="mobile-nav-footer">
              <div class="mobile-nav-footer-item">
                <span class="mobile-nav-footer-label">Tema</span>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      </transition>
    </div>
  </header>
</template>

<style scoped>
/* Importo los estilos desde App.vue tal cual para mantener consistencia */
/* Copiamos exactamente la sección de estilos del header de App.vue */
/* ============================================
   HEADER - FIXED & COMPACT
   ============================================ */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.header-wrapper {
  width: 100%;
}

.header-content {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* ============================================
   LOGO
   ============================================ */
.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
  transition: opacity 0.2s ease;
  padding: 0 !important; /* evita padding global de anchors */
}

.logo::after { content: none !important; } /* anula subrayado solo en el logo, no afecta a nav links */

.logo:hover {
  opacity: 1; /* sin cambio visual de opacidad */
  background: transparent !important; /* evita fondo global en hover */
}

.logo-image {
  height: 36px;
  width: auto;
  display: block;
}

/* ============================================
   DESKTOP NAVIGATION
   ============================================ */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  margin: 0 1rem;
}

.desktop-nav .nav-link {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.625rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Anula subrayados globales dentro del navbar */
.desktop-nav .nav-link::after {
  content: '' !important;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
}

.desktop-nav .nav-link:hover {
  color: var(--color-heading);
  background: var(--color-background-mute);
}

.desktop-nav .nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.desktop-nav .nav-link.router-link-exact-active {
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
  font-weight: 600;
}

.desktop-nav .nav-link.router-link-exact-active::after {
  transform: scaleX(1);
  transform-origin: center;
}

.desktop-nav .nav-link.router-link-exact-active:hover {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-primary);
}

/* ============================================
   DROPDOWN MENU
   ============================================ */
.nav-dropdown {
  position: relative;
  display: flex;
  align-items: center;
}

.nav-dropdown .nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: inherit;
}

.nav-dropdown .nav-link.is-active {
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
  font-weight: 600;
}

.nav-dropdown .nav-link.is-active::after {
  transform: scaleX(1);
  transform-origin: center;
}

.dropdown-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-icon.is-open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 280px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1),
              0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--color-background-mute);
  color: var(--color-primary);
}

.dropdown-item svg {
  flex-shrink: 0;
  color: var(--vt-c-text-2);
  transition: color 0.2s ease;
}

.dropdown-item:hover svg {
  color: var(--color-primary);
}

.dropdown-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.dropdown-item-title {
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.3;
}

.dropdown-item-subtitle {
  font-size: 0.8125rem;
  color: var(--vt-c-text-2);
  line-height: 1.3;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0.5rem 0;
}

/* Dropdown transitions */
.dropdown-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ============================================
   HEADER ACTIONS (RIGHT SIDE)
   ============================================ */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.desktop-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
}

/* ============================================
   MOBILE MENU BUTTON (HAMBURGER)
   ============================================ */
.mobile-menu-button {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-menu-button:hover {
  background: var(--color-background-mute);
  border-color: var(--color-primary);
}

.mobile-menu-button:active {
  transform: scale(0.95);
}

/* Hamburger icon animation */
.hamburger-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20px;
  height: 16px;
  position: relative;
}

.hamburger-icon span {
  display: block;
  height: 2px;
  width: 100%;
  background: currentColor;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}

.hamburger-icon span:nth-child(1) {
  top: 0;
}

.hamburger-icon span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger-icon span:nth-child(3) {
  bottom: 0;
}

.mobile-menu-button.is-open .hamburger-icon span:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.mobile-menu-button.is-open .hamburger-icon span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-button.is-open .hamburger-icon span:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
}

/* ============================================
   MOBILE NAVIGATION OVERLAY
   ============================================ */
.mobile-nav-overlay {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
}

.mobile-nav {
  width: 100%;
  max-width: 380px;
  height: 100%;
  background: var(--color-background);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Mobile nav header */
.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.mobile-nav-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--color-background-mute);
  color: var(--color-heading);
}

/* Mobile nav content */
.mobile-nav-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  -webkit-overflow-scrolling: touch;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.mobile-nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.mobile-nav-link:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.mobile-nav-link.router-link-exact-active {
  background: rgba(59, 130, 246, 0.08);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.mobile-nav-link.router-link-exact-active::before {
  opacity: 0.03;
}

.mobile-nav-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover .mobile-nav-link-icon {
  background: var(--color-background-mute);
  border-color: var(--color-primary);
}

.mobile-nav-link.router-link-exact-active .mobile-nav-link-icon {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--color-primary);
}

.mobile-nav-link-icon svg {
  color: var(--color-text);
  transition: color 0.2s ease;
}

.mobile-nav-link.router-link-exact-active .mobile-nav-link-icon svg {
  color: var(--color-primary);
}

.mobile-nav-link-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  z-index: 1;
}

.mobile-nav-link-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.2;
}

.mobile-nav-link-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.2;
}

.mobile-nav-link.router-link-exact-active .mobile-nav-link-title {
  color: var(--color-primary);
}

.mobile-nav-link-arrow {
  flex-shrink: 0;
  color: var(--color-text-muted);
  opacity: 0.5;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.mobile-nav-link:hover .mobile-nav-link-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.mobile-nav-link.router-link-exact-active .mobile-nav-link-arrow {
  color: var(--color-primary);
  opacity: 1;
}

/* Mobile nav section (for expandable sections like Applications) */
.mobile-nav-section {
  margin-bottom: 0.5rem;
}

.mobile-nav-section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-nav-section-header:hover {
  border-color: var(--color-primary);
  background: var(--color-background-mute);
}

.mobile-nav-section-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.mobile-nav-section-header:hover .mobile-nav-section-header-icon {
  background: var(--color-background-mute);
  border-color: var(--color-primary);
}

.mobile-nav-section-title {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-heading);
}

.mobile-nav-section-arrow {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-nav-section-arrow.is-open {
  transform: rotate(180deg);
  color: var(--color-primary);
}

.mobile-nav-section-items {
  padding: 0.5rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-sub-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem 0.875rem 1.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 1rem;
}

.mobile-nav-sub-link:hover {
  background: var(--color-background-soft);
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.mobile-nav-sub-link.router-link-exact-active {
  background: rgba(59, 130, 246, 0.08);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.mobile-nav-sub-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.mobile-nav-sub-link:hover .mobile-nav-sub-link-icon {
  border-color: var(--color-primary);
}

.mobile-nav-sub-link.router-link-exact-active .mobile-nav-sub-link-icon {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--color-primary);
}

.mobile-nav-sub-link-icon svg {
  color: var(--color-text);
  transition: color 0.2s ease;
}

.mobile-nav-sub-link.router-link-exact-active .mobile-nav-sub-link-icon svg {
  color: var(--color-primary);
}

.mobile-nav-sub-link-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-heading);
}

.mobile-nav-sub-link.router-link-exact-active .mobile-nav-sub-link-title {
  color: var(--color-primary);
  font-weight: 600;
}

/* Mobile dropdown transition */
.mobile-dropdown-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-dropdown-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.mobile-dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}

.mobile-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  max-height: 0;
}

/* Mobile nav footer */
.mobile-nav-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-background-soft);
  flex-shrink: 0;
}

.mobile-nav-footer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.mobile-nav-footer-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-heading);
}

/* ============================================
   MOBILE MENU TRANSITIONS
   ============================================ */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-active .mobile-nav,
.mobile-menu-leave-active .mobile-nav {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from .mobile-nav,
.mobile-menu-leave-to .mobile-nav {
  transform: translateX(100%);
}

/* Responsive paddings for header-content and overlay alignment */
@media (max-width: 1023px) {
  .header-content { gap: 1rem; }
}

@media (max-width: 767px) {
  .header-content { height: 56px; }
  .mobile-nav-overlay { top: 56px; }
}

@media (max-width: 480px) {
  .header-content { height: 52px; }
  .mobile-nav-overlay { top: 52px; }
}

/* Safe area insets for notched devices */
/* Safe-area paddings handled globally by container.css */
</style>
