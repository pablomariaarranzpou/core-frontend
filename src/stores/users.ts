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

  // Computed
  const activeUsers = computed(() => users.value?.filter((user) => user.isActive) || [])

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
  async function fetchUsers(page = 1, limit = 10) {
    loading.value = true
    error.value = null

    try {
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

  function clearError() {
    error.value = null
  }

  function reset() {
    users.value = []
    currentUser.value = null
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
    users,
    currentUser,
    loading,
    error,
    pagination,
    // Computed
    activeUsers,
    inactiveUsers,
    adminUsers,
    usersByRole,
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    inviteUser,
    changeUserRole,
    clearError,
    reset,
  }
})
