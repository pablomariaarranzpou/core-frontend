<template>
  <div class="auth-page">
    <div class="auth-theme-toggle">
      <ThemeToggle />
    </div>
    
    <div class="auth-container">
      <!-- Left Side - Branding -->
      <div class="auth-branding auth-glass">
        <div class="branding-content">
          <div class="logo-section">
            <img 
              :src="logoSrc"
              alt="Anima Logo" 
              width="200"
              height="47"
              class="logo" 
            />
            <p class="brand-tagline">Gestiona tu negocio de forma inteligente</p>
          </div>
          
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon gradient-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="feature-text">
                <h3>Acceso Seguro</h3>
                <p>Autenticación con AWS Cognito y 2FA</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon gradient-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </div>
              <div class="feature-text">
                <h3>Múltiples Aplicaciones</h3>
                <p>Accede a todas tus herramientas desde un solo lugar</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon gradient-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="feature-text">
                <h3>Gestión de Equipos</h3>
                <p>Administra usuarios y permisos fácilmente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Side - Auth Form -->
      <div class="auth-form-container auth-glass">
        <div class="auth-form-content">
          <authenticator
            hide-sign-up
            :login-mechanisms="['email']"
            :form-fields="formFields"
          >

            <template v-slot:sign-in-footer>
              <div class="forgot-password-link">
                <button
                  @click="auth.toForgotPassword"
                  class="amplify-button"
                  data-variation="link"
                  type="button"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </template>

            <template v-slot:forgot-password-header>
              <div class="auth-header">
                <p>Por favor, ingresa tu dirección de correo electrónico. Te enviaremos un código de verificación a ese correo para continuar con el proceso de autenticación.</p>
              </div>
            </template>

            <template v-slot:confirm-reset-password-header>
              <div class="auth-header">
                <p>Ingresa el código y tu nueva contraseña</p>
              </div>
            </template>
          </authenticator>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Hub } from 'aws-amplify/utils'
import { I18n } from 'aws-amplify/utils'
import { translations } from '@aws-amplify/ui-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'
import { computed } from 'vue'
import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'

const router = useRouter()
const authStore = useAuthStore()
const currentYear = new Date().getFullYear()
const auth = useAuthenticator()
const { isDark } = useTheme()

// Logo reactivo según el tema
const logoSrc = computed(() => {
  return isDark.value ? logoLight : logoDark
})

// Form fields configuration
const formFields = {
  signIn: {
    username: {
      placeholder: 'correo@ejemplo.com',
      isRequired: true,
      label: 'Correo electrónico',
      labelHidden: false,
    },
    password: {
      placeholder: 'Ingresa tu contraseña',
      isRequired: true,
      label: 'Contraseña',
      labelHidden: false,
    }
  },
  forgotPassword: {
    username: {
      placeholder: 'correo@ejemplo.com',
      isRequired: true,
      label: 'Correo electrónico',
      labelHidden: false,
    }
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: 'Ingresa el código de 6 dígitos',
      isRequired: true,
      label: 'Código de confirmación',
      labelHidden: false,
    },
    password: {
      placeholder: 'Nueva contraseña',
      isRequired: true,
      label: 'Nueva contraseña',
      labelHidden: false,
    },
    confirm_password: {
      placeholder: 'Confirma tu contraseña',
      isRequired: true,
      label: 'Confirmar contraseña',
      labelHidden: false,
    }
  }
}

