import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/LandingPage.vue'),
    meta: {
      title: 'Главная'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/AboutPage.vue'),
    meta: {
      title: 'О нас'
    }
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../pages/HomePage.vue'),
    meta: {
      title: 'Каталог'
    }
  },
  {
    path: '/catalog',
    name: 'catalog-mobile',
    component: () => import('../pages/MobileCatalogPage.vue'),
    meta: {
      title: 'Каталог'
    }
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('../pages/PricingPage.vue'),
    meta: {
      title: 'Цены'
    }
  },
  {
    path: '/stores',
    name: 'stores',
    component: () => import('../pages/StoresPage.vue'),
    meta: {
      title: 'Магазины'
    }
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('../pages/ContactsPage.vue'),
    meta: {
      title: 'Контакты'
    }
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('../pages/FaqPage.vue'),
    meta: {
      title: 'Вопросы'
    }
  },
  {
    path: '/support/new',
    name: 'support-new',
    component: () => import('../pages/SupportRequestPage.vue'),
    meta: {
      title: 'Поддержка',
      requiresAuth: true
    }
  },
  {
    path: '/requests/new',
    name: 'request-create',
    component: () => import('../pages/RequestCreatePage.vue'),
    meta: {
      title: 'Создать запрос',
      requiresAuth: true,
      allowedRoles: ['user']
    }
  },
  {
    path: '/requests/:id',
    name: 'request',
    component: () => import('../pages/RequestPage.vue'),
    meta: {
      title: 'Запрос'
    }
  },
  {
    path: '/services/:id',
    name: 'service',
    component: () => import('../pages/ServicePage.vue'),
    meta: {
      title: 'Услуга'
    }
  },
  {
    path: '/services/:id/reviews',
    name: 'service-reviews',
    component: () => import('../pages/ServiceReviewsPage.vue'),
    meta: {
      title: 'Отзывы'
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
      title: 'Корзина'
    }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../pages/CheckoutPage.vue'),
    meta: {
      title: 'Оформление заказа',
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
    path: '/dashboard',
    component: () => import('../pages/dashboard/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
      title: 'Личный кабинет'
    },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('../pages/dashboard/DashboardHomePage.vue'),
        meta: { title: 'Личный кабинет' }
      },
      {
        path: 'orders',
        name: 'dashboard-orders',
        component: () => import('../pages/dashboard/DashboardOrdersPage.vue'),
        meta: { title: 'История заказов' }
      },
      {
        path: 'parcels',
        name: 'dashboard-parcels',
        component: () => import('../pages/dashboard/DashboardParcelsPage.vue'),
        meta: { title: 'Посылки' }
      },
      {
        path: 'send-parcel',
        name: 'dashboard-send-parcel',
        component: () => import('../pages/dashboard/DashboardSendParcelPage.vue'),
        meta: { title: 'Отправить посылку' }
      },
      {
        path: 'favorites',
        name: 'dashboard-favorites',
        component: () => import('../pages/dashboard/DashboardFavoritesPage.vue'),
        meta: { title: 'Избранное' }
      },
      {
        path: 'addresses',
        name: 'dashboard-addresses',
        component: () => import('../pages/dashboard/DashboardAddressesPage.vue'),
        meta: { title: 'Адреса доставки' }
      },
      {
        path: 'balance',
        name: 'dashboard-balance',
        component: () => import('../pages/dashboard/DashboardBalancePage.vue'),
        meta: { title: 'Финансы' }
      },
      {
        path: 'buyer/requests',
        name: 'dashboard-buyer-requests',
        component: () => import('../pages/dashboard/BuyerRequestsPage.vue'),
        meta: { title: 'Запросы на исполнение' }
      },
      {
        path: 'buyer/in-progress',
        name: 'dashboard-buyer-in-progress',
        component: () => import('../pages/dashboard/BuyerInProgressPage.vue'),
        meta: { title: 'Заказы в работе' }
      },
      {
        path: 'buyer/completed',
        name: 'dashboard-buyer-completed',
        component: () => import('../pages/dashboard/BuyerCompletedPage.vue'),
        meta: { title: 'Завершенные заказы' }
      },
      {
        path: 'buyer/catalog',
        name: 'dashboard-buyer-catalog',
        component: () => import('../pages/dashboard/BuyerCatalogCreatePage.vue'),
        meta: { title: 'Создание объявления' }
      },
      {
        path: 'profile',
        name: 'dashboard-profile',
        component: () => import('../pages/dashboard/DashboardProfilePage.vue'),
        meta: { title: 'Настройки' }
      },
      {
        path: 'chat',
        name: 'dashboard-chat',
        component: () => import('../pages/dashboard/DashboardChatPage.vue'),
        meta: { title: 'Чат' }
      },
      {
        path: 'declarator',
        name: 'dashboard-declarator',
        component: () => import('../pages/dashboard/DashboardDeclaratorPage.vue'),
        meta: { title: 'Декларатор' }
      },
      {
        path: 'notifications',
        name: 'dashboard-notifications',
        component: () => import('../pages/dashboard/DashboardNotificationsPage.vue'),
        meta: { title: 'Уведомления' }
      },
      {
        path: 'verification',
        name: 'dashboard-verification',
        component: () => import('../pages/dashboard/DashboardVerificationPage.vue'),
        meta: { title: 'Верификация' }
      }
    ]
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
    next({ name: 'home' })
    return
  }
  
  // Проверка ролей
  if (to.meta.allowedRoles) {
    const userRole = auth.user.value?.role
    const allowedRoles = to.meta.allowedRoles as string[]
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      next({ name: 'home' })
      return
    }
  }
  
  next()
})

export default router
