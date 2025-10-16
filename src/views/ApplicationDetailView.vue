<template>
  <div class="application-detail">
    <!-- Hero Header with Background -->
    <div class="hero-header">
      <div class="hero-background"></div>
      <div class="hero-content">
        <div class="container">
          <button @click="$router.back()" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Volver</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
            </svg>
          </div>
          <p class="loading-text">Cargando aplicación...</p>
        </div>

        <!-- Application Content -->
        <div v-else-if="application" class="app-content">
          <!-- App Header Card -->
          <div class="app-header-card">
            <div class="app-header-main">
              <div class="app-logo-container">
                <div class="app-logo">
                  <img
                    v-if="currentLogo"
                    :src="currentLogo"
                    :alt="application.name"
                  />
                  <div v-else class="app-logo-fallback">
                    <span>{{ application.name?.charAt(0) || 'A' }}</span>
                  </div>
                </div>
              </div>

              <div class="app-header-info">
                <div class="app-title-section">
                  <h1 class="app-title">{{ application.name }}</h1>
                  <div class="app-badges">
                    <span v-if="isSubscribed" class="badge badge-subscribed">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Suscrito
                    </span>
                    <span v-if="!application.isHidden" class="badge badge-success">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Activa
                    </span>
                    <span v-if="application.subscriptionCount !== undefined" class="badge badge-info">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      {{ application.subscriptionCount }} {{ application.subscriptionCount === 1 ? 'suscripción' : 'suscripciones' }}
                    </span>
                  </div>
                </div>

                <p class="app-description">{{ application.description }}</p>

                <div class="app-actions">
                  <button
                    v-if="application.url"
                    @click="openApplicationSite"
                    class="btn btn-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <span>Abrir Aplicación</span>
                  </button>
                  <button class="btn btn-secondary" @click="shareApplication">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Screenshots Carousel -->
            <div v-if="application.screenshots && application.screenshots.length > 0" class="screenshots-section">
              <h3 class="screenshots-title">Capturas de Pantalla</h3>
              <div class="carousel-wrapper">
                <!-- Navigation Arrows -->
                <button
                  v-if="canScrollLeft"
                  @click="scrollCarousel('left')"
                  class="carousel-nav carousel-nav-left"
                  aria-label="Anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>

                <!-- Carousel Container -->
                <div 
                  ref="carouselContainer"
                  @scroll="updateScrollPosition"
                  class="carousel-container"
                >
                  <div class="carousel-track">
                    <div
                      v-for="(screenshot, index) in application.screenshots"
                      :key="index"
                      class="carousel-item"
                      @click="openImagePreview(index)"
                    >
                      <div class="screenshot-card">
                        <img
                          :src="screenshot"
                          :alt="`Captura ${index + 1}`"
                          loading="lazy"
                        />
                        <div class="screenshot-overlay">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  v-if="canScrollRight"
                  @click="scrollCarousel('right')"
                  class="carousel-nav carousel-nav-right"
                  aria-label="Siguiente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>

              <!-- Carousel Indicators -->
              <div class="carousel-indicators">
                <button
                  v-for="(screenshot, index) in application.screenshots"
                  :key="`indicator-${index}`"
                  @click="scrollToIndex(index)"
                  :class="['indicator', { active: currentIndex === index }]"
                  :aria-label="`Ir a captura ${index + 1}`"
                ></button>
              </div>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div class="tabs-card">
            <nav class="tabs-nav">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="['tab-button', { active: activeTab === tab.id }]"
              >
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path v-for="(pathData, idx) in tab.icon.split('|')" :key="idx" :d="pathData" />
                </svg>
                <span>{{ tab.name }}</span>
              </button>
            </nav>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Detalles Tab -->
              <div v-if="activeTab === 'details'" class="details-content">
                <div class="content-section">
                  <h3 class="section-title">Descripción</h3>
                  <div class="section-body">
                    <p class="description-text">
                      {{ application.longDescription || application.description || 'Sin descripción disponible' }}
                    </p>
                  </div>
                </div>

                <div class="content-section">
                  <h3 class="section-title">Información Técnica</h3>
                  <div class="info-grid">
                    <div class="info-card">
                      <dt class="info-label">URL de la Aplicación</dt>
                      <dd class="info-value">{{ application.url || 'No especificada' }}</dd>
                    </div>
                    <div class="info-card">
                      <dt class="info-label">Slug</dt>
                      <dd class="info-value mono">{{ application.slug || 'no-definido' }}</dd>
                    </div>
                    <div class="info-card">
                      <dt class="info-label">Fecha de Creación</dt>
                      <dd class="info-value">{{ formatDate(application.createdAt) }}</dd>
                    </div>
                    <div class="info-card">
                      <dt class="info-label">Última Actualización</dt>
                      <dd class="info-value">{{ formatDate(application.updatedAt) }}</dd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Planes Tab -->
              <div v-else-if="activeTab === 'plans'" class="plans-content">
                <!-- Current Subscription Info (si está suscrito) -->
                <div v-if="isSubscribed && currentSubscription" class="current-subscription-banner">
                  <div class="subscription-info">
                    <div class="subscription-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div class="subscription-details">
                      <h3 class="subscription-title">✓ Suscripción Activa</h3>
                      <p class="subscription-description">
                        Plan actual: <strong>{{ currentSubscription.planName || currentSubscription.plan?.name || 'Suscripción activa' }}</strong>
                      </p>
                      <div class="subscription-actions">
                        <button class="btn-manage-users" @click="$router.push(`/applications/${application.id}/users`)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          Gestionar Usuarios
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="subscription-stats">
                    <div class="stat-item">
                      <div class="stat-label">Estado</div>
                      <div class="stat-value">
                        <span class="badge-success">{{ currentSubscription.status }}</span>
                      </div>
                    </div>
                    <div class="stat-item" v-if="currentSubscription.maxUsers !== null && currentSubscription.maxUsers !== undefined">
                      <div class="stat-label">Usuarios</div>
                      <div class="stat-value">{{ currentSubscription.subscriptionUsers?.length || 0 }} / {{ currentSubscription.maxUsers }}</div>
                    </div>
                    <div class="stat-item" v-else>
                      <div class="stat-label">Usuarios</div>
                      <div class="stat-value">{{ currentSubscription.subscriptionUsers?.length || 0 }} / ∞</div>
                    </div>
                  </div>
                </div>

                <!-- Loading Plans -->
                <div v-if="loadingPlans" class="plans-loading">
                  <div class="loading-spinner">
                    <svg class="spinner" viewBox="0 0 50 50">
                      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
                    </svg>
                  </div>
                  <p>Cargando planes...</p>
                </div>

                <!-- Plans Error -->
                <div v-else-if="plansError" class="plans-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <h3>No se pudieron cargar los planes</h3>
                  <p>{{ plansError }}</p>
                </div>

                <!-- Plans List -->
                <div v-else-if="plans.length > 0" class="plans-list">
                  <h3 v-if="isSubscribed" class="plans-section-title">
                    Cambiar de Plan
                  </h3>
                  <div class="plans-grid">
                    <div
                      v-for="plan in plans"
                      :key="plan.id"
                      :class="[
                        'plan-card', 
                        { 
                          popular: plan.popular || plan.isPopular,
                          'current-plan': isCurrentPlan(plan)
                        }
                      ]"
                    >
                      <!-- Badge solo para plan popular -->
                      <div v-if="(plan.popular || plan.isPopular) && !isCurrentPlan(plan)" class="plan-badge plan-badge-popular">
                        ⭐ Más Popular
                      </div>

                      <div class="plan-header">
                        <h4 class="plan-name">{{ plan.name || plan.title }}</h4>
                        <div class="plan-price">
                          <span class="price-amount">
                            {{ plan.price !== undefined && plan.price !== null ? (plan.price === 0 ? 'Gratis' : `€${plan.price}`) : 'Gratis' }}
                          </span>
                          <span v-if="plan.price > 0 && plan.interval" class="price-interval">
                            /{{ plan.interval === 'month' ? 'mes' : plan.interval === 'year' ? 'año' : plan.interval }}
                          </span>
                        </div>
                        <p v-if="plan.description" class="plan-description">{{ plan.description }}</p>
                      </div>

                      <div class="plan-body">
                        <ul v-if="plan.features && plan.features.length > 0" class="plan-features">
                          <li v-for="(feature, index) in plan.features" :key="index">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>{{ typeof feature === 'string' ? feature : feature.name || feature.description }}</span>
                          </li>
                        </ul>

                        <!-- Botón de acción según estado -->
                        <button 
                          v-if="isCurrentPlan(plan)"
                          class="plan-button current-plan-button"
                          disabled
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span>Tu Plan Actual</span>
                        </button>
                        <button 
                          v-else
                          @click="selectPlan(plan)"
                          :disabled="checkoutLoading"
                          class="plan-button"
                        >
                          <svg v-if="checkoutLoading && selectedPlanId === plan.id" class="button-spinner" viewBox="0 0 50 50">
                            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                          </svg>
                          <span v-if="checkoutLoading && selectedPlanId === plan.id">Procesando...</span>
                          <span v-else-if="isSubscribed">Cambiar a este Plan</span>
                          <span v-else>Seleccionar Plan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No Plans -->
                <div v-else class="plans-empty">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <h3>No hay planes disponibles</h3>
                  <p>Esta aplicación no tiene planes configurados.</p>
                </div>
              </div>

              <!-- Estadísticas Tab -->
              <div v-else-if="activeTab === 'stats'" class="stats-content">
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-icon stat-icon-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div class="stat-info">
                      <dt class="stat-label">Total de Suscripciones</dt>
                      <dd class="stat-value">{{ application.subscriptionCount || 0 }}</dd>
                    </div>
                  </div>

                  <div class="stat-card">
                    <div class="stat-icon stat-icon-success">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div class="stat-info">
                      <dt class="stat-label">Estado</dt>
                      <dd class="stat-value">
                        <span v-if="application.isHidden" class="status-badge status-warning">Oculta</span>
                        <span v-else-if="application.isActive" class="status-badge status-success">Activa</span>
                        <span v-else class="status-badge status-inactive">Inactiva</span>
                      </dd>
                    </div>
                  </div>

                  <div class="stat-card">
                    <div class="stat-icon stat-icon-info">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div class="stat-info">
                      <dt class="stat-label">Última Actualización</dt>
                      <dd class="stat-value small">{{ formatDate(application.updatedAt) }}</dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Lightbox Modal -->
    <Teleport to="body">
      <div v-if="lightboxOpen" class="lightbox-modal" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <!-- Close Button -->
          <button @click="closeLightbox" class="lightbox-close" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Navigation Arrows -->
          <button
            v-if="application && application.screenshots && application.screenshots.length > 1"
            @click="previousImage"
            class="lightbox-nav lightbox-nav-prev"
            aria-label="Imagen anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <!-- Image Display -->
          <div class="lightbox-image-container">
            <img
              v-if="application && application.screenshots"
              :src="application.screenshots[lightboxIndex]"
              :alt="`Captura ${lightboxIndex + 1}`"
              class="lightbox-image"
            />
            
            <!-- Image Counter -->
            <div class="lightbox-counter">
              {{ lightboxIndex + 1 }} / {{ application?.screenshots?.length || 0 }}
            </div>
          </div>

          <button
            v-if="application && application.screenshots && application.screenshots.length > 1"
            @click="nextImage"
            class="lightbox-nav lightbox-nav-next"
            aria-label="Imagen siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ApplicationsService } from '@/services'
