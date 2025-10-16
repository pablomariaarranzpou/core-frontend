import { Amplify } from 'aws-amplify'
import config from '@/config'

// Configurar Amplify con Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.aws.cognito.userPoolId,
      userPoolClientId: config.aws.cognito.clientId,
    },
  },
})

console.log('✅ Amplify configured successfully')
console.log('User Pool ID:', config.aws.cognito.userPoolId)
console.log('Client ID:', config.aws.cognito.clientId)
console.log('Region should be inferred from User Pool ID')

// Exportar funciones de autenticación de Cognito
export {
  updatePassword,
  setUpTOTP,
  verifyTOTPSetup,
  updateMFAPreference,
  fetchMFAPreference,
} from 'aws-amplify/auth'