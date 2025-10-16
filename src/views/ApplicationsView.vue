<template>
  <div class="applications-view">
    <div class="container py-lg">
      <!-- Header Section -->
      <div class="hero">
        <div class="hero-content">
          <h1>Mis Aplicaciones</h1>
          <p>Accede a todas las aplicaciones disponibles para ti</p>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-icon gradient-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <div class="hero-stat-content">
              <div class="hero-stat-value">{{ activeAppsCount }}</div>
              <div class="hero-stat-label">Aplicaciones Suscritas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Applications Grid -->
      <div class="section-header">
        <h2 class="section-title">
          Mis Aplicaciones Suscritas
          <span v-if="searchQuery && filteredApplications.length > 0" class="results-count">
            ({{ filteredApplications.length }} de {{ applications.length }})
          </span>
        </h2>
        <div class="header-actions">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar aplicaciones..."
              class="search-input"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="clear-search"
              aria-label="Limpiar búsqueda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="view-controls">
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              aria-label="Vista de cuadrícula"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button 
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
              aria-label="Vista de lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state" style="text-align: center; padding: 2rem;">
        <p>Cargando aplicaciones...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state" style="text-align: center; padding: 2rem;">
        <p style="color: #ef4444;">{{ error }}</p>
        <button @click="loadUserSubscriptions" class="btn-primary" style="margin-top: 1rem;">Reintentar</button>
      </div>

      <!-- Empty State -->
      <div v-if="applications.length === 0 && !loading" class="empty-state">
        <div class="empty-state-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <h3>No tienes acceso a ninguna aplicación</h3>
        <p>Para acceder a una aplicación, necesitas una suscripción activa.</p>
        <div class="empty-state-info">
          <p><strong>Si eres administrador:</strong> Suscríbete a aplicaciones desde el Marketplace y gestiona los accesos en Suscripciones.</p>
          <p><strong>Si no eres administrador:</strong> Contacta con un administrador de tu organización para que te dé acceso.</p>
        </div>
        <button class="btn-primary" @click="$router.push('/marketplace')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            <path d="M2 12h20"></path>
          </svg>
          Explorar Marketplace
        </button>
      </div>

      <!-- No Results State (cuando hay búsqueda sin resultados) -->
      <div v-else-if="filteredApplications.length === 0 && searchQuery" class="no-results-state">
        <div class="no-results-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <h3>No se encontraron aplicaciones</h3>
        <p>No hay aplicaciones que coincidan con "<strong>{{ searchQuery }}</strong>"</p>
        <button class="btn-secondary" @click="searchQuery = ''">
          Limpiar búsqueda
        </button>
      </div>

      <!-- Applications Grid -->
      <div v-else>
        <!-- Vista de Cuadrícula -->
        <div v-if="viewMode === 'grid'" class="applications-grid">
          <div v-for="(app, index) in filteredApplications" :key="app.id" class="app-card">
            <div class="app-card-header">
              <div class="app-icon" :style="getAppLogo(app) ? { background: 'transparent' } : { background: getAppColor(index) }">
                <img v-if="getAppLogo(app)" :src="getAppLogo(app)!" :alt="app.name" />
                <span v-else>{{ getAppInitials(app.name) }}</span>
              </div>
              <div class="app-status">
                <span class="status-dot status-active"></span>
                Suscrito
              </div>
            </div>
            
            <div class="app-body">
              <h3 class="app-name">{{ app.name }}</h3>
              <p class="app-description">{{ app.description || 'Sin descripción' }}</p>
              
              <div class="app-stats">
                <div class="app-stat" v-if="app.createdAt">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{{ new Date(app.createdAt).toLocaleDateString('es-ES') }}</span>
                </div>
              </div>
            </div>
            
            <div class="app-actions">
              <button class="btn-action btn-action-primary" @click="openApplication(app)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Abrir
              </button>
              <button class="btn-action" @click="viewDetails(app)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Detalles
              </button>
            </div>
          </div>
        </div>

        <!-- Vista de Tabla/Lista -->
        <div v-else class="applications-table">
          <div class="table-header">
            <div class="table-col col-app">Aplicación</div>
            <div class="table-col col-description">Descripción</div>
            <div class="table-col col-status">Estado</div>
            <div class="table-col col-date">Fecha de Suscripción</div>
            <div class="table-col col-actions">Acciones</div>
          </div>
          
          <div class="table-body">
            <div v-for="(app, index) in filteredApplications" :key="app.id" class="table-row" @click="viewDetails(app)">
              <div class="table-col col-app">
                <div class="app-info-inline">
                  <div class="app-icon-small" :style="getAppLogo(app) ? { background: 'transparent' } : { background: getAppColor(index) }">
                    <img v-if="getAppLogo(app)" :src="getAppLogo(app)!" :alt="app.name" />
                    <span v-else>{{ getAppInitials(app.name) }}</span>
                  </div>
                  <div class="app-name-inline">{{ app.name }}</div>
                </div>
              </div>
              <div class="table-col col-description">
                <span class="description-text">{{ app.description || 'Sin descripción' }}</span>
              </div>
              <div class="table-col col-status">
                <span class="status-badge status-active">
                  <span class="status-dot"></span>
                  Suscrito
                </span>
              </div>
              <div class="table-col col-date">
                <span class="date-text">{{ app.createdAt ? new Date(app.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A' }}</span>
              </div>
              <div class="table-col col-actions">
                <div class="table-actions" @click.stop>
                  <button class="btn-table-action btn-primary-action" @click="openApplication(app)" title="Abrir aplicación">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Abrir
                  </button>
                  <button class="btn-table-action" @click="viewDetails(app)" title="Ver detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marketplace Section -->
      <div class="marketplace-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Explorar Marketplace</h2>
            <p class="section-subtitle">Descubre nuevas aplicaciones para potenciar tu negocio</p>
          </div>
          <button class="btn-secondary" @click="$router.push('/marketplace')">Ver Todas</button>
        </div>

        <!-- Marketplace Loading -->
        <div v-if="loadingMarketplace" class="marketplace-loading">
          <p>Cargando aplicaciones del marketplace...</p>
        </div>

        <!-- Marketplace Error -->
        <div v-else-if="marketplaceError" class="marketplace-empty marketplace-error">
          <p style="color: #ef4444;">{{ marketplaceError }}</p>
          <button class="btn-secondary" @click="loadMarketplaceApps(true)">Reintentar</button>
        </div>

        <!-- Marketplace Empty -->
        <div v-else-if="marketplaceApps.length === 0" class="marketplace-empty">
          <p>No hay aplicaciones disponibles en el marketplace en este momento.</p>
          <button class="btn-secondary" @click="loadMarketplaceApps(true)">Reintentar</button>
        </div>

        <!-- Marketplace Grid -->
        <div v-else class="marketplace-grid">
          <div v-for="(app, index) in marketplaceApps.slice(0, 3)" :key="app.id" class="marketplace-card">
            <div class="marketplace-card-badge">Disponible</div>
            <div class="app-icon" :style="getAppLogo(app) ? { background: 'transparent' } : { background: getAppColor(index + 10) }">
              <img v-if="getAppLogo(app)" :src="getAppLogo(app)!" :alt="app.name" />
              <span v-else>{{ getAppInitials(app.name) }}</span>
            </div>
            <h4 class="marketplace-app-name">{{ app.name }}</h4>
            <p class="marketplace-app-description">{{ app.description || 'Sin descripción' }}</p>
            
            <div class="marketplace-app-meta">
              <div class="rating">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>4.8</span>
              </div>
              <span class="installs">Nuevo</span>
            </div>
            
            <button class="btn-install" @click="viewDetails(app)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicationsStore } from '@/stores/applications'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/composables/useTheme'
import { useConfirm } from '@/composables/useConfirm'

const router = useRouter()
const applicationsStore = useApplicationsStore()
const subscriptionsStore = useSubscriptionsStore()
const { marketplaceApps, loadingMarketplace } = storeToRefs(applicationsStore)
const { isDark } = useTheme()
const { confirm } = useConfirm()

// Usar estado del store directamente
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const marketplaceError = ref('')

// Computed para las aplicaciones del usuario - ahora desde el store
const applications = computed(() => {
  // El store guarda las aplicaciones en userSubscriptions después de fetchUserApplications
  return applicationsStore.applications || []
})

// Computed para filtrar aplicaciones según la búsqueda
const filteredApplications = computed(() => {
  if (!searchQuery.value.trim()) {
    return applications.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return applications.value.filter(app => {
    const searchableText = [
      app.name,
      app.description,
      app.slug
    ].filter(Boolean).join(' ').toLowerCase()
    
    return searchableText.includes(query)
  })
})

const activeAppsCount = computed(() => applications.value.length)

// Función para obtener el logo correcto según el tema
function getAppLogo(app: any): string | null {
  if (isDark.value && app.logoDark) {
    return app.logoDark
  }
  return app.logo || null
}

async function loadUserSubscriptions() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔄 ApplicationsView: Cargando aplicaciones del usuario...')
    // Usar el store - respeta el caché automáticamente
    await applicationsStore.fetchUserApplications()
    console.log('✅ ApplicationsView: Aplicaciones cargadas:', applications.value.length)
  } catch (err: any) {
    console.error('❌ ApplicationsView: Error al cargar aplicaciones:', err)
    error.value = err.message || 'Error al cargar aplicaciones'
  } finally {
    loading.value = false
  }
}

async function loadMarketplaceApps(forceRefresh = false) {
  marketplaceError.value = ''
  
  try {
    console.log('🔄 ApplicationsView: Cargando marketplace...', forceRefresh ? '(forzando recarga)' : '')
    // Si forceRefresh es true, salta el caché
    await applicationsStore.fetchAllApplications(forceRefresh)
    console.log('✅ ApplicationsView: Marketplace cargado:', marketplaceApps.value.length, 'aplicaciones')
  } catch (err: any) {
    console.error('❌ ApplicationsView: Error al cargar marketplace:', err)
    marketplaceError.value = err.message || 'Error al cargar el marketplace'
  }
}

const openApplication = async (app: any) => {
  if (app.url) {
    window.open(app.url, '_blank')
  } else {
    await confirm({
      title: 'Aplicación no disponible',
      message: `${app.name} no tiene una URL configurada`,
      details: 'Por favor, contacta con el administrador.',
      type: 'info',
      confirmText: 'Entendido',
      showCancel: false,
    })
  }
}

const viewDetails = (app: any) => {
  // Navegar a la vista de detalles de la aplicación
  router.push(`/applications/${app.id}`)
}

function getAppColor(index: number): string {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4']
  return colors[index % colors.length] || '#3b82f6'
}

function getAppInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Cargar datos al montar
onMounted(() => {
  loadUserSubscriptions()
  loadMarketplaceApps()
})
</script>

<style scoped>
.applications-view {
  width: 100%;
  min-height: 100%;
  background: var(--color-background);
}

/* ============================================
   SECTION HEADERS
   ============================================ */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-count {
  font-size: 1rem;
  font-weight: 500;
  color: var(--vt-c-text-2);
}

.section-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.9375rem;
  color: var(--vt-c-text-2);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 320px;
  width: 100%;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  color: var(--vt-c-text-2);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.75rem 0.625rem 2.75rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: var(--vt-c-text-2);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-background);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--vt-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: var(--color-background-mute);
  color: var(--color-heading);
}