import { useTheme } from '@/composables/useTheme'
import { fetchAppPlans } from '@/mocks/subscriptionPlans'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useConfirm } from '@/composables/useConfirm'

const route = useRoute()
const { isDark } = useTheme()
const subscriptionsStore = useSubscriptionsStore()
const { confirm } = useConfirm()

const application = ref<any>(null)
const loading = ref(true)
const activeTab = ref('details')
const carouselContainer = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const plans = ref<any[]>([])
const loadingPlans = ref(false)
const plansError = ref<string | null>(null)

// Checkout state
const checkoutLoading = ref(false)
const selectedPlanId = ref<string | null>(null)

// Lightbox state
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const tabs = [
  {
    id: 'details',
    name: 'Detalles',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M16 13H8|M16 17H8|M10 9H9H8'
  },
  {
    id: 'plans',
    name: 'Planes',
    icon: 'M2 7h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z|M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'
  },
  {
    id: 'stats',
    name: 'Estadísticas',
    icon: 'M12 20V10|M18 20V4|M6 20V16'
  }
]

// Computed property para elegir el logo según el tema
const currentLogo = computed(() => {
  if (isDark.value && application.value?.logoDark) {
    return application.value.logoDark
  }
  return application.value?.logo
})

// Computed para verificar si el usuario ya está suscrito
const isSubscribed = computed(() => {
  return application.value?.isSubscribed || false
})

