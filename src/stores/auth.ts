import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { signOut } from 'aws-amplify/auth'
import { http } from '@/services/http'

// Interfaces
interface User {
  id: string
  email: string
  username: string
  emailVerified?: boolean
  attributes?: Record<string, string>
  // Datos del backend
  firstName?: string
  lastName?: string
  fullName?: string
  role?: string
  avatar?: string
  phone?: string
  account?: {
    id: string
    name: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<number | null>(null)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const isCacheValid = computed(() => {
    if (!lastFetch.value) return false
    return Date.now() - lastFetch.value < CACHE_DURATION
  })

  // Acciones

  /**
   * Obtener el usuario actual - solo usa el backend (1 llamada)
   * El backend ya valida el token de Cognito y nos da toda la información
   */
  const getCurrentUserInfo = async (skipCache = false): Promise<User | null> => {
    // Si tenemos datos en caché válidos y no queremos saltarlo, retornar del caché
    if (!skipCache && isCacheValid.value && user.value) {
      console.log('✅ Usando datos de usuario desde caché')
      return user.value
    }

    try {
      // Solo 1 llamada al backend - el backend valida el token internamente
      const backendUser = await http.get('/auth/me')
      
      console.log('🔍 Respuesta del backend:', backendUser)
      
      // Mapear directamente desde el backend
      user.value = {
        id: backendUser.id,
        email: backendUser.email,
        username: backendUser.email.split('@')[0], // Derivar username del email
        emailVerified: true, // Si el backend responde, el email está verificado
        firstName: backendUser.firstName,
        lastName: backendUser.lastName,
        fullName: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
        role: backendUser.role,
        avatar: backendUser.avatar,
        phone: backendUser.phone,
        account: backendUser.account
      }
      
      console.log('✅ Usuario autenticado:', {
        email: user.value.email,
        name: user.value.fullName,
        role: user.value.role,
        account: user.value.account?.name
      })

      // Actualizar timestamp de última carga
      lastFetch.value = Date.now()

      return user.value
    } catch (err: any) {
      // Solo loguear si no es un error de "no autenticado"
      if (err.name !== 'UserUnAuthenticatedException' && err.status !== 401) {
        console.error('Error getting current user:', err)
      }
      user.value = null
      lastFetch.value = null
      return null
    }
  }
  
  /**
   * Obtener información del usuario desde el backend (alias para compatibilidad)
   */
  const fetchUserFromBackend = async (): Promise<void> => {
    await getCurrentUserInfo(true)
  }

  /**
   * Logout del usuario usando Amplify
   */
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await signOut()
      user.value = null
      return { success: true }
    } catch (err: any) {
      console.error('Error en logout:', err)
      error.value = err.message || 'Error al cerrar sesión'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Inicializar el store obteniendo el usuario actual
   */
  const initialize = async () => {
    loading.value = true
    try {
      const currentUser = await getCurrentUserInfo()
      if (currentUser) {
        console.log('✅ Usuario autenticado encontrado:', currentUser.email)
      }
      // No logueamos cuando no hay usuario - es normal en la página de login
    } catch (err: any) {
      // Solo loguear errores que no sean "no autenticado"
      if (err.name !== 'UserUnAuthenticatedException') {
        console.error('Error initializing auth:', err)
      }
      user.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Refrescar la información del usuario (siempre salta el caché)
   */
  const refreshUser = async () => {
    return await getCurrentUserInfo(true)
  }
  
  /**
   * Invalidar el caché manualmente
   */
  const invalidateCache = () => {
    lastFetch.value = null
  }

  /**
   * Verificar si el usuario está autenticado
   */
  const checkAuthState = async (): Promise<boolean> => {
    try {
      const currentUser = await getCurrentUserInfo()
      return !!currentUser
    } catch {
      return false
    }
  }

  return {
    // Estado
    user,
    loading,
    error,
    lastFetch,
    // Computed
    isAuthenticated,
    isCacheValid,
    // Acciones
    getCurrentUserInfo,
    fetchUserFromBackend,
    logout,
    initialize,
    refreshUser,
    invalidateCache,
    checkAuthState,
  }
})