// Configure i18n: Spanish translations
I18n.putVocabularies(translations)
I18n.setLanguage('es')
I18n.putVocabulariesForLanguage('es', {
  // Sign In
  'Sign In': 'Iniciar sesión',
  'Sign in': 'Iniciar sesión',
  'Sign in to your account': 'Inicia sesión en tu cuenta',
  'Username': 'Correo electrónico',
  'Password': 'Contraseña',
  'Forgot your password?': '¿Olvidaste tu contraseña?',
  'Reset Password': 'Recuperar contraseña',
  'Reset your password': 'Recupera tu contraseña',
  'Back to Sign In': 'Volver al inicio de sesión',
  'Send code': 'Enviar código',
  'Code': 'Código',
  'New Password': 'Nueva contraseña',
  'Confirm Password': 'Confirmar contraseña',
  'Submit': 'Enviar',
  'Code *': 'Código *',
  'New password': 'Nueva contraseña',
  
  // Error messages - Generic for security
  'User does not exist.': 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
  'Incorrect username or password.': 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
  'User is not confirmed.': 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
  'Username cannot be empty': 'El correo electrónico es requerido.',
  'Password attempts exceeded': 'Demasiados intentos. Por favor, intenta más tarde.',
  'Invalid password format': 'Formato de contraseña inválido.',
  'User already exists': 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
  'Invalid verification code provided, please try again.': 'Código de verificación inválido.',
  'Invalid code or auth state for the user.': 'Código inválido o sesión expirada.',
  'Code mismatch': 'El código ingresado es incorrecto.',
})

// Escuchar eventos de autenticación de Amplify
Hub.listen('auth', async (data) => {
  const { payload } = data
  console.log('Auth event:', payload.event)
  
  if (payload.event === 'signedIn') {
    console.log('Usuario autenticado, actualizando store...')
    // Actualizar el store con el usuario actual
    await authStore.getCurrentUserInfo()
    // Redirigir al dashboard
    router.push({ name: 'dashboard' })
  } else if (payload.event === 'signedOut') {
    console.log('Usuario desautenticado')
    // Limpiar el store
    authStore.user = null
  }
})
</script>

<style scoped>
/* ============================================
   BASE LAYOUT - Apple Style
   ============================================ */
.auth-page {
  /* Theme-aware colors using CSS variables */
  --apple-blue: #007AFF;
  --apple-bg: var(--color-background-soft);
  --apple-text: var(--color-heading);
  --apple-muted: var(--color-text-muted);
  --apple-border: var(--color-border);
  
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
  letter-spacing: -0.01em;
}

/* Dark mode - Base variables */
:global(.dark) .auth-page {
  --apple-blue: #0A84FF;
}

.auth-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 30%, 
    rgba(59, 130, 246, 0.03) 0%, 
    transparent 40%
  );
  animation: subtle-pulse 12s ease-in-out infinite;
}

:global(.dark) .auth-page::before {
  background: radial-gradient(
    circle at 30% 30%, 
    rgba(59, 130, 246, 0.05) 0%, 
    transparent 40%
  );
}

@keyframes subtle-pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.08);
  }
}

@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-theme-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 200;
}

/* ============================================
   CONTAINER - Apple Glass Effect
   ============================================ */
.auth-container {
  display: grid;
  grid-template-columns: 45% 55%;
  max-width: 1100px;
  width: 88%;
  height: 600px;
  background: transparent;
  border-radius: 22px;
  overflow: hidden;
  border: 0.5px solid var(--color-border);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 0;
  animation: fade-slide-in 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.dark) .auth-container {
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 8px 24px rgba(0, 0, 0, 0.3);
}

/* ============================================
   SHARED APPLE GLASS EFFECT
   ============================================ */
.auth-glass {
  background: var(--color-background-soft);
  backdrop-filter: saturate(180%) blur(24px);
  -webkit-backdrop-filter: saturate(180%) blur(24px);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

:global(.dark) .auth-glass {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

/* ============================================
   BRANDING SIDE - Minimal & Clean
   ============================================ */
.auth-branding {
  padding: 3rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* Unified gentle glow behind both panels */
.auth-container::before,
.auth-container::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 0;
}

.auth-container::before {
  top: -25%;
  left: -15%;
  width: 450px;
  height: 450px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.03) 0%,
    transparent 70%
  );
  animation: float-gentle 20s ease-in-out infinite;
}

:global(.dark) .auth-container::before {
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.05) 0%,
    transparent 70%
  );
}

.auth-container::after {
  bottom: -35%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.02) 0%,
    transparent 70%
  );
  animation: float-gentle 26s ease-in-out infinite reverse;
}