const currentSubscription = computed(() => {
  return application.value?.subscription || null
})

const loadApplication = async () => {
  loading.value = true
  try {
    const data = await ApplicationsService.getApplication(route.params.id as string)
    application.value = data
    
    // Initialize carousel state after loading
    setTimeout(() => {
      updateScrollPosition()
    }, 100)
  } catch (error) {
    console.error('Error loading application:', error)
  } finally {
    loading.value = false
  }
}

const scrollCarousel = (direction: string) => {
  if (!carouselContainer.value) return
  
  const container = carouselContainer.value
  const scrollAmount = direction === 'left' ? -600 : 600
  
  container.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })
}

const scrollToIndex = (index: number) => {
  if (!carouselContainer.value) return
  
  const container = carouselContainer.value
  const itemWidth = 600 + 24 // width + gap
  
  container.scrollTo({
    left: index * itemWidth,
    behavior: 'smooth'
  })
  
  currentIndex.value = index
}

const updateScrollPosition = () => {
  if (!carouselContainer.value) return
  
  const container = carouselContainer.value
  const scrollLeft = container.scrollLeft
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth
  
  // Update scroll buttons visibility
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
  
  // Update current index based on scroll position
  const itemWidth = 600 + 24
  currentIndex.value = Math.round(scrollLeft / itemWidth)
}

