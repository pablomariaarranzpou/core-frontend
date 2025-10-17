<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/composables/useTheme'
import { useConfirm } from '@/composables/useConfirm'

const applicationsStore = useApplicationsStore()
const { marketplaceApps, loading, error } = storeToRefs(applicationsStore)
const { isDark } = useTheme()
const { confirm } = useConfirm()

const searchQuery = ref('')

// Computed properties
const filteredApps = computed(() => {
  return marketplaceApps.value.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (app.description && app.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    return matchesSearch
  })
})

const installedCount = computed(() => {
  // Aquí podrías verificar qué apps están instaladas comparando con applications del usuario
  return 0
})

// Función para obtener el logo correcto según el tema
function getAppLogo(app: any): string | null {
  if (isDark.value && app.logoDark) {
    return app.logoDark
  }
  return app.logo || null
}

// Functions
async function loadMarketplaceApps() {
  try {
    await applicationsStore.fetchAllApplications()
  } catch (err) {
    console.error('Error al cargar aplicaciones del marketplace:', err)
  }
}

async function installApp(appId: string) {
  // TODO: Implementar cuando exista el endpoint de suscripciones
  await confirm({
    title: 'Función en desarrollo',
    message: 'La instalación de aplicaciones estará disponible próximamente',
    details: 'Esta funcionalidad se está implementando en el backend.',
    type: 'info',
    confirmText: 'Entendido',
    showCancel: false,
  })
}

async function uninstallApp(appId: string) {
  // TODO: Implementar cuando exista el endpoint de suscripciones
  await confirm({
    title: 'Función en desarrollo',
    message: 'La desinstalación de aplicaciones estará disponible próximamente',
    details: 'Esta funcionalidad se está implementando en el backend.',
    type: 'info',
    confirmText: 'Entendido',
    showCancel: false,
  })
}

function clearSearch() {
  searchQuery.value = ''
}

function clearFilters() {
  searchQuery.value = ''
}

function viewApplicationDetails(appId: string) {
  // Navegar a la vista de detalles de la aplicación
  window.location.href = `/applications/${appId}`
}

function formatInstalls(installs: number): string {
  if (installs >= 1000) {
    return `${(installs / 1000).toFixed(1)}k`
  }
  return installs.toString()
}

function getAppIcon(name: string): string {
  // Generar un icono basado en el nombre de la app
  const icons: Record<string, string> = {
    'Due Diligence': '🔍',
    'CRM': '👥',
    'Finance': '💰',
    'Warehouse': '📦',
    'Analytics': '📊',
  }
  
  // Buscar por palabra clave en el nombre
  for (const [key, icon] of Object.entries(icons)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return icon
    }
  }
  
  return '📱'
}

async function fetchApplicationById(id: string) {
  try {
    await applicationsStore.fetchApplicationById(id)
    const app = applicationsStore.currentApplication
    if (app) {
      await confirm({
        title: app.name,
        message: app.description || 'Ver detalles de la aplicación',
        type: 'info',
        confirmText: 'Entendido',
        showCancel: false,
      })
    }
  } catch (err) {
    console.error('Error al cargar detalles:', err)
  }
}

// Cargar aplicaciones al montar el componente
onMounted(() => {
  loadMarketplaceApps()
})
</script>

<template>
  <div class="marketplace-view">
    <div class="container py-lg">
      <!-- Hero Section -->
      <div class="hero">
        <div class="hero-content">
          <h1>Mercado de Aplicaciones</h1>
          <p>Descubre y añade nuevas funcionalidades para potenciar tu negocio</p>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-icon gradient-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <rect x="7" y="7" width="10" height="10" rx="1" ry="1"></rect>
              </svg>
            </div>
            <div class="hero-stat-content">
              <div class="hero-stat-value">{{ marketplaceApps.length }}</div>
              <div class="hero-stat-label">Apps Disponibles</div>
            </div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-icon gradient-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="hero-stat-content">
              <div class="hero-stat-value">{{ installedCount }}</div>
              <div class="hero-stat-label">Apps Instaladas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando aplicaciones...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadMarketplaceApps" class="btn-primary">Reintentar</button>
      </div>

      <!-- Filters Section -->
      <div v-else class="filters-section">
        <div class="search-container">
          <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar aplicaciones..."
            class="input input-search"
          />
          <div v-if="searchQuery" class="search-clear" @click="clearSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && !error" class="results-info">
        <p>
          Mostrando <strong>{{ filteredApps.length }}</strong> 
          {{ filteredApps.length === 1 ? 'aplicación' : 'aplicaciones' }}
        </p>
      </div>

      <!-- Apps Grid -->
      <div v-if="filteredApps.length > 0" class="app-grid">
        <div 
          v-for="app in filteredApps" 
          :key="app.id" 
          class="card-interactive"
          @click="viewApplicationDetails(app.id)"
        >
          <div class="app-card-header">
            <div class="app-icon" :style="getAppLogo(app) ? { background: 'transparent' } : {}">
              <img v-if="getAppLogo(app)" :src="getAppLogo(app)!" :alt="app.name" />
              <span v-else>{{ getAppIcon(app.name) }}</span>
            </div>
          </div>

          <div class="app-content">
            <div class="app-title-row">
              <h3>{{ app.name }}</h3>
            </div>
            
            <p class="app-description">{{ app.description || 'Sin descripción disponible' }}</p>
            
            <div class="app-meta">
              <div class="app-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{{ new Date(app.createdAt).toLocaleDateString('es-ES') }}</span>
              </div>
              <div class="app-meta-item price free">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Disponible</span>
              </div>
            </div>
          </div>

          <div class="app-actions" @click.stop>
            <button
              class="btn-primary"
              @click="viewApplicationDetails(app.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Ver Detalles
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !error && filteredApps.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 class="empty-title">No se encontraron aplicaciones</h3>
        <p class="empty-description">Intenta ajustar tu búsqueda o filtros</p>
        <button class="btn-primary" @click="clearFilters">
          Limpiar Filtros
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marketplace-view {
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
}

/* View-specific responsive adjustments for categories scrolling on mobile */
@media (max-width: 767px) {
  .filters-categories {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .filters-categories::-webkit-scrollbar {
    height: 4px;
  }

  .filters-categories::-webkit-scrollbar-track {
    background: var(--color-background-mute);
    border-radius: 2px;
  }

  .filters-categories::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 2px;
  }
}

@media (max-width: 1200px) {
  .app-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
}

@media (max-width: 1023px) {
  .app-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 767px) {
  .app-grid {
    grid-template-columns: 1fr;
  }

  .app-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .app-content {
    gap: 0.875rem;
  }

  .app-title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .app-meta {
    gap: 1rem;
  }
}

/* Touch device: prevent hover scaling on touch devices */
@media (hover: none) and (pointer: coarse) {
  .category-btn {
    min-height: 44px;
  }
}
</style>