.view-controls {
  display: flex;
  gap: 0.5rem;
  background: var(--color-background-soft);
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--vt-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  color: var(--color-heading);
  background: var(--color-background-mute);
}

.view-btn.active {
  color: var(--color-primary);
  background: var(--color-background);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ============================================
   APPLICATIONS GRID
   ============================================ */
.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.app-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: var(--color-border-hover);
}

.app-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.app-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.app-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.app-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--vt-c-text-2);
  background: var(--color-background);
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  border: 1px solid var(--color-border);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.status-inactive {
  background: #ef4444;
}

.app-body {
  flex: 1;
  margin-bottom: 1.25rem;
}

.app-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.3;
  letter-spacing: -0.015em;
}

.app-description {
  margin: 0 0 1rem 0;
  color: var(--vt-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.app-stats {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.app-stat {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
}

.app-stat svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.app-actions {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

/* ============================================
   TABLE VIEW
   ============================================ */
.applications-table {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 3rem;
}

.table-header {
  display: grid;
  grid-template-columns: 2.5fr 3fr 1.2fr 1.5fr 1.8fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--color-background-mute);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vt-c-text-2);
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 2.5fr 3fr 1.2fr 1.5fr 1.8fr;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.2s ease;
  cursor: pointer;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--color-background-mute);
}

.table-col {
  display: flex;
  align-items: center;
}

/* Columna de Aplicación */
.col-app {
  min-width: 0;
}

.app-info-inline {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
}

.app-icon-small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.app-icon-small img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.app-name-inline {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-heading);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Columna de Descripción */
.col-description {
  min-width: 0;
}

.description-text {
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Columna de Estado */
.col-status {
  justify-content: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid;
}

.status-badge.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.2);
}

