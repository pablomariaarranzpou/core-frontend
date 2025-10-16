import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import httpService from '@/services/http'

export interface Subscription {
  id: string
  accountId: string
  applicationId?: string // ID de la aplicación
  planId: string
  planName: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  stripeCustomerId?: string
  stripeLatestInvoiceId?: string
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' | 'INCOMPLETE' | 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  canceledAt?: string | null
  trialStart?: string
  trialEnd?: string
  trialEndsAt?: string | null
  amount: number
  currency: string
  interval: 'month' | 'year'
  quantity: number
  maxUsers?: number | null // null o undefined = ilimitado (viene del backend en la suscripción)
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  // Información de usuarios (viene del backend)
  currentUsers?: number // Número actual de usuarios activos
  hasUserLimit?: boolean // Si tiene límite de usuarios
  usersRemaining?: number // Usuarios disponibles para añadir
  // Relación con la aplicación (viene del backend)
  application?: {
    id: string
    name: string
    description?: string
    longDescription?: string
    slug?: string
    url?: string
    apiUrl?: string
    logo?: string
    logoDark?: string
    screenshots?: string[]
    isActive?: boolean
    isHidden?: boolean
    createdAt?: string
    updatedAt?: string
  }
  // Usuarios asociados a la suscripción
  subscriptionUsers?: Array<{
    id: string
    userId: string
    subscriptionId: string
    createdAt: string
  }>
  // Detalles del plan (si vienen del backend)
  plan?: {
    id: string
    name: string
    description?: string
    price: number
    currency: string
    interval: 'month' | 'year'
    features?: string[]
    maxUsers?: number // null o undefined = ilimitado
    maxApplications?: number
    maxStorage?: number
    popular?: boolean
    createdAt?: string
    updatedAt?: string
  }
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  maxUsers?: number
  maxApplications?: number
  maxStorage?: number
  popular?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSubscriptionDto {
  planId: string
  quantity?: number
  trialDays?: number
}

export interface UpdateSubscriptionDto {
  planId?: string
  quantity?: number
  cancelAtPeriodEnd?: boolean
}

// DTO para crear sesión de checkout
// Solo se requiere planId y applicationId
// El backend obtiene stripePriceId, maxUsers, etc. desde el plan
export interface CreateCheckoutSessionDto {
  applicationId: string
  planId: string
  successUrl?: string
  cancelUrl?: string
}

export interface CheckoutSession {
  sessionId: string
  checkoutUrl: string
}

export interface PaginatedSubscriptions {
  data: Subscription[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  // State
  const subscriptions = ref<Subscription[]>([])
  const currentSubscription = ref<Subscription | null>(null)
  const plans = ref<SubscriptionPlan[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Computed
  const activeSubscriptions = computed(() =>
    subscriptions.value.filter((sub) => 
      sub.status.toLowerCase() === 'active' || sub.status === 'ACTIVE'
    )
  )

  const trialingSubscriptions = computed(() =>
    subscriptions.value.filter((sub) => 
      sub.status.toLowerCase() === 'trialing' || sub.status === 'TRIALING'
    )
  )

  const canceledSubscriptions = computed(() =>
    subscriptions.value.filter((sub) => 
      sub.status.toLowerCase() === 'canceled' || sub.status === 'CANCELED'
    )
  )

  const hasActiveSubscription = computed(() => activeSubscriptions.value.length > 0)

  const totalMonthlyRevenue = computed(() => {
    return subscriptions.value
      .filter((sub) => sub.status === 'active' && sub.interval === 'month')
      .reduce((total, sub) => total + sub.amount * sub.quantity, 0)
  })

  const totalYearlyRevenue = computed(() => {
    return subscriptions.value
      .filter((sub) => sub.status === 'active' && sub.interval === 'year')
      .reduce((total, sub) => total + sub.amount * sub.quantity, 0)
  })

  // Actions
  async function fetchSubscriptions(page = 1, limit = 100) {
    loading.value = true
    error.value = null

    try {
      // Intentar obtener suscripciones del backend
      const response = await httpService.get<any>(`/subscriptions?page=${page}&limit=${limit}`)

      // El backend puede devolver un array directo o un objeto paginado
      if (Array.isArray(response)) {
        // Array directo
        subscriptions.value = response
        pagination.value = {
          page: 1,
          limit: response.length,
          total: response.length,
          totalPages: 1,
        }
      } else {
        // Objeto paginado
        subscriptions.value = response.data || response.subscriptions || []
        pagination.value = {
          page: response.page || 1,
          limit: response.limit || limit,
          total: response.total || subscriptions.value.length,
          totalPages: response.totalPages || 1,
        }
      }

      console.log('✅ Subscriptions fetched:', subscriptions.value.length)
      return subscriptions.value
    } catch (err: any) {
      error.value = err.message || 'Error al cargar suscripciones'
      console.error('❌ Error fetching subscriptions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSubscriptionById(id: string) {
    loading.value = true
    error.value = null

    try {
      // Siempre hacer petición real al backend
      const response = await httpService.get<Subscription>(`/subscriptions/${id}`)
      currentSubscription.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar suscripción'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentSubscription() {
    loading.value = true
    error.value = null

    try {
      // Siempre hacer petición real al backend
      const response = await httpService.get<Subscription>('/subscriptions/current')
      currentSubscription.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar suscripción actual'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPlans() {
    loading.value = true
    error.value = null

    try {
      // En desarrollo, retornar array vacío ya que los planes vienen de cada aplicación
      // Los planes se obtienen llamando a la API de cada aplicación (application.apiUrl)
      if (import.meta.env.DEV) {
        console.warn('fetchPlans() en desarrollo: Los planes deben obtenerse de cada aplicación individual')
        plans.value = []
        return []
      }

      // En producción, hacer petición real al backend si existe un endpoint global
      const response = await httpService.get<SubscriptionPlan[]>('/subscriptions/plans')
      plans.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar planes'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSubscription(data: CreateSubscriptionDto) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.post<Subscription>('/subscriptions', data)
      subscriptions.value.push(response)
      currentSubscription.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al crear suscripción'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSubscription(id: string, data: UpdateSubscriptionDto) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.patch<Subscription>(`/subscriptions/${id}`, data)

      const index = subscriptions.value.findIndex((sub) => sub.id === id)
      if (index !== -1) {
        subscriptions.value[index] = response
      }

      if (currentSubscription.value?.id === id) {
        currentSubscription.value = response
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar suscripción'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelSubscription(id: string, immediately = false) {
    loading.value = true
    error.value = null

    try {
      // El backend espera cancelAtPeriodEnd, no immediately
      // Si immediately = true, entonces cancelAtPeriodEnd = false
      const response = await httpService.post<Subscription>(`/subscriptions/${id}/cancel`, {
        cancelAtPeriodEnd: !immediately,
      })

      const index = subscriptions.value.findIndex((sub) => sub.id === id)
      if (index !== -1) {
        subscriptions.value[index] = response
      }

      if (currentSubscription.value?.id === id) {
        currentSubscription.value = response
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cancelar suscripción'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function reactivateSubscription(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.post<Subscription>(`/subscriptions/${id}/reactivate`, {})

      const index = subscriptions.value.findIndex((sub) => sub.id === id)
      if (index !== -1) {
        subscriptions.value[index] = response
      }

      if (currentSubscription.value?.id === id) {
        currentSubscription.value = response
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al reactivar suscripción'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changePlan(subscriptionId: string, newPlanId: string) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.post<Subscription>(
        `/subscriptions/${subscriptionId}/change-plan`,
        {
          planId: newPlanId,
        }
      )

      const index = subscriptions.value.findIndex((sub) => sub.id === subscriptionId)
      if (index !== -1) {
        subscriptions.value[index] = response
      }

      if (currentSubscription.value?.id === subscriptionId) {
        currentSubscription.value = response
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cambiar plan'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCheckoutSession(data: CreateCheckoutSessionDto) {
    loading.value = true
    error.value = null

    try {
      console.log('🛒 Creating checkout session with data:', data)
      
      // Solo enviamos applicationId y planId
      // El backend obtiene stripePriceId desde el plan
      const response = await httpService.post<CheckoutSession>('/subscriptions/checkout/create-session', {
        applicationId: data.applicationId,
        planId: data.planId,
        successUrl: data.successUrl || `${window.location.origin}/subscriptions?checkout=success`,
        cancelUrl: data.cancelUrl || window.location.href,
      })

      console.log('📦 Backend response:', response)

      return response
    } catch (err: any) {
      console.error('❌ Error in createCheckoutSession:', err)
      error.value = err.message || 'Error al crear sesión de checkout'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSubscriptionUsers(subscriptionId: string) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<any[]>(`/subscriptions/${subscriptionId}/users`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar usuarios de la suscripción'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function reset() {
    subscriptions.value = []
    currentSubscription.value = null
    plans.value = []
    loading.value = false
    error.value = null
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }
  }

  return {
    // State
    subscriptions,
    currentSubscription,
    plans,
    loading,
    error,
    pagination,
    // Computed
    activeSubscriptions,
    trialingSubscriptions,
    canceledSubscriptions,
    hasActiveSubscription,
    totalMonthlyRevenue,
    totalYearlyRevenue,
    // Actions
    fetchSubscriptions,
    fetchSubscriptionById,
    fetchCurrentSubscription,
    fetchPlans,
    createSubscription,
    createCheckoutSession,
    updateSubscription,
    cancelSubscription,
    reactivateSubscription,
    changePlan,
    fetchSubscriptionUsers,
    clearError,
    reset,
  }
})
