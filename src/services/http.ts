/**
 * Servicio HTTP con interceptor JWT usando Amplify Auth
 * 
 * Este servicio proporciona funciones para hacer peticiones HTTP
 * que automáticamente incluyen el token JWT de Amplify en los headers.
 */

import { fetchAuthSession } from 'aws-amplify/auth'
import config from '@/config'

// Configuración de la API desde config centralizado
const API_BASE_URL = config.api.baseUrl

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

/**
 * Obtener el token de acceso de Amplify Auth
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession()
    return session.tokens?.accessToken?.toString() || null
  } catch (error) {
    console.error('Error obteniendo token de acceso:', error)
    return null
  }
}

/**
 * Realizar una petición HTTP con JWT automático usando Amplify
 */
async function fetchWithAuth(
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options

  // Construir URL completa
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  // Construir headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }

  // Añadir token JWT si la petición requiere autenticación
  if (requiresAuth) {
    const token = await getAccessToken()
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    } else {
      throw new Error('No hay token de autenticación disponible')
    }
  }

  // Realizar petición
  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    })

    // Si es 401, el token expiró o no es válido
    if (response.status === 401 && requiresAuth) {
      // Intentar obtener un nuevo token (Amplify maneja el refresh automáticamente)
      const newToken = await getAccessToken()
      if (newToken) {
        requestHeaders['Authorization'] = `Bearer ${newToken}`
        return await fetch(url, {
          ...restOptions,
          headers: requestHeaders,
        })
      } else {
        throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.')
      }
    }

    return response
  } catch (error) {
    console.error('Error en petición HTTP:', error)
    throw error
  }
}

/**
 * Realizar petición GET
 */
export async function httpGet<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    ...options,
    method: 'GET',
  })

  if (!response.ok) {
    const errorText = await response.text()
    const error: any = new Error(errorText || `Error ${response.status}: ${response.statusText}`)
    error.statusCode = response.status
    error.status = response.status
    throw error
  }

  return await response.json()
}

/**
 * Realizar petición POST
 */
export async function httpPost<T = any>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    const error: any = new Error(errorText || `Error ${response.status}: ${response.statusText}`)
    error.statusCode = response.status
    error.status = response.status
    throw error
  }

  // Algunas respuestas POST pueden no tener contenido
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }

  return {} as T
}

/**
 * Realizar petición PUT
 */
export async function httpPut<T = any>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    const error: any = new Error(errorText || `Error ${response.status}: ${response.statusText}`)
    error.statusCode = response.status
    error.status = response.status
    throw error
  }

  return await response.json()
}

/**
 * Realizar petición PATCH
 */
export async function httpPatch<T = any>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    const error: any = new Error(errorText || `Error ${response.status}: ${response.statusText}`)
    error.statusCode = response.status
    error.status = response.status
    throw error
  }

  return await response.json()
}

/**
 * Realizar petición DELETE
 */
export async function httpDelete<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    ...options,
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorText = await response.text()
    const error: any = new Error(errorText || `Error ${response.status}: ${response.statusText}`)
    error.statusCode = response.status
    error.status = response.status
    throw error
  }

  // DELETE puede no tener contenido en la respuesta
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }

  return {} as T
}

/**
 * Realizar petición sin autenticación (para endpoints públicos)
 */
export async function httpPublic<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    const error: any = new Error(errorText || `Error ${response.status}: ${response.statusText}`)
    error.statusCode = response.status
    error.status = response.status
    throw error
  }

  return await response.json()
}

// Exportar también el servicio base
export const http = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
  public: httpPublic,
}

export default http
