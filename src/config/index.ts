/**
 * Configuración centralizada de la aplicación
 * 
 * Este archivo centraliza todas las configuraciones de la aplicación
 * basándose en las variables de entorno.
 */

// Tipos de entorno
export type Environment = 'development' | 'production' | 'test'

// Configuración de la aplicación
export interface AppConfig {
  env: Environment
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean
  aws: {
    region: string
    cognito: {
      userPoolId: string
      clientId: string
    }
  }
  api: {
    baseUrl: string
    timeout: number
  }
  features: {
    debug: boolean
    mockData: boolean
  }
}

// Obtener el entorno actual
const getEnvironment = (): Environment => {
  return (import.meta.env.MODE as Environment) || 'development'
}

// Validar configuración requerida
const validateConfig = () => {
  const required = [
    'VITE_COGNITO_REGION',
    'VITE_COGNITO_USER_POOL_ID',
    'VITE_COGNITO_CLIENT_ID',
    'VITE_API_BASE_URL',
  ]

  const missing = required.filter(key => !import.meta.env[key])

  if (missing.length > 0) {
    console.warn(
      '⚠️ Variables de entorno faltantes:',
      missing.join(', '),
      '\nAsegúrate de configurar tu archivo .env.development.local'
    )
  }
}

// Configuración de la aplicación
const env = getEnvironment()

export const config: AppConfig = {
  env,
  isDevelopment: env === 'development',
  isProduction: env === 'production',
  isTest: env === 'test',

  aws: {
    region: import.meta.env.VITE_COGNITO_REGION || 'eu-south-2',
    cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
      clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
    },
  },

  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  },

  features: {
    debug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    mockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  },
}

// Validar configuración en desarrollo
if (config.isDevelopment) {
  validateConfig()
}

// Log de configuración en desarrollo
if (config.isDevelopment && config.features.debug) {
  console.log('🔧 Configuración de la aplicación:', {
    env: config.env,
    aws: {
      region: config.aws.region,
      userPoolId: config.aws.cognito.userPoolId ? '✅ Configurado' : '❌ No configurado',
      clientId: config.aws.cognito.clientId ? '✅ Configurado' : '❌ No configurado',
    },
    api: config.api,
    features: config.features,
  })
}

export default config
