import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas (autenticación)
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      meta: { requiresAuth: false, hideNavigation: true },
    },
    // Rutas protegidas
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: () => import('../views/PreferencesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: () => import('../views/MarketplaceView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/applications',
      name: 'applications',
      component: () => import('../views/ApplicationsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/applications/:id',
      name: 'application-details',
      component: () => import('../views/ApplicationDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/applications/:id/users',
      name: 'subscription-users',
      component: () => import('../views/SubscriptionUsersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('../views/SubscriptionsView.vue'),
      meta: { requiresAuth: true },
    },
    // Redirect legacy routes
    {
      path: '/login',
      redirect: '/auth',
    },
    {
      path: '/register',
      redirect: '/auth',
    },
    {
      path: '/home',
      redirect: '/',
    },
    {
      path: '/about',
      redirect: '/',
    },
  ],
})

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Solo inicializar si no tenemos usuario Y no hay caché válido
  // Esto evita llamadas duplicadas usando el sistema de caché
  if (!authStore.isAuthenticated && !authStore.isCacheValid) {
    console.log('🔐 Router: Inicializando autenticación...')
    await authStore.initialize()
  } else if (authStore.isCacheValid && authStore.user) {
    console.log('✅ Router: Usando autenticación desde caché')
  }

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthRoute = to.name === 'auth'

  if (requiresAuth && !authStore.isAuthenticated) {
    // Ruta protegida sin autenticación -> ir a auth
    console.log('🔒 Router: Redirigiendo a /auth (no autenticado)')
    next({ name: 'auth', query: { redirect: to.fullPath } })
  } else if (isAuthRoute && authStore.isAuthenticated) {
    // Usuario autenticado intentando acceder a auth -> ir al dashboard
    console.log('✅ Router: Usuario autenticado, redirigiendo a dashboard')
    next({ name: 'dashboard' })
  } else {
    // Permitir navegación
    next()
  }
})

export default router
