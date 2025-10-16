<template>
  <div class="dashboard-view">
    <div class="container py-lg">
      <!-- Hero Section -->
      <div class="hero">
        <div class="hero-content">
          <h1>Dashboard</h1>
          <p>Bienvenido de nuevo. Aquí tienes un resumen de tu actividad</p>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-icon gradient-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
              </svg>
            </div>
            <div class="hero-stat-content">
              <div class="hero-stat-value">{{ stats.totalApps }}</div>
              <div class="hero-stat-label">Aplicaciones</div>
            </div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-icon gradient-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div class="hero-stat-content">
              <div class="hero-stat-value">{{ stats.activeSubscriptions }}</div>
              <div class="hero-stat-label">Suscripciones Activas</div>
            </div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-icon gradient-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="hero-stat-content">
              <div class="hero-stat-value">{{ stats.totalUsers }}</div>
              <div class="hero-stat-label">Usuarios</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-header">
        <h2>Acciones Rápidas</h2>
        <p>Accede directamente a las secciones principales</p>
      </div>

      <div class="quick-actions-grid">
        <RouterLink to="/marketplace" class="action-card">
          <div class="action-icon gradient-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div class="action-content">
            <h3>Explorar Marketplace</h3>
            <p>Descubre nuevas aplicaciones</p>
          </div>
          <div class="action-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </RouterLink>

        <RouterLink to="/applications" class="action-card">
          <div class="action-icon gradient-green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="14" rx="1"></rect>
              <rect width="7" height="7" x="3" y="14" rx="1"></rect>
            </svg>
          </div>
          <div class="action-content">
            <h3>Mis Aplicaciones</h3>
            <p>Gestiona tus apps instaladas</p>
          </div>
          <div class="action-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </RouterLink>

        <RouterLink to="/users" class="action-card">
          <div class="action-icon gradient-purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="action-content">
            <h3>Gestionar Usuarios</h3>
            <p>Administra tu equipo</p>
          </div>
          <div class="action-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </RouterLink>

        <RouterLink to="/subscriptions" class="action-card">
          <div class="action-icon gradient-orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div class="action-content">
            <h3>Ver Suscripciones</h3>
            <p>Revisa tus planes activos</p>
          </div>
          <div class="action-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </RouterLink>
      </div>

      <!-- Recent Applications Section -->
      <div class="section-header">
        <h2>Aplicaciones Recientes</h2>
        <RouterLink to="/applications" class="section-link">
          Ver todas
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </RouterLink>
      </div>

      <div v-if="recentApps.length > 0" class="apps-grid">
        <div
          v-for="app in recentApps"
          :key="app.id"
          class="card-interactive app-card"
          @click="openApplication(app)"
        >
          <div class="app-card-header">
            <div class="app-icon" :style="getAppLogo(app) ? { background: 'transparent' } : {}">
              <img v-if="getAppLogo(app)" :src="getAppLogo(app)!" :alt="app.name" />
              <span v-else>{{ getAppIcon(app.name) }}</span>
            </div>
          </div>
          <div class="app-content">
            <h3>{{ app.name }}</h3>
            <p class="app-description">{{ app.description || 'Sin descripción disponible' }}</p>
          </div>
          <div class="app-actions" @click.stop>
            <button class="btn-primary btn-sm" @click="openApplication(app)">
              Abrir
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state-compact">
        <p>No tienes aplicaciones recientes</p>
        <RouterLink to="/marketplace" class="btn-secondary btn-sm">
          Explorar Marketplace
        </RouterLink>
      </div>

      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useApplicationsStore } from '@/stores/applications'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/composables/useTheme'
import { useConfirm } from '@/composables/useConfirm'

const applicationsStore = useApplicationsStore()
const usersStore = useUsersStore()
const { applications, marketplaceApps } = storeToRefs(applicationsStore)
const { users } = storeToRefs(usersStore)
const { isDark } = useTheme()
const { confirm } = useConfirm()

