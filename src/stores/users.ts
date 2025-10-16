import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import httpService from '@/services/http'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user' | 'owner'
  isActive: boolean
  avatar?: string | null
  phone?: string | null
  lastLoginAt?: string | null
  createdAt: string
  subscriptionUsers?: any[]
}

export interface InviteUserDto {
  email: string
  role: 'admin' | 'user' | 'owner'
  firstName?: string
  lastName?: string
  phone?: string
}

export interface CreateUserDto {
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user' | 'owner'
  phone?: string
}

export interface UpdateUserDto {
  email?: string
  firstName?: string
  lastName?: string
  role?: 'admin' | 'user' | 'owner'
  isActive?: boolean
  avatar?: string | null
  phone?: string | null
}

export interface PaginatedUsers {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  
  // Cache control
  const lastFetchUsers = ref<number | null>(null)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  // Computed
  const activeUsers = computed(() => users.value?.filter((user) => user.isActive) || [])
  
  const isCacheValid = computed(() => {
    if (!lastFetchUsers.value) return false
    return Date.now() - lastFetchUsers.value < CACHE_DURATION
  })

  const inactiveUsers = computed(() => users.value?.filter((user) => !user.isActive) || [])

  const adminUsers = computed(() => users.value?.filter((user) => user.role === 'admin') || [])

  const usersByRole = computed(() => {
    const byRole: Record<string, User[]> = {}
    if (!users.value) return byRole
    
    users.value.forEach((user) => {
      if (!byRole[user.role]) {
        byRole[user.role] = []
      }
      byRole[user.role]!.push(user)
    })
    return byRole
  })

  // Actions
  async function fetchUsers(page = 1, limit = 10, skipCache = false) {
    // Si tenemos datos en caché válidos y no queremos saltarlo, retornar del caché
    if (!skipCache && isCacheValid.value && users.value.length > 0) {
      console.log('✅ Usando usuarios desde caché')
      return Array.isArray(users.value) ? {
        data: users.value,
        page: pagination.value.page,
        limit: pagination.value.limit,
        total: pagination.value.total,
        totalPages: pagination.value.totalPages,
      } : users.value
    }

    // Si ya está cargando, esperar a que termine
    if (loading.value) {
      console.log('⏳ Ya hay una petición de usuarios en curso, esperando...')
      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      console.log('✅ Petición de usuarios completada, usando datos cargados')
      return Array.isArray(users.value) ? {
        data: users.value,
        page: pagination.value.page,
        limit: pagination.value.limit,
        total: pagination.value.total,
        totalPages: pagination.value.totalPages,
      } : users.value
    }

    loading.value = true
    error.value = null

    try {
      console.log('🔄 Cargando usuarios desde API...')
      const response = await httpService.get<User[] | PaginatedUsers>(
        `/users?page=${page}&limit=${limit}`
      )

      console.log('📊 Respuesta de /users:', response)

      // Si la respuesta es un array directamente (sin paginación)
      if (Array.isArray(response)) {
        console.log('✅ Respuesta es un array, procesando como lista simple')
        users.value = response
        pagination.value = {
          page: 1,
          limit: response.length,
          total: response.length,
          totalPages: 1,
        }
        lastFetchUsers.value = Date.now()
        return {
          data: response,
          page: 1,
          limit: response.length,
          total: response.length,
          totalPages: 1,
        }
      }

      // Si la respuesta tiene estructura paginada
      console.log('✅ Respuesta es paginada, procesando con estructura completa')
      users.value = response.data
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }
      
      lastFetchUsers.value = Date.now()

      return response
    } catch (err: any) {
      console.error('❌ Error al cargar usuarios:', err)
      error.value = err.message || 'Error al cargar usuarios'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUserById(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.get<User>(`/users/${id}`)
      currentUser.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cargar usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createUser(data: CreateUserDto) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.post<User>('/users', data)
      users.value.push(response)
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al crear usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: string, data: UpdateUserDto) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.patch<User>(`/users/${id}`, data)

      const index = users.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        users.value[index] = response
      }

      if (currentUser.value?.id === id) {
        currentUser.value = response
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id: string) {
    loading.value = true
    error.value = null

    try {
      await httpService.delete(`/users/${id}`)

      users.value = users.value.filter((user) => user.id !== id)

      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function inviteUser(data: InviteUserDto) {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.post<User>('/users/invite', data)
      users.value.push(response)
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al invitar usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changeUserRole(userId: string, role: 'admin' | 'user' | 'owner') {
    loading.value = true
    error.value = null

    try {
      const response = await httpService.patch<User>(`/users/${userId}`, { role })

      const index = users.value.findIndex((user) => user.id === userId)
      if (index !== -1) {
        users.value[index] = response
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Error al cambiar rol de usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Funciones de Avatar
  async function uploadAvatar(file: File): Promise<string> {
    loading.value = true
    error.value = null

    try {
      // 1. Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP, GIF)')
      }

      // 2. Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`La imagen no debe superar 5MB. Tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
      }

      // 3. Solicitar URL prefirmada
      const uploadData = await httpService.post<{ uploadUrl: string; fileUrl: string }>(
        '/users/profile/avatar/upload-url',
        {
          fileName: file.name,
          contentType: file.type,
        }
      )

      const { uploadUrl, fileUrl } = uploadData

      // 4. Subir archivo a S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error('Error al subir el archivo a S3')
      }

      // 5. Actualizar perfil con nueva URL
      await httpService.patch<User>('/users/profile', {
        avatar: fileUrl,
      })

      return fileUrl
    } catch (err: any) {
      error.value = err.message || 'Error al subir avatar'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeAvatar(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // Actualizar perfil sin avatar
      await httpService.patch<User>('/users/profile', {
        avatar: null,
      })
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar avatar'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utilidades para avatar
  function getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || ''
    const last = lastName?.charAt(0)?.toUpperCase() || ''
    return `${first}${last}` || '?'
  }

  function clearError() {
    error.value = null
  }
  
  function invalidateCache() {
    lastFetchUsers.value = null
  }

  function reset() {
    users.value = []
    currentUser.value = null
    loading.value = false
    error.value = null
    lastFetchUsers.value = null
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }
  }

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    pagination,
    lastFetchUsers,
    // Computed
    activeUsers,
    inactiveUsers,
    adminUsers,
    usersByRole,
    isCacheValid,
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    inviteUser,
    changeUserRole,
    uploadAvatar,
    removeAvatar,
    getInitials,
    clearError,
    invalidateCache,
    reset,
  }
})