/* Columna de Fecha */
.col-date {
  justify-content: center;
}

.date-text {
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
}

/* Columna de Acciones */
.col-actions {
  justify-content: flex-end;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-table-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-table-action:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.btn-table-action.btn-primary-action {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-table-action.btn-primary-action:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-table-action svg {
  flex-shrink: 0;
}

/* Botón de solo icono en acciones */
.btn-table-action:not(.btn-primary-action) {
  padding: 0.5rem;
}

.btn-table-action:not(.btn-primary-action) svg {
  margin: 0;
}

.btn-table-action:not(.btn-primary-action) {
  gap: 0;
}

/* ============================================
   MARKETPLACE SECTION
   ============================================ */
.marketplace-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--color-border);
}

.marketplace-loading,
.marketplace-empty {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.marketplace-error p {
  color: #ef4444;
}

.marketplace-loading p,
.marketplace-empty p {
  margin: 0 0 1.5rem 0;
  color: var(--vt-c-text-2);
  font-size: 1rem;
}

.marketplace-empty button {
  margin-top: 0.5rem;
}

.marketplace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.marketplace-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem 1.75rem;
  text-align: center;
  position: relative;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.marketplace-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--color-border-hover);
}

.marketplace-card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.marketplace-card .app-icon {
  margin-bottom: 1.25rem;
}

