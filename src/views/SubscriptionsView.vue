<template>
  <div class="subscriptions-view">
    <div class="container py-lg">
      
      <!-- Forbidden Access Message -->
      <div v-if="isForbidden" class="forbidden-message">
        <div class="forbidden-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <h2 class="forbidden-title">Acceso Restringido a Suscripciones</h2>
        <p class="forbidden-description">
          Esta sección es solo para administradores y propietarios de la organización.
        </p>
        <p class="forbidden-details">
          Si tienes acceso a aplicaciones, puedes verlas y gestionarlas desde la sección <strong>Mis Aplicaciones</strong>.
        </p>
        <button class="btn-primary" @click="$router.push('/applications')" style="margin-top: 1.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          Ir a Mis Aplicaciones
        </button>
      </div>

      <!-- Normal Content (only if not forbidden) -->
      <template v-else>
        <!-- Header Section -->
        <div class="applications-header">
          <div class="header-content">
            <h1 class="page-title">Mis Suscripciones</h1>
            <p class="page-subtitle">Gestiona tus planes, renovaciones y facturas</p>
          </div>
          <button class="btn-primary" @click="$router.push('/marketplace')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Explorar Marketplace
          </button>
        </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <rect x="7" y="7" width="10" height="10" rx="1" ry="1"></rect>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-label">Suscripciones Activas</div>
            <div class="stat-value">{{ activeSubscriptionsCount }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-label">Gasto Mensual Total</div>
            <div class="stat-value">€{{ totalMonthlySpend }}</div>
          </div>
        </div>
      </div>

      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">Mis Suscripciones</h2>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando suscripciones...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 class="empty-title">Error al cargar suscripciones</h3>
        <p class="empty-description">{{ error }}</p>
        <button @click="loadSubscriptions" class="btn-primary">Reintentar</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="enrichedSubscriptions.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <h3 class="empty-title">No tienes suscripciones activas</h3>
        <p class="empty-description">
          Explora nuestro marketplace y suscríbete a las aplicaciones
          que necesitas para potenciar tu negocio.
        </p>
        <button class="btn-primary" @click="$router.push('/marketplace')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Explorar Marketplace
        </button>
      </div>

      <!-- Subscriptions Grid -->
      <div v-else class="subscriptions-grid">
        <div 
          v-for="subscription in enrichedSubscriptions" 
          :key="subscription.id" 
          class="subscription-card"
        >
          <!-- Header con Logo y Estado -->
          <div class="subscription-card-header">
            <div class="header-left">
              <div class="app-logo" :style="getAppLogo(subscription.application) ? { background: 'var(--color-background)' } : { background: getRandomColor(subscription.id) }">
                <img v-if="getAppLogo(subscription.application)" :src="getAppLogo(subscription.application)!" :alt="subscription.application.name" />
                <span v-else>{{ getAppInitials(subscription.application.name) }}</span>
              </div>
              <div class="header-info">
                <h3 class="subscription-title">{{ subscription.application.name }}</h3>
                <p class="subscription-subtitle">{{ subscription.plan }}</p>
              </div>
            </div>
            <div class="header-right">
              <span :class="['status-badge', getStatusClass(subscription)]">
                <span class="status-indicator"></span>
                {{ getStatusLabel(subscription) }}
              </span>
            </div>
          </div>

          <!-- Precio Destacado -->
          <div class="subscription-pricing">
            <div class="price-main">
              <span class="price-amount">€{{ subscription.price.toFixed(0) }}</span>
              <span class="price-period">{{ getPriceLabel(subscription) }}</span>
            </div>
            <div class="price-next">
              {{ subscription.cancelAtPeriodEnd ? 'Termina' : 'Próxima factura' }}: {{ formatDate(subscription.renewalDate) }}
            </div>
          </div>

          <!-- Advertencia de Cancelación -->
          <div v-if="subscription.cancelAtPeriodEnd" class="subscription-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Tu suscripción se cancelará el <strong>{{ formatDate(subscription.renewalDate) }}</strong></span>
          </div>

          <!-- Información de Usuarios -->
          <div class="subscription-users">
            <div class="users-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span class="users-title">Usuarios</span>
            </div>
            <div class="users-content">
              <div class="users-stats">
                <span class="users-current">{{ subscription.currentUsers || 0 }}</span>
                <span class="users-separator">/</span>
                <span class="users-max">{{ subscription.maxUsers || '∞' }}</span>
              </div>
              <div v-if="subscription.hasUserLimit && subscription.usersRemaining !== undefined" class="users-available">
                <span :class="['available-badge', { 'critical': subscription.usersRemaining <= 1, 'warning': subscription.usersRemaining > 1 && subscription.usersRemaining <= 3 }]">
                  {{ subscription.usersRemaining }} disponibles
                </span>
              </div>
            </div>
          </div>

          <!-- Detalles Adicionales -->
          <div class="subscription-details">
            <div class="detail-item">
              <span class="detail-label">Plan ID</span>
              <span class="detail-value">{{ subscription.planId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Activa desde</span>
              <span class="detail-value">{{ formatDate(subscription.startDate) }}</span>
            </div>
          </div>

          <!-- Acciones -->
          <div class="subscription-actions" @click.stop>
            <button class="action-btn action-primary" @click="openApplication(subscription.application)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Abrir App
            </button>
            <button class="action-btn action-secondary" @click="manageUsers(subscription.application)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Usuarios
            </button>
            
            <!-- Botón dinámico: Cancelar o Reactivar -->
            <button 
              v-if="subscription.cancelAtPeriodEnd" 
              class="action-btn action-success" 
              @click="confirmReactivateSubscription(subscription)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
              Reactivar
            </button>
            <button 
              v-else
              class="action-btn action-danger" 
              @click="confirmCancelSubscription(subscription)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Cancelar
            </button>
          </div>
        </div>
      </div>
      </template>
    </div> <!-- closes container py-lg -->

    <!-- Success Modal estilo Apple -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showSuccessModal" class="success-modal-overlay" @click="closeSuccessModal">
          <Transition name="modal-scale">
            <div v-if="showSuccessModal" class="success-modal" @click.stop>
              <!-- Checkmark animado -->
              <div class="success-icon-container">
                <svg class="success-icon" viewBox="0 0 52 52">
                  <circle class="success-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path class="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>

              <!-- Título y mensaje -->
              <h2 class="success-title">¡Suscripción Exitosa!</h2>
              <p class="success-message">
                Tu suscripción ha sido activada correctamente. 
                <span v-if="checkoutAppName">Ahora tienes acceso completo a <strong>{{ checkoutAppName }}</strong>.</span>
              </p>

              <!-- Botón de acción -->
              <button @click="closeSuccessModal" class="success-button">
                Continuar
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div> 
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useApplicationsStore } from '@/stores/applications'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/composables/useTheme'
import { useConfirm } from '@/composables/useConfirm'

const route = useRoute()
const router = useRouter()
const subscriptionsStore = useSubscriptionsStore()
const applicationsStore = useApplicationsStore()
const { subscriptions, loading, error } = storeToRefs(subscriptionsStore)
const { applications } = storeToRefs(applicationsStore)
const { isDark } = useTheme()
const { confirm } = useConfirm()

// Forbidden state
const isForbidden = ref(false)

// Success modal state
const showSuccessModal = ref(false)
const checkoutAppName = ref<string>('')

// Type for enriched subscription with application data
interface EnrichedSubscription {
  id: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  stripeCustomerId?: string
  stripeLatestInvoiceId?: string | null
  planId: string
  quantity: number
  currency: string
  amount: number
  interval: string
  maxUsers?: number | null
  application: {
    id: string
    name: string
    logo?: string | null
    logoDark?: string | null
    url?: string | null
    createdAt?: string
    [key: string]: any
  }
  status: string
  plan: string
  price: number
  startDate: string
  renewalDate: string
  trialEnd?: string | null
  canceledAt?: string | null
  cancelAtPeriodEnd: boolean
  currentUsers: number
  hasUserLimit: boolean
  usersRemaining: number
  subscriptionUsers: any[]
  createdAt: string
  updatedAt: string
}

// Computed properties
const enrichedSubscriptions = computed<EnrichedSubscription[]>(() => {
  // Enriquece las suscripciones del backend con datos formateados
  if (!subscriptions.value) {
    return []
  }
  
  return subscriptions.value.map(sub => {
    const applicationData = sub.application || {
      id: sub.applicationId || 'unknown',
      name: 'Aplicación desconocida',
      logo: null,
      logoDark: null,
      url: null,
      createdAt: sub.createdAt
    }
    
    return {
      // IDs y referencias de Stripe
      id: sub.id,
      stripeSubscriptionId: sub.stripeSubscriptionId,
      stripePriceId: sub.stripePriceId,
      stripeCustomerId: sub.stripeCustomerId,
      stripeLatestInvoiceId: sub.stripeLatestInvoiceId || null,
      
      // Información del plan
      planId: sub.planId,
      quantity: sub.quantity || 1,
      currency: sub.currency || 'eur',
      amount: sub.amount || 0,
      interval: sub.interval || 'month',
      maxUsers: sub.maxUsers,
      
      // Aplicación
      application: applicationData,
      
      // Estado y plan formateado
      status: sub.status,
      plan: sub.interval === 'month' ? 'Plan Mensual' : 'Plan Anual',
      price: sub.amount ? sub.amount / 100 : 0,
      
      // Fechas
      startDate: sub.currentPeriodStart,
      renewalDate: sub.currentPeriodEnd,
      trialEnd: sub.trialEndsAt,
      canceledAt: sub.canceledAt,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd || false,
      
      // Usuarios
      currentUsers: sub.currentUsers || 0,
      hasUserLimit: sub.hasUserLimit || false,
      usersRemaining: sub.usersRemaining || 0,
      subscriptionUsers: sub.subscriptionUsers || [],
      
      // Metadatos
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt
    }
  })
})

const activeSubscriptionsCount = computed(() => {
  return enrichedSubscriptions.value.filter(sub => {
    const status = sub.status.toLowerCase()
    return status === 'active' || status === 'trialing'
  }).length
})

const totalMonthlySpend = computed(() => {
  return enrichedSubscriptions.value
    .filter(sub => {
      const status = sub.status.toLowerCase()
      return status === 'active' || status === 'trialing'
    })
    .reduce((total, sub) => {
      // Convertir precios anuales a mensuales para el cálculo
      const monthlyPrice = sub.plan.includes('Anual') ? sub.price / 12 : sub.price
      return total + monthlyPrice
    }, 0)
    .toFixed(2)
})

// Functions
async function loadSubscriptions() {
  try {
    console.log('🔄 SubscriptionsView: Cargando datos...')
    
    isForbidden.value = false
    
    // Cargar suscripciones del backend (usa caché si es válido)
    await subscriptionsStore.fetchSubscriptions()
    
    console.log('✅ Suscripciones cargadas:', subscriptions.value)
    console.log('📊 Total:', subscriptions.value?.length || 0)
    
    // Cargar aplicaciones para enriquecer datos (usa caché si es válido)
    if (subscriptions.value && subscriptions.value.length > 0) {
      await applicationsStore.fetchUserApplications()
      console.log('✅ Aplicaciones cargadas:', applications.value?.length || 0)
    }
  } catch (err: any) {
    console.error('❌ Error al cargar suscripciones:', err)
    
    // Check if it's a 403 Forbidden error
    const status = err?.statusCode || err?.status || err?.response?.status
    if (status === 403) {
      isForbidden.value = true
    }
  }
}

function checkForCheckoutSuccess() {
  const checkout = route.query.checkout
  const appId = route.query.app as string

  if (checkout === 'success') {
    // Buscar el nombre de la aplicación
    if (appId) {
      const app = applications.value.find(a => a.id === appId)
      if (app) {
        checkoutAppName.value = app.name
      }
    }

    // Mostrar modal de éxito
    showSuccessModal.value = true

    // Limpiar query params de la URL sin recargar
    router.replace({ query: {} })
  }
}

function closeSuccessModal() {
  showSuccessModal.value = false
  checkoutAppName.value = ''
}

function getAppLogo(app: any): string | null {
  if (isDark.value && app.logoDark) {
    return app.logoDark
  }
  return app.logo || null
}

function getRandomColor(id: string): string {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4']
  const index = parseInt(id, 36) % colors.length
  const color = colors[index]
  return color !== undefined ? color : colors[0]!
}

function getAppInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return 'N/A'
  
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getStatusClass(subscription: any): string {
  const status = subscription.status?.toLowerCase() || ''
  
  // Si está programada para cancelar, mostrarlo como warning
  if (subscription.cancelAtPeriodEnd && (status === 'active' || status === 'activa')) {
    return 'status-pending'
  }
  
  if (status === 'active' || status === 'activa') return 'status-active'
  if (status === 'trialing') return 'status-active' // Trial también es activo
  if (status === 'canceled' || status === 'cancelled' || status === 'cancelada') return 'status-cancelled'
  if (status === 'expired' || status === 'expirada') return 'status-expired'
  if (status === 'pending' || status === 'pendiente' || status === 'incomplete') return 'status-pending'
  if (status === 'past_due') return 'status-expired'
  
  return 'status-active'
}

function getStatusLabel(subscription: any): string {
  const status = subscription.status?.toLowerCase() || ''
  
  // Si está programada para cancelar pero aún activa
  if (subscription.cancelAtPeriodEnd && (status === 'active' || status === 'activa')) {
    return 'Cancela Pronto'
  }
  
  if (status === 'active' || status === 'activa') return 'Activa'
  if (status === 'trialing') return 'En Prueba'
  if (status === 'canceled' || status === 'cancelled' || status === 'cancelada') return 'Cancelada'
  if (status === 'expired' || status === 'expirada') return 'Expirada'
  if (status === 'pending' || status === 'pendiente' || status === 'incomplete') return 'Pendiente'
  if (status === 'past_due') return 'Pago Vencido'
  
  return 'Activa'
}

function getPriceLabel(subscription: any): string {
  return subscription.plan.includes('Mensual') ? '/mes' : '/año'
}

function getCostLabel(subscription: any): string {
  return subscription.plan.includes('Mensual') ? 'Costo Mensual' : 'Costo Anual'
}

function viewDetails(appId: string) {
  window.location.href = `/applications/${appId}`
}

function manageUsers(app: any) {
  // Navegar a la vista de gestión de usuarios de la suscripción
  router.push(`/applications/${app.id}/users`)
}

function openApplication(app: any) {
  if (app.url) {
    window.open(app.url, '_blank', 'noopener,noreferrer')
  }
}

async function confirmCancelSubscription(subscription: any) {
  const confirmed = await confirm({
    title: 'Cancelar Suscripción',
    message: `¿Estás seguro de que deseas cancelar tu suscripción a ${subscription.application.name}?`,
    details: 'Perderás el acceso a esta aplicación al final del período actual.',
    type: 'warning',
    confirmText: 'Sí, cancelar',
    cancelText: 'No, mantener',
  })
  
  if (confirmed) {
    await cancelSubscription(subscription.id)
  }
}

async function cancelSubscription(subscriptionId: string) {
  try {
    const result = await subscriptionsStore.cancelSubscription(subscriptionId, false)
    
    if (result) {
      // Recargar suscripciones para actualizar la lista
      await loadSubscriptions()
      
      // Mostrar mensaje de éxito con modal
      await confirm({
        title: 'Suscripción Cancelada',
        message: 'Tu suscripción se ha cancelado correctamente.',
        details: 'Se mantendrá activa hasta el final del período actual.',
        type: 'success',
        confirmText: 'Entendido',
        showCancel: false,
      } as any)
    }
  } catch (err: any) {
    console.error('Error al cancelar suscripción:', err)
    await confirm({
      title: 'Error',
      message: 'No se pudo cancelar la suscripción',
      details: err.message || 'Por favor, inténtalo de nuevo más tarde.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    } as any)
  }
}

async function confirmReactivateSubscription(subscription: any) {
  const confirmed = await confirm({
    title: 'Reactivar Suscripción',
    message: `¿Deseas reactivar tu suscripción a ${subscription.application.name}?`,
    details: 'Tu suscripción continuará renovándose automáticamente.',
    type: 'question',
    confirmText: 'Sí, reactivar',
    cancelText: 'Cancelar',
  })
  
  if (confirmed) {
    await reactivateSubscription(subscription.id)
  }
}

async function reactivateSubscription(subscriptionId: string) {
  try {
    const reactivated = await subscriptionsStore.reactivateSubscription(subscriptionId)
    
    if (reactivated) {
      // Recargar suscripciones para actualizar la lista
      await loadSubscriptions()
      
      // Mostrar mensaje de éxito con modal
      await confirm({
        title: '¡Suscripción Reactivada!',
        message: 'Tu suscripción se ha reactivado correctamente.',
        details: 'Continuará renovándose automáticamente.',
        type: 'success',
        confirmText: 'Entendido',
        showCancel: false,
      } as any)
    }
  } catch (err: any) {
    console.error('Error al reactivar suscripción:', err)
    await confirm({
      title: 'Error',
      message: 'No se pudo reactivar la suscripción',
      details: err.message || 'Por favor, inténtalo de nuevo más tarde.',
      type: 'error',
      confirmText: 'Cerrar',
      showCancel: false,
    } as any)
  }
}

// Load subscriptions on mount
onMounted(async () => {
  await loadSubscriptions()
  // Después de cargar, verificar si venimos de un checkout exitoso
  checkForCheckoutSuccess()
})
</script>

<style scoped>
.subscriptions-view {
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
.applications-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--vt-c-text-2);
  line-height: 1.5;
}

/* ============================================
   STATS CARDS
   ============================================ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
  max-width: 800px;
}

.stat-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.stat-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1;
  letter-spacing: -0.02em;
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
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

/* ============================================
   SUBSCRIPTIONS GRID - APPLE STYLE
   ============================================ */
.subscriptions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.subscription-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.subscription-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  border-color: var(--color-border-hover);
}

/* Card Header */
.subscription-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 1.75rem 1.25rem 1.75rem;
  background: linear-gradient(180deg, var(--color-background) 0%, transparent 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.app-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.app-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.subscription-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.3;
  letter-spacing: -0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subscription-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
  font-weight: 500;
}

.header-right {
  flex-shrink: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-active {
  background: rgba(52, 199, 89, 0.12);
  color: rgb(48, 176, 79);
}

.status-active .status-indicator {
  background: rgb(52, 199, 89);
  box-shadow: 0 0 8px rgba(52, 199, 89, 0.6);
}

.status-pending {
  background: rgba(255, 159, 10, 0.12);
  color: rgb(227, 142, 9);
}

.status-pending .status-indicator {
  background: rgb(255, 159, 10);
  box-shadow: 0 0 8px rgba(255, 159, 10, 0.6);
}

.status-cancelled {
  background: rgba(255, 69, 58, 0.12);
  color: rgb(227, 62, 52);
}

.status-cancelled .status-indicator {
  background: rgb(255, 69, 58);
  box-shadow: 0 0 8px rgba(255, 69, 58, 0.6);
}

.status-expired {
  background: rgba(142, 142, 147, 0.12);
  color: rgb(124, 124, 128);
}

.status-expired .status-indicator {
  background: rgb(142, 142, 147);
  box-shadow: 0 0 8px rgba(142, 142, 147, 0.6);
}

/* Pricing Section */
.subscription-pricing {
  padding: 0 1.75rem 1.5rem 1.75rem;
  text-align: center;
}

.price-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.375rem;
  margin-bottom: 0.625rem;
}

.price-amount {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1;
  letter-spacing: -0.03em;
}

.price-period {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--vt-c-text-2);
}

.price-next {
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
  font-weight: 500;
}

/* Alert Section */
.subscription-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  background: linear-gradient(135deg, rgba(255, 159, 10, 0.08) 0%, rgba(255, 159, 10, 0.04) 100%);
  border-top: 1px solid rgba(255, 159, 10, 0.15);
  border-bottom: 1px solid rgba(255, 159, 10, 0.15);
  font-size: 0.875rem;
  color: rgb(227, 142, 9);
  font-weight: 500;
  line-height: 1.5;
}

