# Core Platform - SaaS Management System

Plataforma SaaS centralizada para gestionar cuentas, usuarios, aplicaciones y suscripciones con autenticación AWS Cognito.

## 🚀 Características

### Autenticación y Seguridad
- ✅ **AWS Cognito** integrado para autenticación
- ✅ **JWT Token Management** con refresh automático
- ✅ Login, registro y confirmación por email
- ✅ Guards de navegación para rutas protegidas
- ✅ HTTP interceptor con JWT automático
- ✅ Persistencia de sesión en localStorage
- ✅ Logout global

### Módulos Principales
- 📊 **Dashboard**: Vista general con acceso rápido
- 👤 **Mi Cuenta**: Gestión de información y configuración
- 👥 **Usuarios**: Administración de usuarios y roles
- 📱 **Aplicaciones**: Gestión de apps y marketplace
- 💳 **Suscripciones**: Planes, facturación e historial

### Tecnologías
- **Vue 3** + **TypeScript** + **Vite**
- **Pinia** para gestión de estado
- **Vue Router** con guards de navegación
- **AWS Cognito** para autenticación
- **JWT** para tokens de sesión

## 📋 Requisitos

- Node.js >= 20.19.0 o >= 22.12.0
- NPM o equivalente
- Cuenta de AWS con Cognito configurado

## 🔧 Configuración

### 1. Instalar Dependencias

```sh
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```sh
cp .env.example .env
```

Edita `.env` con tus credenciales de AWS Cognito:

```env
# AWS Cognito Configuration
VITE_AWS_REGION=eu-west-1
VITE_COGNITO_USER_POOL_ID=eu-west-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# API Configuration
VITE_API_BASE_URL=https://api.example.com
```

### 3. Configurar AWS Cognito

Ver la guía completa en [AUTH.md](./AUTH.md) para configurar:
- User Pool
- App Client
- Atributos de usuario
- Tokens de autenticación

## 🏃 Ejecutar el Proyecto

### Desarrollo

```sh
npm run dev
```

La aplicación estará disponible en: http://localhost:5173/

### Producción

```sh
# Type-check, compilar y minificar
npm run build

# Preview de la build
npm run preview
```

## 📚 Documentación

- **[URLS.md](./URLS.md)** - Estructura de rutas y URLs de la plataforma
- **[AUTH.md](./AUTH.md)** - Guía completa de autenticación y JWT
- **[Vite Config Reference](https://vite.dev/config/)** - Configuración de Vite

## 🗂️ Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos (CSS, imágenes)
├── components/      # Componentes reutilizables
├── router/          # Configuración de rutas y guards
├── services/        # Servicios de API y HTTP
│   ├── http.ts     # HTTP interceptor con JWT
│   └── api.ts      # Servicios de API específicos
├── stores/          # Pinia stores
│   └── auth.ts     # Store de autenticación
├── views/           # Componentes de vista/página
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── DashboardView.vue
│   ├── AccountView.vue
│   ├── UsersView.vue
│   ├── ApplicationsView.vue
│   └── SubscriptionsView.vue
├── App.vue          # Componente raíz
└── main.ts          # Entry point
```

## 🔐 Rutas

| Ruta | Componente | Auth | Descripción |
|------|-----------|------|-------------|
| `/login` | LoginView | No | Iniciar sesión |
| `/register` | RegisterView | No | Crear cuenta |
| `/` | DashboardView | Sí | Dashboard principal |
| `/account` | AccountView | Sí | Gestión de cuenta |
| `/users` | UsersView | Sí | Administrar usuarios |
| `/applications` | ApplicationsView | Sí | Gestionar aplicaciones |
| `/subscriptions` | SubscriptionsView | Sí | Ver suscripciones |

## 💻 Uso del Store de Autenticación

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login
await authStore.login('email@example.com', 'password')

// Registro
await authStore.register('email@example.com', 'password', 'username')

// Logout
await authStore.logout()

// Verificar autenticación
if (authStore.isAuthenticated) {
  console.log('Usuario:', authStore.user)
}
```

## 🌐 Uso del Servicio HTTP

```typescript
import { http } from '@/services/http'

// GET con JWT automático
const data = await http.get('/api/users')

// POST con JWT automático
await http.post('/api/users', { name: 'John' })

// Petición pública (sin JWT)
const publicData = await http.public('/api/public/stats')
```

## 🧪 Testing

```sh
# Ejecutar tests unitarios
npm run test:unit
```

## 🔍 Linting

```sh
# Ejecutar ESLint
npm run lint
```

## 🛠️ IDE Recomendado

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Extensiones Recomendadas
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier

## 🌐 Navegadores Recomendados

- **Chrome/Edge/Brave**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 📦 Dependencias Principales

```json
{
  "vue": "^3.5.22",
  "vue-router": "^4.5.1",
  "pinia": "^3.0.3",
  "@aws-sdk/client-cognito-identity-provider": "latest",
  "jwt-decode": "latest"
}
```

## 🚀 Próximas Funcionalidades

- [ ] Forgot Password / Reset Password
- [ ] MFA (Multi-Factor Authentication)
- [ ] Social Login (Google, Facebook)
- [ ] Dark Mode
- [ ] Internacionalización (i18n)
- [ ] Notificaciones en tiempo real
- [ ] Audit log de actividad
- [ ] 2FA

## 📝 Licencia

Privado - Todos los derechos reservados

## 👥 Contribuir

Este es un proyecto privado. Para contribuir, contacta al equipo de desarrollo.

---

Desarrollado con ❤️ usando Vue 3 + TypeScript + AWS Cognito