.marketplace-app-name {
  margin: 0 0 0.625rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
  letter-spacing: -0.015em;
}

.marketplace-app-description {
  margin: 0 0 1.25rem 0;
  color: var(--vt-c-text-2);
  font-size: 0.875rem;
  line-height: 1.5;
  flex: 1;
}

.marketplace-app-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #f59e0b;
  font-weight: 600;
}

.installs {
  color: var(--vt-c-text-2);
}

/* ============================================
   BUTTONS
   ============================================ */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: var(--color-background-soft);
  color: var(--color-heading);
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.btn-action {
  flex: 1;
  background: var(--color-background);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-action:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.btn-action-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.15);
}

.btn-action-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

.btn-install {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.15);
}

.btn-install:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 3rem;
  text-align: center;
  background: var(--color-background-soft);
  border: 2px dashed var(--color-border);
  border-radius: 24px;
  margin-bottom: 3rem;
}

.empty-state-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-mute);
  border-radius: 50%;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  border: 3px dashed var(--color-border);
}

.empty-state h3 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 1rem 0;
}

.empty-state > p {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin: 0 0 2rem 0;
  max-width: 600px;
}

/* ============================================
   NO RESULTS STATE
   ============================================ */
.no-results-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  margin-bottom: 3rem;
}

.no-results-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-mute);
  border-radius: 50%;
  color: var(--vt-c-text-2);
  margin-bottom: 1.5rem;
  border: 2px solid var(--color-border);
}