.subscription-alert svg {
  flex-shrink: 0;
  color: rgb(255, 159, 10);
}

.subscription-alert strong {
  font-weight: 600;
}

/* Users Section */
.subscription-users {
  padding: 1.5rem 1.75rem;
  background: var(--color-background-mute);
  border-top: 1px solid var(--color-border);
}

.users-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.users-header svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.users-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-heading);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.users-stats {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.users-current {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1;
  letter-spacing: -0.02em;
}

.users-separator {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--vt-c-text-2);
}

.users-max {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vt-c-text-2);
}

.users-available {
  flex-shrink: 0;
}

.available-badge {
  display: inline-flex;
  padding: 0.5rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
  background: rgba(52, 199, 89, 0.12);
  color: rgb(48, 176, 79);
  border: 1px solid rgba(52, 199, 89, 0.2);
}

.available-badge.warning {
  background: rgba(255, 159, 10, 0.12);
  color: rgb(227, 142, 9);
  border-color: rgba(255, 159, 10, 0.2);
}

.available-badge.critical {
  background: rgba(255, 69, 58, 0.12);
  color: rgb(227, 62, 52);
  border-color: rgba(255, 69, 58, 0.2);
}

/* Details Section */
.subscription-details {
  padding: 1.25rem 1.75rem;
  border-top: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vt-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-heading);
}