// Computed stats
const stats = computed(() => {
  const subscriptions = applications.value
  const nextRenewalDates = subscriptions
    .map(app => new Date(app.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000)
    .filter(date => !isNaN(date))
    .sort((a, b) => a - b)

  const nextRenewal = nextRenewalDates.length > 0 
    ? formatDateShort(new Date(nextRenewalDates[0]!)) 
    : 'N/A'

  return {
    totalApps: applications.value.length,
    activeSubscriptions: subscriptions.length,
    totalUsers: users.value.length,
    appsUsedToday: Math.floor(applications.value.length * 0.6), // Mock: 60% usadas hoy
    activeUsers: Math.floor(users.value.length * 0.8), // Mock: 80% usuarios activos
    nextRenewal,
    availableApps: marketplaceApps.value.length
  }
})

// Recent apps (últimas 3)
const recentApps = computed(() => {
  return [...applications.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
})

// Functions
function getAppLogo(app: any): string | null {
  if (isDark.value && app.logoDark) {
    return app.logoDark
  }
  return app.logo || null
}

function getAppIcon(name: string): string {
  const icons: Record<string, string> = {
    'Due Diligence': '🔍',
    'CRM': '👥',
    'Finance': '💰',
    'Warehouse': '📦',
    'Analytics': '📊',
  }
  
  for (const [key, icon] of Object.entries(icons)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return icon
    }
  }
  
  return '📱'
}

function formatDateShort(date: Date): string {
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Mañana'
  if (diffDays < 7) return `${diffDays} días`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem`
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

async function openApplication(app: any) {
  if (app.url) {
    window.open(app.url, '_blank', 'noopener,noreferrer')
  } else {
    await confirm({
      title: 'URL no configurada',
      message: `La aplicación ${app.name} no tiene una URL configurada`,
      details: 'Por favor, contacta con el administrador para configurarla.',
      type: 'info',
      confirmText: 'Entendido',
      showCancel: false,
    })
  }
}

// Load data on mount
onMounted(async () => {
  try {
    // No usar skipCache - dejar que el sistema de caché decida
    // Si los datos ya están cargados, los usará del caché (0 llamadas API)
    // Si no están cargados, hará las llamadas necesarias
    console.log('📊 Dashboard: Cargando datos...')
    
    await Promise.all([
      applicationsStore.fetchUserApplications(), // Usa caché si es válido
      applicationsStore.fetchAllApplications(), // Usa caché si es válido
      usersStore.fetchUsers() // Usa caché si es válido
    ])
    
    console.log('✅ Dashboard: Datos cargados')
  } catch (err) {
    console.error('❌ Dashboard: Error al cargar datos:', err)
  }
})
</script>

<style scoped>
.dashboard-view {
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  margin-top: 3rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
  letter-spacing: -0.015em;
}

.section-header p {
  font-size: 0.9375rem;
  color: var(--vt-c-text-2);
  margin: 0;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: var(--transition-fast);
}

.section-link:hover {
  gap: 0.5rem;
}

.section-link svg {
  transition: transform 0.2s ease;
}

.section-link:hover svg {
  transform: translateX(2px);
}

/* Quick Actions Grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-hover);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.action-icon svg {
  width: 24px;
  height: 24px;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.action-content h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.action-content p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
}

.action-arrow {
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  transition: var(--transition-fast);
}

.action-card:hover .action-arrow {
  color: var(--color-primary);
  transform: translateX(4px);
}

/* Apps Grid */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.app-card {
  padding: 1.5rem;
}

.app-card .app-content h3 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.app-card .app-description {
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

/* Activity Grid */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Empty State Compact */
.empty-state-compact {
  text-align: center;
  padding: 2rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
}

.empty-state-compact p {
  font-size: 0.9375rem;
  color: var(--vt-c-text-2);
  margin: 0 0 1rem 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .quick-actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .apps-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 2rem;
  }

  .section-header h2 {
    font-size: 1.375rem;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .apps-grid {
    grid-template-columns: 1fr;
  }

  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .section-header h2 {
    font-size: 1.25rem;
  }

  .action-card {
    padding: 1.25rem;
  }

  .action-icon {
    width: 44px;
    height: 44px;
  }

  .action-content h3 {
    font-size: 1rem;
  }

  .action-content p {
    font-size: 0.8125rem;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
