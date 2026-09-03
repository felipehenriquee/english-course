import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/features/auth/views/LoginView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/features/home/views/HomeView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/features/users/views/UsersListView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Guarda global: bloqueia rotas privadas sem token e evita
// que um usuário já logado volte pra tela de login.
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export { router }