/* Actions Section */
.subscription-actions {
  padding: 1.5rem 1.75rem;
  border-top: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 0.75rem;
  background: var(--color-background);
}

.action-btn {
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  letter-spacing: -0.01em;
}

.action-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.action-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-primary:active {
  transform: translateY(0);
}

.action-secondary {
  background: var(--color-background-soft);
  color: var(--color-heading);
  border: 1px solid var(--color-border);
}

.action-secondary:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

.action-danger {
  background: rgba(255, 69, 58, 0.08);
  color: rgb(227, 62, 52);
  border: 1px solid rgba(255, 69, 58, 0.2);
}

.action-danger:hover {
  background: rgba(255, 69, 58, 0.12);
  border-color: rgba(255, 69, 58, 0.3);
  transform: translateY(-1px);
}

.action-success {
  background: rgba(52, 199, 89, 0.08);
  color: rgb(48, 176, 79);
  border: 1px solid rgba(52, 199, 89, 0.2);
}

.action-success:hover {
  background: rgba(52, 199, 89, 0.12);
  border-color: rgba(52, 199, 89, 0.3);
  transform: translateY(-1px);
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

.btn-action-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-action-danger:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: var(--color-background-soft);
  border: 2px dashed var(--color-border);
  border-radius: 20px;
  margin-bottom: 3rem;
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

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1023px) {
  .applications-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .subscriptions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .subscription-card-header {
    padding: 1.5rem 1.25rem 1rem 1.25rem;
  }

  .app-logo {
    width: 48px;
    height: 48px;
  }

  .subscription-title {
    font-size: 1rem;
  }

  .subscription-pricing {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }

  .price-amount {
    font-size: 2.5rem;
  }

  .subscription-alert {
    padding: 0.875rem 1.25rem;
  }

  .subscription-users {
    padding: 1.25rem;
  }

  .subscription-details {
    padding: 1rem 1.25rem;
    grid-template-columns: 1fr;
  }

  .subscription-actions {
    padding: 1.25rem;
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
}

@media (max-width: 480px) {
  .subscription-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-right {
    width: 100%;
  }

  .status-badge {
    width: 100%;
    justify-content: center;
  }

  .price-amount {
    font-size: 2rem;
  }

  .users-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

/* ============================================
   SUCCESS MODAL - ESTILO APPLE
   ============================================ */

/* Overlay */
.success-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* Modal Container */
.success-modal {
  background: var(--color-background-soft);
  border-radius: 28px;
  padding: 3rem 2.5rem;
  max-width: 480px;
  width: 100%;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

/* Success Icon Container */
.success-icon-container {
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  position: relative;
}

.success-icon {
  width: 100%;
  height: 100%;
}

.success-circle {
  stroke: #10b981;
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  transform-origin: 50% 50%;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.success-check {
  stroke: #10b981;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

/* Title */
.success-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

/* Message */
.success-message {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  margin: 0 0 2.5rem 0;
  max-width: 380px;
}

.success-message strong {
  color: var(--color-heading);
  font-weight: 600;
}

/* Button */
.success-button {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 16px;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 
    0 8px 16px rgba(16, 185, 129, 0.3),
    0 0 0 1px rgba(16, 185, 129, 0.1);
  position: relative;
  overflow: hidden;
}

.success-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.success-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 24px rgba(16, 185, 129, 0.4),
    0 0 0 1px rgba(16, 185, 129, 0.2);
}

.success-button:hover::before {
  opacity: 1;
}

.success-button:active {
  transform: translateY(0);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Responsive Modal */
@media (max-width: 640px) {
  .success-modal-overlay {
    padding: 1.5rem;
  }

  .success-modal {
    padding: 2.5rem 2rem;
    border-radius: 24px;
  }

  .success-icon-container {
    width: 100px;
    height: 100px;
    margin-bottom: 1.5rem;
  }

  .success-title {
    font-size: 1.75rem;
  }

  .success-message {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .success-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    border-radius: 14px;
  }
}

</style>