const loadPlans = async () => {
  if (!application.value?.apiUrl) {
    plansError.value = 'No hay URL de API configurada'
    return
  }

  loadingPlans.value = true
  plansError.value = null
  
  try {
    // Usar la función helper que maneja desarrollo y producción
    const data = await fetchAppPlans(application.value.apiUrl)
    plans.value = data
    
    if (plans.value.length === 0) {
      plansError.value = 'La API no devolvió ningún plan'
    }
  } catch (error: any) {
    console.error('Error loading plans:', error)
    plansError.value = error.message || 'No se pudo conectar con la API de planes'
  } finally {
    loadingPlans.value = false
  }
}

// Verifica si un plan es el plan actual del usuario
const isCurrentPlan = (plan: any) => {
  if (!currentSubscription.value) {
    return false
  }
  
  // Comparar por planId (el backend lo envía en la suscripción)
  if (currentSubscription.value.planId && plan.id) {
    return currentSubscription.value.planId === plan.id
  }
  
  // Fallback: comparar por stripePriceId si existe
  if (currentSubscription.value.stripePriceId && plan.stripePriceId) {
    return currentSubscription.value.stripePriceId === plan.stripePriceId
  }
  
  return false
}

const selectPlan = async (plan: any) => {
  if (!application.value?.id) {
    await confirm({
      title: 'Error',
      message: 'No se pudo identificar la aplicación',
      details: 'Por favor, recarga la página e inténtalo de nuevo.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
    return
  }

  // Solo verificamos que el plan tenga un ID válido
  // El backend se encargará de obtener el stripePriceId y demás datos
  if (!plan.id) {
    await confirm({
      title: 'Error',
      message: 'Plan inválido',
      details: 'El plan seleccionado no está disponible.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
    return
  }

  checkoutLoading.value = true
  selectedPlanId.value = plan.id

  try {
    // Solo enviamos planId y applicationId
    // El backend obtiene stripePriceId y demás datos del plan
    const response = await subscriptionsStore.createCheckoutSession({
      applicationId: application.value.id,
      planId: plan.id,
      successUrl: `${window.location.origin}/subscriptions?checkout=success&app=${application.value.id}`,
      cancelUrl: window.location.href,
    })

    console.log('✅ Checkout session created:', response)
    console.log('🔗 Redirecting to URL:', response.checkoutUrl)

    // Verificar que tenemos una URL válida
    if (!response.checkoutUrl) {
      throw new Error('No se recibió URL de checkout de Stripe')
    }

    // Redirigir a Stripe Checkout
    window.location.href = response.checkoutUrl
  } catch (error: any) {
    console.error('❌ Error creating checkout session:', error)
    await confirm({
      title: 'Error al Procesar el Pago',
      message: 'No se pudo crear la sesión de pago',
      details: error.message || 'Por favor, inténtalo de nuevo más tarde.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    })
    checkoutLoading.value = false
    selectedPlanId.value = null
  }
}

const openApplicationSite = () => {
  if (application.value?.url) {
    window.open(application.value.url, '_blank', 'noopener,noreferrer')
  }
}

const shareApplication = () => {
  if (navigator.share && application.value) {
    navigator.share({
      title: application.value.name,
      text: application.value.description,
      url: window.location.href
    }).catch(err => console.log('Error sharing:', err))
  } else {
    // Fallback: copiar URL al portapapeles
    navigator.clipboard.writeText(window.location.href)
    alert('URL copiada al portapapeles')
  }
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openImagePreview = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden' // Prevent background scrolling
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = '' // Restore scrolling
}

const nextImage = () => {
  if (application.value?.screenshots) {
    lightboxIndex.value = (lightboxIndex.value + 1) % application.value.screenshots.length
  }
}

const previousImage = () => {
  if (application.value?.screenshots) {
    lightboxIndex.value = lightboxIndex.value === 0 
      ? application.value.screenshots.length - 1 
      : lightboxIndex.value - 1
  }
}

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'plans' && plans.value.length === 0 && !plansError.value && application.value) {
    loadPlans()
  }
})

// Handle keyboard navigation for lightbox
const handleKeydown = (event: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  
  if (event.key === 'Escape') {
    closeLightbox()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  } else if (event.key === 'ArrowLeft') {
    previousImage()
  }
}

onMounted(() => {
  loadApplication()
  window.addEventListener('keydown', handleKeydown)
})

// Cleanup
watch(() => lightboxOpen.value, (isOpen) => {
  if (!isOpen) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* ============================================
   VARIABLES Y TEMA BASE
   ============================================ */
.application-detail {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: 4rem;
}

/* ============================================
   HERO HEADER
   ============================================ */
.hero-header {
  position: relative;
  padding: 2rem 0 8rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    var(--color-primary) 0%, 
    var(--color-primary-dark, #2563eb) 100%
  );
  opacity: 0.05;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: var(--color-background-mute);
  border-color: var(--color-primary);
  transform: translateX(-4px);
}

.back-button svg {
  flex-shrink: 0;
}

/* ============================================
   MAIN CONTENT
   ============================================ */
.main-content {
  position: relative;
  z-index: 2;
  margin-top: -6rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ============================================
   LOADING STATE
   ============================================ */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  gap: 1.5rem;
}

.loading-spinner {
  width: 64px;
  height: 64px;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 100%;
  height: 100%;
}

.spinner .path {
  stroke: var(--color-primary);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.loading-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

/* ============================================
   APP HEADER CARD
   ============================================ */
.app-header-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.app-header-main {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

.app-logo-container {
  flex-shrink: 0;
}

.app-logo {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  overflow: hidden;
  background: transparent;
  border: 2px solid var(--color-border);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.app-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-logo-fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
}

.app-logo-fallback span {
  font-size: 3rem;
  font-weight: 700;
  color: white;
}

.app-header-info {
  flex: 1;
  min-width: 0;
}

.app-title-section {
  margin-bottom: 1rem;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.app-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
}

.badge svg {
  flex-shrink: 0;
}

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-subscribed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15));
  color: #059669;
  font-weight: 600;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.2);
}

.badge-info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.app-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin: 0 0 2rem 0;
}

.app-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.btn svg {
  flex-shrink: 0;
}

.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.btn:hover::before {
  opacity: 1;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-background-soft);
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

/* ============================================
   SCREENSHOTS SECTION
   ============================================ */
.screenshots-section {
  margin-top: 2.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid var(--color-border);
}

.screenshots-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 1.5rem 0;
}

.carousel-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.carousel-container {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-track {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem;
}

.carousel-item {
  flex-shrink: 0;
  width: min(500px, 80vw);
  cursor: pointer;
}

.screenshot-card {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.screenshot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.screenshot-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.screenshot-card:hover img {
  transform: scale(1.05);
}

.screenshot-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.screenshot-card:hover .screenshot-overlay {
  opacity: 1;
}

.screenshot-overlay svg {
  color: white;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-nav:hover {
  background: var(--color-background);
  border-color: var(--color-primary);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.carousel-nav-left {
  left: -24px;
}

.carousel-nav-right {
  right: -24px;
}

.carousel-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator:hover {
  background: var(--color-border-hover);
  transform: scale(1.2);
}

.indicator.active {
  width: 32px;
  border-radius: 4px;
  background: var(--color-primary);
}

/* ============================================
   TABS
   ============================================ */
.tabs-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding: 0.5rem;
  gap: 0.5rem;
  background: var(--color-background-mute);
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
}

.tab-button:hover {
  background: var(--color-background-soft);
  color: var(--color-text);
}

.tab-button.active {
  background: var(--color-background);
  color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-button svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ============================================
   TAB CONTENT
   ============================================ */
.tab-content {
  padding: 2.5rem;
}

/* Details Content */
.details-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
}

.section-body {
  color: var(--color-text);
}

.description-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  white-space: pre-wrap;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-card {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s ease;
}

.info-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-heading);
  word-break: break-word;
}

.info-value.mono {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
}

/* Plans Content */
.plans-content {
  min-height: 400px;
}

/* Current Subscription Banner */
.current-subscription-banner {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.05));
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
}

