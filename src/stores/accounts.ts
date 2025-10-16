import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import httpService from '@/services/http'

// Interfaces basadas en el modelo real del backend
export interface User {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
  isActive: boolean
}

export interface Application {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Subscription {
  id: string
  status: string
  stripePriceId: string
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEndsAt?: string
  cancelAtPeriodEnd: boolean
  application: Application
}

export interface Account {
  id: string
  name: string
  phone?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  users?: User[]
  subscriptions?: Subscription[]
  billingInfo?: any
}

export interface CreateAccountDto {
  name: string
  phone?: string
}

export interface UpdateAccountDto {
  name?: string
  phone?: string
  isActive?: boolean
}

export interface PaginatedAccounts {
  data: Account[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const accounts = ref<Account[]>([])
  const currentAccount = ref<Account | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  
  // Cache control
  const lastFetchCurrentAccount = ref<number | null>(null)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  // Computed
  const activeAccounts = computed(() =>
    accounts.value.filter((account) => account.isActive)
  )
  
  const isCacheValid = computed(() => {
    if (!lastFetchCurrentAccount.value) return false
    return Date.now() - lastFetchCurrentAccount.value < CACHE_DURATION
  })

  const inactiveAccounts = computed(() =>
    accounts.value.filter((account) => !account.isActive)
  )

  // Actions
  async function fetchAccounts(page = 1, limit = 10) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<PaginatedAccounts>(
        `/accounts?page=${page}&limit=${limit}`
      )

      accounts.value = response.data
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar cuentas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAccountById(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<Account>(`/accounts/${id}`)
      currentAccount.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar cuenta'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentAccount(skipCache = false) {
    // Si tenemos datos en caché válidos y no queremos saltarlo, retornar del caché
    if (!skipCache && isCacheValid.value && currentAccount.value) {
      console.log('✅ Usando cuenta actual desde caché')
      return currentAccount.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<Account>('/accounts')
      currentAccount.value = response
      lastFetchCurrentAccount.value = Date.now()
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar cuenta actual'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createAccount(data: CreateAccountDto) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.post<Account>('/accounts', data)
      accounts.value.push(response)
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al crear cuenta'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAccount(data: UpdateAccountDto) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.patch<Account>('/accounts', data)

      // Actualizar la cuenta actual
      currentAccount.value = response

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar cuenta'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Funciones no implementadas en el backend actual
  // TODO: Implementar en el backend si se necesitan
  
  /*
  async function deleteAccount(id: string) {
    loading.value = true
    error.value = null

    try {
      await httpService.delete(`/accounts/${id}`)

      accounts.value = accounts.value.filter((account) => account.id !== id)

      if (currentAccount.value?.id === id) {
        currentAccount.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar cuenta'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAccountSettings(id: string, settings: Record<string, any>) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.patch<Account>(`/accounts/${id}/settings`, {
        settings,
      })

      const index = accounts.value.findIndex((account) => account.id === id)
      if (index !== -1) {
        accounts.value[index] = response
      }

      if (currentAccount.value?.id === id) {
        currentAccount.value = response
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar configuración'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadAccountLogo(id: string, file: File) {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await httpService.post<Account>(`/accounts/${id}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const index = accounts.value.findIndex((account) => account.id === id)
      if (index !== -1) {
        accounts.value[index] = response
      }

      if (currentAccount.value?.id === id) {
        currentAccount.value = response
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al subir logo'
      throw err
    } finally {
      loading.value = false
    }
  }
  */

  function clearError() {
    error.value = null
  }
  
  function invalidateCache() {
    lastFetchCurrentAccount.value = null
  }

  function reset() {
    accounts.value = []
    currentAccount.value = null
    loading.value = false
    error.value = null
    lastFetchCurrentAccount.value = null
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }
  }

  return {
    // State
    accounts,
    currentAccount,
    loading,
    error,
    pagination,
    lastFetchCurrentAccount,
    // Computed
    activeAccounts,
    inactiveAccounts,
    isCacheValid,
    // Actions
    fetchAccounts,
    fetchAccountById,
    fetchCurrentAccount,
    createAccount,
    updateAccount,
    clearError,
    invalidateCache,
    reset,
  }
})