.no-results-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 0.75rem 0;
}

.no-results-state p {
  font-size: 1rem;
  color: var(--vt-c-text-2);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  max-width: 500px;
}

.no-results-state p strong {
  color: var(--color-heading);
  font-weight: 600;
}

.no-results-state .btn-secondary {
  margin-top: 0.5rem;
}

.empty-state-info {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  max-width: 700px;
  width: 100%;
}

.empty-state-info p {
  font-size: 1rem;
  color: var(--vt-c-text-1);
  line-height: 1.8;
  margin: 0 0 1rem 0;
  text-align: left;
}

.empty-state-info p:last-child {
  margin-bottom: 0;
}

.empty-state-info strong {
  color: var(--color-heading);
  font-weight: 600;
}

.empty-state .btn-primary {
  min-width: 220px;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.empty-state .btn-primary svg {
  flex-shrink: 0;
}

.empty-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-mute);
  border-radius: 50%;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
  border: 3px dashed var(--color-border);
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 1rem 0;
}

.empty-description {
  font-size: 1.0625rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin: 0 0 2rem 0;
  max-width: 500px;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1023px) {
  .applications-grid {
    grid-template-columns: 1fr;
  }
  
  .marketplace-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  /* Tabla responsive en tablet */
  .table-header {
    grid-template-columns: 2fr 2.5fr 1fr 1.2fr 1.5fr;
  }

  .table-row {
    grid-template-columns: 2fr 2.5fr 1fr 1.2fr 1.5fr;
  }

  .description-text {
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }
}

@media (max-width: 767px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .search-box {
    max-width: 100%;
  }
  
  .view-controls {
    align-self: stretch;
    justify-content: center;
  }
  
  .app-actions {
    grid-template-columns: 1fr;
  }

  /* Tabla en móvil se convierte en tarjetas */
  .applications-table {
    background: transparent;
    border: none;
  }

  .table-header {
    display: none;
  }

  .table-body {
    gap: 1rem;
  }

  .table-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 1.25rem;
  }

  .table-row:hover {
    background: var(--color-background-soft);
  }

  .table-col {
    width: 100%;
  }

  .col-app {
    order: 1;
  }

  .col-description {
    order: 3;
  }

  .col-status {
    order: 2;
    justify-content: flex-start;
    margin-left: auto;
    margin-top: -2.5rem;
  }

  .col-date {
    order: 4;
    justify-content: flex-start;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }

  .col-date::before {
    content: 'Fecha: ';
    font-weight: 600;
    margin-right: 0.5rem;
    color: var(--vt-c-text-2);
    font-size: 0.8125rem;
  }

  .col-actions {
    order: 5;
    justify-content: stretch;
  }

  .table-actions {
    width: 100%;
    gap: 0.75rem;
  }

  .btn-table-action {
    flex: 1;
    justify-content: center;
  }

  .btn-table-action:not(.btn-primary-action) {
    padding: 0.5rem 0.875rem;
    gap: 0.375rem;
  }

  .description-text {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
  
  .marketplace-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 3rem 1.5rem;
  }

  .empty-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 1.25rem;
  }

  .empty-icon svg {
    width: 64px;
    height: 64px;
  }

  .empty-title {
    font-size: 1.5rem;
  }

  .empty-description {
    font-size: 1rem;
  }

  .no-results-state {
    padding: 3rem 1.5rem;
  }

  .no-results-icon {
    width: 80px;
    height: 80px;
  }

  .no-results-state h3 {
    font-size: 1.25rem;
  }
}

/* ============================================
   GRADIENT BACKGROUNDS
   ============================================ */
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.25);
}
</style>
