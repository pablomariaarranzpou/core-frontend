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
  const error = ref<string | null>(null)

  // Computed
  const applicationsCount = computed(() => applications.value.length)
  const marketplaceAppsCount = computed(() => marketplaceApps.value.length)
  const activeSubscriptionsCount = computed(() => 
    userSubscriptions.value.filter(sub => sub.status === 'ACTIVE').length
  )

  // Actions
  
  /**
   * Obtiene todas las aplicaciones disponibles (catálogo público)
   * Endpoint: GET /applications
   */
  async function fetchAllApplications() {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<Application[]>('/applications')
      marketplaceApps.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar aplicaciones del marketplace'
      throw err
    } finally {
      loading.value = false
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
  async function fetchUserApplications() {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<UserApplicationSubscription[]>('/accounts/applications')
      
      // Guardar toda la información de las suscripciones
      userSubscriptions.value = response
      
      // También mantener un array simple de aplicaciones para compatibilidad
      applications.value = response.map(sub => sub.application)
      
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

  function reset() {
    applications.value = []
    userSubscriptions.value = []
    marketplaceApps.value = []
    currentApplication.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    applications,
    userSubscriptions,
    marketplaceApps,
    currentApplication,
    loading,
    error,
    // Computed
    applicationsCount,
    marketplaceAppsCount,
    activeSubscriptionsCount,
    // Actions
    fetchAllApplications,
    fetchUserApplications,
    fetchApplicationById,
    fetchApplicationBySlug,
    clearError,
    reset,
  }
})