:global(.dark) .auth-container::after {
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.04) 0%,
    transparent 70%
  );
}

@keyframes float-gentle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(18px, -18px) scale(1.04);
  }
}

.branding-content {
  position: relative;
  z-index: 1;
  max-width: 100%;
  width: 100%;
}

.logo-section {
  text-align: center;
  margin-bottom: 2.75rem;
}

.logo {
  margin-bottom: 1.25rem;
  opacity: 0.92;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
  transition: opacity 0.3s ease, filter 0.3s ease;
}

:global(.dark) .logo {
  opacity: 1;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
}

.brand-tagline {
  font-size: 0.9375rem;
  color: var(--apple-muted);
  margin: 0;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

/* ============================================
   FEATURES LIST - Glass Cards
   ============================================ */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.125rem;
  background: var(--color-background-soft);
  backdrop-filter: saturate(180%) blur(20px);
  border-radius: 14px;
  border: 1px solid var(--color-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.feature-item:hover {
  background: var(--color-background);
  transform: translateX(6px);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(180deg, #007AFF 0%, #0051D5 100%);
  box-shadow: 
    0 3px 10px rgba(0, 122, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.feature-icon svg {
  width: 20px;
  height: 20px;
  color: white;
  stroke-width: 2.5;
}

.gradient-blue {
  background: linear-gradient(180deg, #007AFF 0%, #0051D5 100%);
}

.gradient-purple {
  background: linear-gradient(180deg, #5E5CE6 0%, #3634A3 100%);
}

.gradient-green {
  background: linear-gradient(180deg, #34C759 0%, #248A3D 100%);
}

.feature-text h3 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--apple-text);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.feature-text p {
  margin: 0.25rem 0 0 0;
  font-size: 0.8125rem;
  color: var(--apple-muted);
  line-height: 1.4;
  letter-spacing: -0.005em;
}

/* ============================================
   FORM SIDE - Perfectly Centered
   ============================================ */
.auth-form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.auth-form-content {
  width: 100%;
  max-width: 380px;
  padding: 3rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  min-height: 100%;
  position: relative;
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--apple-text);
  margin: 0 0 0.625rem 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.auth-header p {
  color: var(--apple-muted);
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: -0.01em;
}

.auth-footer {
  text-align: center;
  padding: 1.125rem 0 0 0;
  margin-top: 1.75rem;
  border-top: 0.5px solid var(--color-border);
}

.auth-footer p {
  color: var(--apple-muted);
  font-size: 0.75rem;
  margin: 0;
  opacity: 0.65;
  font-weight: 400;
  letter-spacing: -0.005em;
}

.forgot-password-link {
  text-align: center;
  margin-top: 0.75rem;
}

.forgot-password-link button {
  font-size: 0.875rem !important;
  padding: 0.5rem 0 !important;
}

/* ============================================
   AMPLIFY CUSTOMIZATION - Apple Glass Style
   ============================================ */
:deep(.amplify-authenticator) {
  --amplify-colors-background-primary: transparent !important;
  --amplify-colors-background-secondary: transparent !important;
  --amplify-colors-border-primary: transparent !important;
  --amplify-colors-border-secondary: transparent !important;
  --amplify-colors-font-primary: var(--apple-text) !important;
  --amplify-colors-font-secondary: var(--apple-muted) !important;
  --amplify-colors-brand-primary-10: rgba(0, 122, 255, 0.1) !important;
  --amplify-colors-brand-primary-80: #007AFF !important;
  --amplify-colors-brand-primary-90: #0A84FF !important;
  --amplify-colors-brand-primary-100: #0051D5 !important;
  --amplify-fonts-default-static: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif !important;
  --amplify-space-small: 0.5rem !important;
  --amplify-space-medium: 0.875rem !important;
  --amplify-space-large: 1.25rem !important;
  --amplify-radii-small: 8px !important;
  --amplify-radii-medium: 12px !important;
  --amplify-radii-large: 14px !important;
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  width: 100% !important;
}

:deep(.amplify-form) {
  width: 100% !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.amplify-authenticator__container) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 100% !important;
  width: 100% !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* Primary Button - Apple Gradient with Glass Depth */
:deep(.amplify-button[data-variation="primary"]) {
  background: linear-gradient(180deg, #007AFF 0%, #0051D5 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 0.9375rem !important;
  padding: 0.75rem 1.5rem !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 
    0 2px 6px rgba(0, 122, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  letter-spacing: -0.02em !important;
}

:global(.dark) :deep(.amplify-button[data-variation="primary"]) {
  background: linear-gradient(180deg, #0A84FF 0%, #0063E5 100%) !important;
  box-shadow: 
    0 2px 6px rgba(10, 132, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}

:deep(.amplify-button[data-variation="primary"]:hover) {
  background: linear-gradient(180deg, #0A84FF 0%, #0063E5 100%) !important;
  transform: translateY(-1px) !important;
  box-shadow: 
    0 6px 16px rgba(0, 122, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
}

:global(.dark) :deep(.amplify-button[data-variation="primary"]:hover) {
  background: linear-gradient(180deg, #3b9eff 0%, #0077ff 100%) !important;
  box-shadow: 
    0 6px 16px rgba(10, 132, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

:deep(.amplify-button[data-variation="primary"]:active) {
  transform: translateY(0) !important;
  box-shadow: 
    0 2px 4px rgba(0, 122, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}

/* Link Button - Apple Blue */
:deep(.amplify-button[data-variation="link"]) {
  color: #007AFF !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  letter-spacing: -0.01em !important;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  background: transparent !important;
  border: none !important;
}

:global(.dark) :deep(.amplify-button[data-variation="link"]) {
  color: #0A84FF !important;
}

:deep(.amplify-button[data-variation="link"]:hover) {
  opacity: 0.65 !important;
  text-decoration: none !important;
}

/* Input - Apple Glass Effect */
:deep(.amplify-input),
:deep(.amplify-input[type="email"]),
:deep(.amplify-input[type="password"]),
:deep(.amplify-input[type="text"]) {
  border: 1px solid var(--color-border) !important;
  border-radius: 12px !important;
  background: var(--color-background-soft) !important;
  backdrop-filter: saturate(180%) blur(20px) !important;
  color: var(--apple-text) !important;
  font-size: 0.9375rem !important;
  padding: 0.75rem 1rem !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  font-weight: 400 !important;
  letter-spacing: -0.01em !important;
  box-shadow: var(--shadow-sm) !important;
  position: relative !important;
  line-height: normal !important;
  height: auto !important;
  min-height: 44px !important;
}

:deep(.amplify-input:hover) {
  border-color: var(--color-border-hover) !important;
  background: var(--color-background) !important;
}

:deep(.amplify-input:focus) {
  outline: none !important;
  border-color: var(--color-primary) !important;
  box-shadow: var(--focus-ring) !important;
  background: var(--color-background) !important;
  backdrop-filter: saturate(180%) blur(20px) !important;
}

:deep(.amplify-input::placeholder) {
  color: var(--apple-muted) !important;
  opacity: 0.5 !important;
}

/* Password field container - Make it the reference for absolute positioning */
:deep(.amplify-field-group) {
  position: relative !important;
}

/* Hide the outer-end container (the div that contains the button outside) */
:deep(.amplify-field-group__outer-end) {
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}

/* Password visibility button - Apple Style - Positioned inside input */
:deep(.amplify-field__show-password),
:deep(.amplify-button[aria-label*="password"]),
:deep(.amplify-button[aria-label*="Mostrar"]) {
  position: relative !important;
  right: 12px !important;
  background: transparent !important;
  border: none !important;
  border-radius: 6px !important;
  color: var(--apple-muted) !important;
  padding: 4px !important;
  margin: 0 !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
  z-index: 10 !important;
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  line-height: 1 !important;
}

:deep(.amplify-field__show-password:hover),
:deep(.amplify-button[aria-label*="password"]:hover),
:deep(.amplify-button[aria-label*="Mostrar"]:hover) {
  background: rgba(0, 0, 0, 0.05) !important;
  border: none !important;
  color: var(--apple-text) !important;
}

:global(.dark) :deep(.amplify-field__show-password:hover),
:global(.dark) :deep(.amplify-button[aria-label*="password"]:hover),
:global(.dark) :deep(.amplify-button[aria-label*="Mostrar"]:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

:deep(.amplify-field__show-password svg),
:deep(.amplify-button[aria-label*="password"] svg),
:deep(.amplify-button[aria-label*="Mostrar"] svg) {
  width: 18px !important;
  height: 18px !important;
  color: inherit !important;
}

/* Adjust password input padding to make room for the button */
:deep(.amplify-passwordfield .amplify-input),
:deep(.amplify-field[data-amplify-field="password"] .amplify-input),
:deep(.amplify-input[type="password"]) {
  padding-right: 48px !important;
}

/* Label - Apple Typography */
:deep(.amplify-label) {
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  color: var(--apple-text) !important;
  margin-bottom: 0.5rem !important;
  letter-spacing: -0.01em !important;
}

/* ============================================
   ALERT / ERROR MESSAGES - Premium Apple Style
   ============================================ */

/* Main Alert Container - Elegant Glass Effect */
:deep(.amplify-alert),
:deep(.amplify-alert[data-variation="error"]) {
  position: relative !important;
  border-radius: 14px !important;
  padding: 1rem 1.125rem 1rem 3.25rem !important;
  margin-bottom: 1.25rem !important;
  border: 1px solid rgba(239, 68, 68, 0.25) !important;
  background: linear-gradient(
    135deg,
    rgba(254, 242, 242, 0.95) 0%,
    rgba(254, 226, 226, 0.9) 100%
  ) !important;
  backdrop-filter: saturate(180%) blur(20px) !important;
  -webkit-backdrop-filter: saturate(180%) blur(20px) !important;
  color: #991b1b !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  line-height: 1.5 !important;
  letter-spacing: -0.01em !important;
  box-shadow: 
    0 4px 12px rgba(239, 68, 68, 0.12),
    0 2px 4px rgba(239, 68, 68, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  animation: slideInAlert 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Hide ALL default Amplify icons and icon containers */
:deep(.amplify-alert__icon),
:deep(.amplify-alert [data-amplify-alert-icon]),
:deep(.amplify-alert svg:not(.amplify-alert__dismiss svg)) {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
  opacity: 0 !important;
  position: absolute !important;
  pointer-events: none !important;
}

/* Also hide the icon wrapper/container but NOT the content */
:deep(.amplify-alert__icon-wrapper),
:deep(.amplify-alert > span:first-child:has(svg)) {
  display: none !important;
}

/* Custom Icon Container - Positioned absolutely on the left */
:deep(.amplify-alert)::before {
  content: '⚠' !important;
  position: absolute !important;
  left: 1rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 24px !important;
  height: 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1rem !important;
  color: #dc2626 !important;
  background: rgba(239, 68, 68, 0.15) !important;
  border-radius: 50% !important;
  padding: 0.25rem !important;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2) !important;
}

/* Hide/Disable Dismiss/Close Button completely */
:deep(.amplify-alert__dismiss),
:deep(.amplify-button[data-variation="link"][aria-label*="Dismiss"]),
:deep(.amplify-button[data-variation="link"][aria-label*="dismiss"]),
:deep(.amplify-alert button[aria-label*="Dismiss"]),
:deep(.amplify-alert button[aria-label*="dismiss"]) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Hover state for interactive feel */
:deep(.amplify-alert:hover) {
  border-color: rgba(239, 68, 68, 0.35) !important;
  box-shadow: 
    0 6px 16px rgba(239, 68, 68, 0.16),
    0 2px 6px rgba(239, 68, 68, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
}

/* Alert heading styling */
:deep(.amplify-alert__heading) {
  font-weight: 600 !important;
  font-size: 0.9375rem !important;
  margin-bottom: 0.25rem !important;
  color: #991b1b !important;
  letter-spacing: -0.015em !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Alert body text */
:deep(.amplify-alert__body) {
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  color: #991b1b !important;
  opacity: 0.9 !important;
  display: block !important;
  visibility: visible !important;
}

/* Ensure the text content wrapper is visible */
:deep(.amplify-alert > div),
:deep(.amplify-alert__content) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Dark Mode - Sophisticated Error Styling */
:global(.dark) :deep(.amplify-alert),
:global(.dark) :deep(.amplify-alert[data-variation="error"]) {
  border: 1px solid rgba(248, 113, 113, 0.35) !important;
  background: linear-gradient(
    135deg,
    rgba(127, 29, 29, 0.25) 0%,
    rgba(153, 27, 27, 0.2) 100%
  ) !important;
  color: #fca5a5 !important;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(248, 113, 113, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
}

:global(.dark) :deep(.amplify-alert)::before {
  color: #fca5a5 !important;
  background: rgba(248, 113, 113, 0.2) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

:global(.dark) :deep(.amplify-alert:hover) {
  border-color: rgba(248, 113, 113, 0.45) !important;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.4),
    0 2px 6px rgba(248, 113, 113, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
}

:global(.dark) :deep(.amplify-alert__heading),
:global(.dark) :deep(.amplify-alert__body) {
  color: #fca5a5 !important;
}

/* Slide in animation */
@keyframes slideInAlert {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fieldset */
:deep(.amplify-fieldset) {
  margin-bottom: 1.25rem !important;
  border: none !important;
  background: transparent !important;
}

/* Hide default "Back to Sign In" footer link to avoid duplicates */
:deep(.amplify-authenticator__footer) {
  display: none !important;
}

/* Only show custom footers */
:deep([data-amplify-footer]) {
  display: block !important;
}

/* Additional border removal for all elements */
:deep([data-amplify-authenticator]),
:deep([data-amplify-container]),
:deep([data-amplify-router]),
:deep([data-amplify-router-content]),
:deep([data-amplify-form]),
:deep(.amplify-tabs__panel),
:deep(.amplify-authenticator__column),
:deep(.amplify-flex) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

/* Complete background removal for authenticator */
:deep(.amplify-authenticator *) {
  background: transparent !important;
}

/* Ensure all containers are transparent */
:deep(.amplify-authenticator),
:deep(.amplify-authenticator > *),
:deep(.amplify-authenticator__container),
:deep(.amplify-authenticator__form),
:deep(.amplify-form),
:deep(.amplify-form > *),
:deep(.amplify-flex),
:deep(.amplify-tabs),
:deep(.amplify-tabs__panel),
:deep(.amplify-card),
:deep(.amplify-container),
:deep(.amplify-field),
:deep(.amplify-field-group),
:deep(.amplify-field-group__field-wrapper),
:deep(.amplify-textfield),
:deep(.amplify-passwordfield),
:deep(.amplify-phonenumberfield) {
  background: transparent !important;
  background-color: transparent !important;
}

/* Force remove any white backgrounds from specific Amplify components */
:deep([class*="amplify-"]:not(.amplify-input):not(.amplify-button):not(.amplify-alert):not(.amplify-field__show-password)) {
  background: transparent !important;
  background-color: transparent !important;
}

/* Target any remaining background colors */
:deep(.amplify-authenticator *:not(.amplify-input):not(.amplify-button):not(.amplify-alert):not(.amplify-field__show-password)) {
  background: transparent !important;
  background-color: transparent !important;
}

/* Ensure perfect background unity */
:deep(.amplify-authenticator) {
  background: inherit !important;
  background-color: inherit !important;
}

:deep(.amplify-link) {
  color: #007AFF !important;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  letter-spacing: -0.01em !important;
}

:global(.dark) :deep(.amplify-link) {
  color: #0A84FF !important;
}

:deep(.amplify-link:hover) {
  opacity: 0.65 !important;
}

:deep(.amplify-text) {
  color: var(--apple-text) !important;
  line-height: 1.5 !important;
  letter-spacing: -0.01em !important;
  font-size: 0.9375rem !important;
}

:deep(.amplify-heading) {
  color: var(--apple-text) !important;
  letter-spacing: -0.02em !important;
  font-weight: 700 !important;
}

/* Error message styling - Apple Style */
:deep(.amplify-alert--error) {
  font-size: 0.875rem !important;
  line-height: 1.4 !important;
  font-weight: 500 !important;
}

/* ============================================
   FIELD ERROR MESSAGES - Inline Elegant Feedback
   ============================================ */

/* Field-level error message - Subtle but clear */
:deep(.amplify-field__error-message) {
  display: flex !important;
  align-items: center !important;
  gap: 0.375rem !important;
  font-size: 0.8125rem !important;
  line-height: 1.4 !important;
  margin-top: 0.5rem !important;
  padding: 0.5rem 0.75rem !important;
  color: #dc2626 !important;
  font-weight: 500 !important;
  letter-spacing: -0.005em !important;
  background: linear-gradient(
    135deg,
    rgba(254, 242, 242, 0.6) 0%,
    rgba(254, 226, 226, 0.5) 100%
  ) !important;
  border-left: 2px solid #ef4444 !important;
  border-radius: 8px !important;
  backdrop-filter: blur(10px) !important;
  animation: slideInError 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Small error icon using pseudo-element */
:deep(.amplify-field__error-message)::before {
  content: '!' !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 16px !important;
  height: 16px !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  color: white !important;
  background: #ef4444 !important;
  border-radius: 50% !important;
  flex-shrink: 0 !important;
}

/* Dark Mode - Field Errors */
:global(.dark) :deep(.amplify-field__error-message) {
  color: #fca5a5 !important;
  background: linear-gradient(
    135deg,
    rgba(127, 29, 29, 0.3) 0%,
    rgba(153, 27, 27, 0.25) 100%
  ) !important;
  border-left-color: #f87171 !important;
}

:global(.dark) :deep(.amplify-field__error-message)::before {
  background: #f87171 !important;
}

/* Error text styling for Amplify components */
:deep(.amplify-text[data-amplify-color="error"]) {
  font-size: 0.8125rem !important;
  line-height: 1.4 !important;
  font-weight: 500 !important;
  color: #dc2626 !important;
  letter-spacing: -0.005em !important;
}

:global(.dark) :deep(.amplify-text[data-amplify-color="error"]) {
  color: #fca5a5 !important;
}

:deep(.amplify-text--error) {
  font-size: 0.8125rem !important;
  line-height: 1.4 !important;
  font-weight: 500 !important;
  color: #dc2626 !important;
  letter-spacing: -0.005em !important;
}

:global(.dark) :deep(.amplify-text--error) {
  color: #fca5a5 !important;
}

/* Input field with error state - Red border glow */
:deep(.amplify-field--error .amplify-input),
:deep(.amplify-input[aria-invalid="true"]) {
  border-color: #ef4444 !important;
  box-shadow: 
    0 0 0 3px rgba(239, 68, 68, 0.15),
    0 2px 6px rgba(239, 68, 68, 0.1) !important;
}

:deep(.amplify-field--error .amplify-input:focus),
:deep(.amplify-input[aria-invalid="true"]:focus) {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2) !important;
}

/* Dark Mode - Input Error State */
:global(.dark) :deep(.amplify-field--error .amplify-input),
:global(.dark) :deep(.amplify-input[aria-invalid="true"]) {
  border-color: #f87171 !important;
  box-shadow: 
    0 0 0 3px rgba(248, 113, 113, 0.2),
    0 2px 6px rgba(0, 0, 0, 0.3) !important;
}

:global(.dark) :deep(.amplify-field--error .amplify-input:focus),
:global(.dark) :deep(.amplify-input[aria-invalid="true"]:focus) {
  border-color: #fca5a5 !important;
  box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.25) !important;
}

/* Slide in animation for field errors */
@keyframes slideInError {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ============================================
   RESPONSIVE - Apple Glass Adjustments
   ============================================ */
@media (max-width: 1024px) {
  .auth-container {
    grid-template-columns: 1fr;
    max-width: 460px;
    width: 90%;
    height: auto;
    min-height: 520px;
    border-radius: 20px;
  }
  
  .auth-branding {
    display: none;
  }
  
  .auth-form-container {
    padding: 0;
    background: rgba(255, 255, 255, 0.35);
  }
  
  :global(.dark) .auth-form-container {
    background: rgba(30, 41, 59, 0.4);
  }
  
  .auth-form-content {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 640px) {
  .auth-container {
    width: 92%;
    max-width: 400px;
    border-radius: 18px;
    box-shadow: 
      0 16px 40px rgba(0, 0, 0, 0.15),
      0 6px 20px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
  
  .auth-form-content {
    padding: 2rem 1.5rem;
  }
  
  .auth-header h2 {
    font-size: 1.625rem;
    letter-spacing: -0.025em;
  }
  
  .auth-header p {
    font-size: 0.9375rem;
  }
  
  .auth-theme-toggle {
    top: 1rem;
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .auth-container {
    width: 94%;
    border-radius: 16px;
  }
  
  .auth-form-content {
    padding: 1.75rem 1.25rem;
  }
  
  .auth-header h2 {
    font-size: 1.5rem;
    letter-spacing: -0.02em;
  }
  
  .auth-header p {
    font-size: 0.875rem;
  }
}

/* Low Height Screens - Apple Glass */
@media (max-height: 700px) {
  .auth-container {
    height: auto;
    max-height: 90vh;
  }
  
  .auth-branding {
    padding: 2rem 1.5rem;
  }
  
  .logo-section {
    margin-bottom: 1.5rem;
  }
  
  .features-list {
    gap: 0.625rem;
  }
  
  .feature-item {
    padding: 0.75rem 1rem;
  }
  
  .auth-form-content {
    padding: 2rem 1.5rem;
    min-height: auto;
  }
  
  .auth-header {
    margin-bottom: 1.25rem;
  }
}

/* =====================================================
   VERTICAL CENTERING FIXES
   ===================================================== */

/* 1️⃣ Forzar que el lado derecho (auth form) siempre ocupe
      toda la altura y mantenga el centrado vertical */
.auth-form-container {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  flex: 1 1 auto !important;
  min-height: 600px !important; /* altura base armoniosa */
}

/* 2️⃣ Asegurar que el wrapper interior respete el flex center */
.auth-form-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  width: 100% !important;
  max-width: 400px !important;
  padding: 3rem 2.5rem !important;
  box-sizing: border-box !important;
  margin: 0 auto !important;
}

/* 3️⃣ Overwrite Amplify internal containers for vertical center */
:deep(.amplify-authenticator),
:deep(.amplify-authenticator__container),
:deep(.amplify-form),
:deep(.amplify-flex) {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: stretch !important;
  height: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

/* Final cleanup - ensure EVERYTHING is transparent */
:deep(.amplify-authenticator) {
  background-image: none !important;
}

:deep(.amplify-authenticator::before),
:deep(.amplify-authenticator::after) {
  display: none !important;
}

/* 4️⃣ Aspect ratio para mantener proporción Apple */
.auth-container {
  aspect-ratio: 11 / 6;
  max-height: 90vh;
}

/* 5️⃣ Responsiveness tuning */
@media (max-width: 1024px) {
  .auth-form-container {
    min-height: 500px !important;
  }
  .auth-form-content {
    max-width: 380px !important;
    padding: 2rem 1.75rem !important;
  }
  .auth-container {
    aspect-ratio: auto;
  }
}

@media (max-width: 480px) {
  .auth-form-container {
    min-height: 480px !important;
  }
  .auth-form-content {
    padding: 1.75rem 1.25rem !important;
  }
}
</style>
