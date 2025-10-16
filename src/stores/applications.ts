import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import httpService from '@/services/http'

// Interfaces basadas en el modelo real del backend

// Aplicación básica (catálogo público)
export interface Application {
  id: string
  name: string
  slug: string
  description?: string
  longDescription?: string
  url?: string
  apiUrl?: string
  logo?: string
  logoDark?: string
  screenshots?: string[]
  isActive: boolean
  isHidden: boolean
  createdAt: string
  updatedAt: string
  subscriptionCount?: number
}

// Usuario asignado a una suscripción
export interface SubscriptionUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

// Suscripción completa con aplicación y usuarios asignados
export interface UserApplicationSubscription {
  subscriptionId: string
  application: Application
  stripePriceId: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEndsAt?: string
  cancelAtPeriodEnd: boolean
  assignedUsers?: SubscriptionUser[] // Solo para owner/admin
  assignedAt?: string // Solo para usuarios normales
}

// Para uso interno (staff)
export interface ApplicationWithSubscriptions extends Application {
  subscriptions?: {
    id: string
    account: {
      id: string
      name: string
    }
  }[]
}

export const useApplicationsStore = defineStore('applications', () => {
  // State
  const applications = ref<Application[]>([])
  const userSubscriptions = ref<UserApplicationSubscription[]>([])
  const marketplaceApps = ref<Application[]>([])
  const currentApplication = ref<Application | null>(null)
  const loading = ref(false)
  const loadingMarketplace = ref(false)
  const error = ref<string | null>(null)
  
  // Cache control
  const lastFetchUserApps = ref<number | null>(null)
  const lastFetchMarketplace = ref<number | null>(null)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  // Computed
  const applicationsCount = computed(() => applications.value.length)
  const marketplaceAppsCount = computed(() => marketplaceApps.value.length)
  const activeSubscriptionsCount = computed(() => 
    userSubscriptions.value.filter(sub => sub.status === 'ACTIVE').length
  )
  const isUserAppsCacheValid = computed(() => {
    if (!lastFetchUserApps.value) return false
    return Date.now() - lastFetchUserApps.value < CACHE_DURATION
  })
  const isMarketplaceCacheValid = computed(() => {
    if (!lastFetchMarketplace.value) return false
    return Date.now() - lastFetchMarketplace.value < CACHE_DURATION
  })

  // Actions
  
  /**
   * Obtiene todas las aplicaciones disponibles (catálogo público)
   * Endpoint: GET /applications
   */
  async function fetchAllApplications(skipCache = false) {
    // Si tenemos datos en caché válidos y no queremos saltarlo, retornar del caché
    if (!skipCache && isMarketplaceCacheValid.value && marketplaceApps.value.length > 0) {
      console.log('✅ Usando aplicaciones del marketplace desde caché')
      return marketplaceApps.value
    }

    // Si ya está cargando, esperar a que termine en lugar de hacer otra llamada
    if (loadingMarketplace.value) {
      console.log('⏳ Ya hay una petición de marketplace en curso, esperando...')
      while (loadingMarketplace.value) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      console.log('✅ Petición de marketplace completada, usando datos cargados')
      return marketplaceApps.value
    }

    loadingMarketplace.value = true
    error.value = null

    try {
      console.log('🔄 Cargando marketplace desde API...')
      const response = await httpService.get<Application[]>('/applications')
      marketplaceApps.value = response
      lastFetchMarketplace.value = Date.now()
      console.log(`✅ ${response.length} apps del marketplace cargadas y en caché`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar aplicaciones del marketplace'
      throw err
    } finally {
      loadingMarketplace.value = false
    }
  }

  /**
   * Obtiene las aplicaciones del usuario actual (desde su cuenta)
   * Endpoint: GET /accounts/applications
   * Devuelve información completa de suscripciones incluyendo:
   * - Aplicación
   * - Estado de suscripción
   * - Periodo actual
   * - Usuarios asignados (para owner/admin)
   */
  async function fetchUserApplications(skipCache = false) {
    // Si tenemos datos en caché válidos y no queremos saltarlo, retornar del caché
    if (!skipCache && isUserAppsCacheValid.value && userSubscriptions.value.length > 0) {
      console.log('✅ Usando aplicaciones del usuario desde caché')
      return userSubscriptions.value
    }

    // Si ya está cargando, esperar a que termine en lugar de hacer otra llamada
    if (loading.value) {
      console.log('⏳ Ya hay una petición en curso, esperando...')
      // Esperar hasta que loading sea false
      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      // Retornar los datos que ya se cargaron
      console.log('✅ Petición completada, usando datos cargados')
      return userSubscriptions.value
    }

    loading.value = true
    error.value = null

    try {
      console.log('🔄 Cargando aplicaciones del usuario desde API...')
      const response = await httpService.get<UserApplicationSubscription[]>('/accounts/applications')
      
      // Guardar toda la información de las suscripciones
      userSubscriptions.value = response
      
      // También mantener un array simple de aplicaciones para compatibilidad
      applications.value = response.map(sub => sub.application)
      
      lastFetchUserApps.value = Date.now()
      
      console.log(`✅ ${response.length} aplicaciones cargadas y en caché`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar aplicaciones del usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene una aplicación por ID
   * Endpoint: GET /applications/:id
   */
  async function fetchApplicationById(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<Application>(`/applications/${id}`)
      currentApplication.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar aplicación'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene una aplicación por slug
   * Endpoint: GET /applications/slug/:slug
   */
  async function fetchApplicationBySlug(slug: string) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<Application>(`/applications/slug/${slug}`)
      currentApplication.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar aplicación'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }
  
  function invalidateCache() {
    lastFetchUserApps.value = null
    lastFetchMarketplace.value = null
  }

  function reset() {
    applications.value = []
    userSubscriptions.value = []
    marketplaceApps.value = []
    currentApplication.value = null
    loading.value = false
    loadingMarketplace.value = false
    error.value = null
    lastFetchUserApps.value = null
    lastFetchMarketplace.value = null
  }

  return {
    // State
    applications,
    userSubscriptions,
    marketplaceApps,
    currentApplication,
    loading,
    loadingMarketplace,
    error,
    lastFetchUserApps,
    lastFetchMarketplace,
    // Computed
    applicationsCount,
    marketplaceAppsCount,
    activeSubscriptionsCount,
    isUserAppsCacheValid,
    isMarketplaceCacheValid,
    // Actions
    fetchAllApplications,
    fetchUserApplications,
    fetchApplicationById,
    fetchApplicationBySlug,
    clearError,
    invalidateCache,
    reset,
  }
})