.subscription-info {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.subscription-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  color: white;
}

.subscription-details {
  flex: 1;
}

.subscription-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.subscription-description {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0 0 1rem 0;
}

.subscription-description strong {
  color: var(--color-heading);
  font-weight: 600;
}

.subscription-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-manage-users {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.btn-manage-users:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.subscription-stats {
  display: flex;
  gap: 2rem;
  padding-left: 2rem;
  border-left: 1px solid rgba(16, 185, 129, 0.2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 100px;
}

.stat-item .stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.stat-item .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
}

.badge-success {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plans-section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 1.5rem 0;
}

.plans-loading,
.plans-error,
.plans-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  text-align: center;
}

.plans-loading .loading-spinner {
  width: 48px;
  height: 48px;
}

.plans-error svg,
.plans-empty svg {
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.plans-error h3,
.plans-empty h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
}

.plans-error p,
.plans-empty p {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.plan-card {
  position: relative;
  background: var(--color-background-mute);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary);
}

.plan-card.popular {
  border-color: var(--color-primary);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

/* Plan actual - estilo más sutil */
.plan-card.current-plan {
  background: var(--color-background-mute);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
}

.plan-card.current-plan:hover {
  transform: translateY(-2px);
  border-color: rgba(16, 185, 129, 0.6);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.plan-badge-popular {
  background: var(--color-primary);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.plan-header {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 1rem 0;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.price-amount {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
}

.price-interval {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-left: 0.25rem;
}

.plan-description {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.plan-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  flex: 1;
}

.plan-features li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0;
  font-size: 0.9375rem;
  color: var(--color-text);
}

.plan-features li svg {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.plan-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
}

/* Botón del plan actual */
.current-plan-button {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  cursor: default !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.current-plan-button:hover {
  transform: none !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
}

.plan-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.plan-button .button-spinner {
  width: 20px;
  height: 20px;
  animation: rotate 2s linear infinite;
}

.plan-button .button-spinner .path {
  stroke: white;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.plan-card.popular .plan-button:not(.current-plan-button) {
  background: var(--color-primary);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.plan-button:not(.current-plan-button):hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

/* Stats Content */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.75rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-primary {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-icon-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon-info {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-bottom: 0.375rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1;
}

.stat-value.small {
  font-size: 1rem;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-inactive {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1023px) {
  .app-header-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .app-header-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .app-badges {
    justify-content: center;
  }

  .app-actions {
    justify-content: center;
    width: 100%;
  }

  .carousel-nav-left {
    left: 0;
  }

  .carousel-nav-right {
    right: 0;
  }
}

@media (max-width: 767px) {
  .hero-header {
    padding: 1.5rem 0 6rem;
  }

  .main-content {
    margin-top: -4rem;
  }

  .app-header-card {
    padding: 1.75rem;
  }

  .app-logo {
    width: 96px;
    height: 96px;
  }

  .app-title {
    font-size: 2rem;
  }

  .app-description {
    font-size: 1rem;
  }

  .tabs-nav {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .tab-button {
    white-space: nowrap;
    flex: none;
    min-width: 120px;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .current-subscription-banner {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .subscription-stats {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid rgba(16, 185, 129, 0.2);
    padding-top: 1.5rem;
    width: 100%;
    justify-content: space-around;
  }

  .carousel-nav {
    width: 40px;
    height: 40px;
  }

  .carousel-nav svg {
    width: 20px;
    height: 20px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .app-header-card {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .app-logo {
    width: 80px;
    height: 80px;
  }

  .app-logo-fallback span {
    font-size: 2.5rem;
  }

  .app-title {
    font-size: 1.75rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .app-actions {
    flex-direction: column;
    width: 100%;
  }
}

/* ============================================
   LIGHTBOX MODAL
   ============================================ */
.lightbox-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.lightbox-close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.lightbox-image-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 100%;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.lightbox-counter {
  position: absolute;
  bottom: -3rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.lightbox-nav {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-nav:active {
  transform: scale(0.95);
}

.lightbox-nav-prev {
  margin-right: auto;
}

.lightbox-nav-next {
  margin-left: auto;
}

/* Responsive lightbox */
@media (max-width: 767px) {
  .lightbox-modal {
    padding: 1rem;
  }

  .lightbox-content {
    gap: 1rem;
  }

  .lightbox-close {
    width: 40px;
    height: 40px;
    top: -0.5rem;
    right: -0.5rem;
  }

  .lightbox-nav {
    width: 44px;
    height: 44px;
    position: absolute;
    bottom: 50%;
    transform: translateY(50%);
  }

  .lightbox-nav-prev {
    left: 0.5rem;
    margin-right: 0;
  }

  .lightbox-nav-next {
    right: 0.5rem;
    margin-left: 0;
  }

  .lightbox-nav svg {
    width: 24px;
    height: 24px;
  }

  .lightbox-image {
    max-height: 80vh;
  }

  .lightbox-counter {
    bottom: -2.5rem;
    font-size: 0.8125rem;
    padding: 0.4rem 1rem;
  }
}
</style>

