/**
 * Ejemplo de API Service usando el HTTP interceptor
 * 
 * Este archivo muestra cómo crear servicios de API específicos
 * que utilizan el servicio HTTP con JWT automático.
 */

import { http } from './http'

// Interfaces
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  active: boolean
}

export interface Application {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive'
  users: number
  color: string
  url?: string
}

export interface Subscription {
  id: number
  name: string
  price: string
  period: string
  status: string
  features: string[]
}

/**
 * Servicio de Usuarios
 */
export const userService = {
  /**
   * Obtener todos los usuarios
   */
  getAll: async (): Promise<User[]> => {
    return await http.get<User[]>('/users')
  },

  /**
   * Obtener un usuario por ID
   */
  getById: async (id: string): Promise<User> => {
    return await http.get<User>(`/users/${id}`)
  },

  /**
   * Crear un nuevo usuario
   */
  create: async (userData: Partial<User>): Promise<User> => {
    return await http.post<User>('/users', userData)
  },

  /**
   * Actualizar un usuario
   */
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    return await http.put<User>(`/users/${id}`, userData)
  },

  /**
   * Eliminar un usuario
   */
  delete: async (id: string): Promise<void> => {
    return await http.delete<void>(`/users/${id}`)
  },

  /**
   * Obtener el perfil del usuario actual
   */
  getProfile: async (): Promise<User> => {
    return await http.get<User>('/users/me')
  },

  /**
   * Actualizar el perfil del usuario actual
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return await http.patch<User>('/users/me', userData)
  },
}

/**
 * Servicio de Aplicaciones
 */
export const applicationService = {
  /**
   * Obtener todas las aplicaciones del usuario
   */
  getAll: async (): Promise<Application[]> => {
    return await http.get<Application[]>('/applications')
  },

  /**
   * Obtener una aplicación por ID
   */
  getById: async (id: number): Promise<Application> => {
    return await http.get<Application>(`/applications/${id}`)
  },

  /**
   * Instalar una nueva aplicación
   */
  install: async (appId: number): Promise<Application> => {
    return await http.post<Application>(`/applications/${appId}/install`)
  },

  /**
   * Desinstalar una aplicación
   */
  uninstall: async (id: number): Promise<void> => {
    return await http.delete<void>(`/applications/${id}`)
  },

  /**
   * Actualizar configuración de una aplicación
   */
  updateConfig: async (id: number, config: Record<string, any>): Promise<Application> => {
    return await http.patch<Application>(`/applications/${id}/config`, config)
  },

  /**
   * Obtener aplicaciones del marketplace
   */
  getMarketplace: async (): Promise<Application[]> => {
    return await http.get<Application[]>('/marketplace/applications')
  },
}

/**
 * Servicio de Suscripciones
 */
export const subscriptionService = {
  /**
   * Obtener la suscripción actual
   */
  getCurrent: async (): Promise<Subscription> => {
    return await http.get<Subscription>('/subscription/current')
  },

  /**
   * Obtener todos los planes disponibles
   */
  getPlans: async (): Promise<Subscription[]> => {
    return await http.get<Subscription[]>('/subscription/plans')
  },

  /**
   * Cambiar de plan
   */
  changePlan: async (planId: number): Promise<Subscription> => {
    return await http.post<Subscription>('/subscription/change', { planId })
  },

  /**
   * Cancelar suscripción
   */
  cancel: async (): Promise<void> => {
    return await http.post<void>('/subscription/cancel')
  },

  /**
   * Obtener historial de facturas
   */
  getInvoices: async (): Promise<any[]> => {
    return await http.get<any[]>('/subscription/invoices')
  },

  /**
   * Descargar factura
   */
  downloadInvoice: async (invoiceId: string): Promise<Blob> => {
    const response = await fetch(`/subscription/invoices/${invoiceId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    return await response.blob()
  },
}

/**
 * Servicio de Cuenta
 */
export const accountService = {
  /**
   * Obtener información de la cuenta
   */
  getInfo: async (): Promise<any> => {
    return await http.get('/account')
  },

  /**
   * Actualizar información de la cuenta
   */
  update: async (accountData: any): Promise<any> => {
    return await http.put('/account', accountData)
  },

  /**
   * Actualizar configuración
   */
  updateSettings: async (settings: any): Promise<any> => {
    return await http.patch('/account/settings', settings)
  },
}

/**
 * Ejemplo de uso en un componente Vue:
 * 
 * <script setup lang="ts">
 * import { ref, onMounted } from 'vue'
 * import { userService } from '@/services/api'
 * 
 * const users = ref([])
 * const loading = ref(false)
 * const error = ref(null)
 * 
 * const fetchUsers = async () => {
 *   loading.value = true
 *   error.value = null
 *   try {
 *     users.value = await userService.getAll()
 *   } catch (err) {
 *     error.value = err.message
 *   } finally {
 *     loading.value = false
 *   }
 * }
 * 
 * onMounted(() => {
 *   fetchUsers()
 * })
 * </script>
 */
