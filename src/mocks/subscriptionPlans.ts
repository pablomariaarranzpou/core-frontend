/**
 * Mock data para el endpoint de planes de cada aplicación
 * Cada app tiene su propia API que devuelve sus planes disponibles
 * Estructura esperada: GET /api/plans
 * 
 * IMPORTANTE: Todos los datos son solo informativos para mostrar al usuario.
 * El único campo que se envía al backend es 'id' (planId).
 * El backend es quien gestiona los precios reales, stripePriceId, límites de usuarios, etc.
 */

export interface AppPlan {
  id: string // ⚠️ ÚNICO CAMPO QUE SE ENVÍA AL BACKEND - El backend lo usa para buscar el plan real
  name: string // Solo informativo
  description: string // Solo informativo
  price: number // Solo informativo (mostrar al usuario)
  currency: string // Solo informativo
  interval: 'month' | 'year' // Solo informativo
  features: string[] // Solo informativo
  popular?: boolean // Solo informativo (para UI)
}

/**
 * Mock de respuesta de API de planes de aplicación
 * Simula lo que devolvería cada aplicación en su endpoint de planes
 */
export const mockAppPlansResponse: AppPlan[] = [
  {
    id: 'app_plan_starter',
    name: 'Starter',
    description: 'Perfecto para empezar',
    price: 9.99,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Hasta 5 usuarios',
      'Funciones básicas',
      '5 GB de almacenamiento',
      'Soporte por email',
    ],
    popular: false,
  },
  {
    id: 'app_plan_professional',
    name: 'Professional',
    description: 'La opción más popular',
    price: 29.99,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Hasta 25 usuarios',
      'Todas las funciones',
      '50 GB de almacenamiento',
      'Soporte prioritario 24/7',
      'Integraciones avanzadas',
      'Analytics detallados',
    ],
    popular: true,
  },
  {
    id: 'app_plan_enterprise',
    name: 'Enterprise',
    description: 'Para grandes organizaciones',
    price: 99.99,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Usuarios ilimitados',
      'Todas las funciones premium',
      'Almacenamiento ilimitado',
      'Soporte dedicado 24/7',
      'SLA del 99.9%',
      'Onboarding personalizado',
      'Gestión de múltiples cuentas',
      'Auditoría y cumplimiento',
    ],
    popular: false,
  },
]

/**
 * Simula una llamada a la API de planes de una aplicación
 * En desarrollo, devuelve datos mock
 * En producción, haría fetch a la URL real
 */
export async function fetchAppPlans(apiUrl: string): Promise<AppPlan[]> {
  // En desarrollo, devolver mock data
  if (import.meta.env.DEV) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockAppPlansResponse
  }

  // En producción, hacer fetch real
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  // Intentar extraer los planes de diferentes estructuras posibles
  if (Array.isArray(data)) {
    return data
  } else if (data.plans && Array.isArray(data.plans)) {
    return data.plans
  } else if (data.data && Array.isArray(data.data)) {
    return data.data
  }

  return []
}
