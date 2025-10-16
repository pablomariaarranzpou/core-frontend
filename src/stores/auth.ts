import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUser, signOut, fetchUserAttributes, type AuthUser } from 'aws-amplify/auth'
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

  // Computed
  const isAuthenticated = computed(() => !!user.value)

  // Funciones auxiliares
  const mapAmplifyUserToUser = (authUser: AuthUser, attributes?: Record<string, string | undefined>): User => {
    return {
      id: authUser.userId,
      email: attributes?.email || authUser.signInDetails?.loginId || '',
      username: attributes?.preferred_username || authUser.username,
      emailVerified: attributes?.email_verified === 'true',
      attributes: attributes as Record<string, string> | undefined,
    }
  }

  // Acciones

  /**
   * Obtener información del usuario desde el backend
   */
  const fetchUserFromBackend = async (): Promise<void> => {
    try {
      const backendUser = await http.get('/auth/me')
      
      // Actualizar el usuario con los datos del backend
      if (user.value) {
        user.value.firstName = backendUser.firstName
        user.value.lastName = backendUser.lastName
        user.value.fullName = `${backendUser.firstName} ${backendUser.lastName}`.trim()
        user.value.role = backendUser.role
        user.value.account = backendUser.account
        
        console.log('✅ Datos del usuario obtenidos del backend:', {
          firstName: user.value.firstName,
          lastName: user.value.lastName,
          fullName: user.value.fullName,
          role: user.value.role,
          account: user.value.account?.name
        })
      }
    } catch (err) {
      console.error('Error obteniendo datos del usuario desde backend:', err)
    }
  }

  /**
   * Obtener el usuario actual de Amplify
   */
  const getCurrentUserInfo = async (): Promise<User | null> => {
    try {
      const authUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()

      const mappedUser = mapAmplifyUserToUser(authUser, attributes)
      user.value = mappedUser

      // Obtener datos adicionales del backend
      await fetchUserFromBackend()

      return user.value
    } catch (err: any) {
      // Solo loguear si no es un error de "no autenticado"
      if (err.name !== 'UserUnAuthenticatedException') {
        console.error('Error getting current user:', err)
      }
      user.value = null
      return null
    }
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
   * Refrescar la información del usuario
   */
  const refreshUser = async () => {
    return await getCurrentUserInfo()
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
    // Computed
    isAuthenticated,
    // Acciones
    getCurrentUserInfo,
    fetchUserFromBackend,
    logout,
    initialize,
    refreshUser,
    checkAuthState,
  }
})
