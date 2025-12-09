import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'catalog' }
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('../pages/HomePage.vue'),
    meta: {
      title: 'Каталог услуг'
    }
  },
  {
    path: '/catalog/:id',
    name: 'service',
    component: () => import('../pages/ServicePage.vue'),
    meta: {
      title: 'Услуга'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginPage.vue'),
    meta: {
      title: 'Вход',
      guestOnly: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/RegisterPage.vue'),
    meta: {
      title: 'Регистрация',
      guestOnly: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../pages/ProfilePage.vue'),
    meta: {
      title: 'Профиль',
      requiresAuth: true
    }
  },
  {
    path: '/orders/:id',
    name: 'order-details',
    component: () => import('../pages/OrderDetailsPage.vue'),
    meta: {
      title: 'Заказ',
      requiresAuth: true
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../pages/CartPage.vue'),
    meta: {
      title: 'Корзина',
      requiresAuth: true,
      allowedRoles: ['user']
    }
  },
  {
    path: '/execution',
    name: 'execution',
    component: () => import('../pages/ExecutionPage.vue'),
    meta: {
      title: 'Исполнение заказов',
      requiresAuth: true,
      allowedRoles: ['buyer']
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../pages/admin/AdminPage.vue'),
    meta: {
      title: 'Админ-панель',
      requiresAuth: true,
      allowedRoles: ['admin', 'manager']
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFoundPage.vue'),
    meta: {
      title: 'Страница не найдена'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Навигационные хуки для защиты маршрутов
router.beforeEach(async (to, from, next) => {
  // Импортируем useAuth внутри хука
  const { useAuth } = await import('../shared/composables/useAuth')
  const auth = useAuth()
  
  // Устанавливаем заголовок страницы
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} | SOLDY` : 'SOLDY'
  
  // Проверка на авторизацию
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  // Проверка на доступ только для гостей
  if (to.meta.guestOnly && auth.isAuthenticated.value) {
    next({ name: 'catalog' })
    return
  }
  
  // Проверка ролей
  if (to.meta.allowedRoles) {
    const userRole = auth.user.value?.role
    const allowedRoles = to.meta.allowedRoles as string[]
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      next({ name: 'catalog' })
      return
    }
  }
  
  next()
})

export default router
