<template>
  <header class="app-header" :class="{ 'is-hidden': isHidden }" ref="headerEl">
    <div class="container">
      <div class="header-bar">
        <div class="header-left">
          <RouterLink to="/" class="logo">
            SOLDY
          </RouterLink>
          <button class="catalog-toggle" type="button" @click="toggleCatalogMenu" aria-label="Каталог">
            {{ isCatalogOpen ? '✕' : '☰' }}
          </button>
        </div>

        <form class="header-search" @submit.prevent="submitSearch">
          <input v-model="searchValue" type="search" placeholder="Поиск товаров..." />
          <button type="submit" aria-label="Найти">🔍</button>
        </form>

        <div class="header-actions">
          <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
          </div>

          <RouterLink to="/cart" class="cart-icon" aria-label="Корзина">
            🛒
            <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
          </RouterLink>

          <div v-if="isAuthenticated" class="cabinet-menu" ref="cabinetMenu">
            <button class="cabinet-trigger" type="button" @click="toggleCabinetMenu">
              Кабинет
              <span class="caret">▾</span>
            </button>
            <div v-if="isCabinetOpen" class="cabinet-dropdown">
              <template v-if="isUser">
                <RouterLink to="/dashboard/orders" class="cabinet-link" @click="closeCabinetMenu">История заказов</RouterLink>
                <RouterLink to="/dashboard/balance" class="cabinet-link" @click="closeCabinetMenu">Финансы</RouterLink>
                <RouterLink to="/dashboard/favorites" class="cabinet-link" @click="closeCabinetMenu">Избранное</RouterLink>
                <RouterLink to="/dashboard/addresses" class="cabinet-link" @click="closeCabinetMenu">Адреса доставки</RouterLink>
                <RouterLink to="/dashboard/profile" class="cabinet-link" @click="closeCabinetMenu">Настройки</RouterLink>
                <RouterLink to="/support/new" class="cabinet-link" @click="closeCabinetMenu">Помощь</RouterLink>
              </template>
              <template v-else>
                <RouterLink to="/dashboard" class="cabinet-link" @click="closeCabinetMenu">Кабинет</RouterLink>
              </template>
              <button class="cabinet-link logout-link" type="button" @click="handleLogout">Выйти</button>
            </div>
          </div>

          <div v-if="isAuthenticated" class="role-switcher">
    <select v-model="currentRole" @change="handleRoleChange" class="role-select">
      <option value="user">👤 User</option>
      <option value="buyer">🛍️ Buyer</option>
      <option value="manager">👔 Manager</option>
      <option value="admin">👑 Admin</option>
    </select>
  </div>

  <div v-if="!isAuthenticated" class="auth-links">
    <RouterLink to="/login" class="auth-link">
      Войти
    </RouterLink>
    <RouterLink to="/register" class="auth-link register">
      Регистрация
    </RouterLink>
  </div>
        </div>
        </div>
      </div>

      <div v-if="isCatalogOpen" class="catalog-backdrop" @click="closeCatalogMenu"></div>
      <aside :class="['catalog-drawer', { open: isCatalogOpen }]">
        <div class="drawer-head">
          <div class="drawer-title">Каталог</div>
          <button class="drawer-close" type="button" @click="closeCatalogMenu" aria-label="Закрыть каталог">✕</button>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title">Категории</div>
          <div v-for="category in catalogCategories" :key="category.value" class="drawer-category">
            <RouterLink
              class="drawer-link"
              :to="{ name: 'services', query: { category: category.value } }"
              @click="closeCatalogMenu"
            >
              {{ category.label }}
            </RouterLink>
            <div class="drawer-subcategories">
              <RouterLink
                v-for="sub in category.subcategories"
                :key="sub.value"
                class="drawer-sub-link"
                :to="{ name: 'services', query: { category: category.value, subcategory: sub.value } }"
                @click="closeCatalogMenu"
              >
                {{ sub.label }}
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title">Бренды</div>
          <div class="drawer-grid">
            <RouterLink
              v-for="brand in catalogBrands"
              :key="brand.value"
              class="drawer-link"
              :to="{ name: 'services', query: { brand: brand.value } }"
              @click="closeCatalogMenu"
            >
              {{ brand.label }}
            </RouterLink>
          </div>
        </div>
      </aside>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore, useUiStore } from '@/stores'
import { useCartStore } from '@/stores/cart'
import { useAuth } from '@/shared/composables/useAuth'
import type { UserRole } from '@/entities/user/types'

const authStore = useAuthStore()
const cartStore = useCartStore()
const uiStore = useUiStore()
const auth = useAuth()
const router = useRouter()
const route = useRoute()
const hideOnRoutes: string[] = []

const { user, isAuthenticated, isLoading, isUser } = auth
const { totalItems } = storeToRefs(cartStore)

const currentRole = ref<UserRole>(user.value?.role || 'user')
const headerEl = ref<HTMLElement | null>(null)
const isHidden = ref(false)
const isCabinetOpen = ref(false)
const cabinetMenu = ref<HTMLElement | null>(null)
const isCatalogOpen = ref(false)
let lastScrollY = 0
const searchValue = ref((route.query.search as string) || '')

const catalogCategories = [
  {
    label: 'Электроника',
    value: 'electronics',
    subcategories: [
      { label: 'Смартфоны', value: 'smartphones' },
      { label: 'Ноутбуки', value: 'laptops' },
      { label: 'Аксессуары', value: 'accessories' }
    ]
  },
  {
    label: 'Одежда',
    value: 'clothing',
    subcategories: [
      { label: 'Верхняя одежда', value: 'outerwear' },
      { label: 'Обувь', value: 'shoes' },
      { label: 'Аксессуары', value: 'fashion-accessories' }
    ]
  },
  {
    label: 'Книги',
    value: 'books',
    subcategories: [
      { label: 'Бестселлеры', value: 'bestsellers' },
      { label: 'Комиксы', value: 'comics' },
      { label: 'Учебные', value: 'education' }
    ]
  },
  {
    label: 'Другое',
    value: 'other',
    subcategories: [
      { label: 'Хобби', value: 'hobby' },
      { label: 'Дом', value: 'home' }
    ]
  }
]

const catalogBrands = [
  { label: 'Apple', value: 'apple' },
  { label: 'Samsung', value: 'samsung' },
  { label: 'Nike', value: 'nike' },
  { label: 'Adidas', value: 'adidas' },
  { label: 'Zara', value: 'zara' },
  { label: 'H&M', value: 'hm' },
  { label: 'Uniqlo', value: 'uniqlo' },
  { label: 'Sony', value: 'sony' }
]

watch(user, (newUser) => {
  if (newUser) {
    currentRole.value = newUser.role
  }
})

watch(
  () => route.fullPath,
  () => {
    closeCabinetMenu()
    closeCatalogMenu()
    searchValue.value = (route.query.search as string) || ''
  }
)

const handleResize = () => {
  updateHeaderOffset()
}

const updateHeaderOffset = () => {
  requestAnimationFrame(() => {
    const height = headerEl.value?.offsetHeight ?? 0
    document.documentElement.style.setProperty('--header-offset', `${height}px`)
  })
}

onMounted(() => {
  nextTick(() => {
    handleResize()
    updateHeaderOffset()
  })
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
})

function toggleCabinetMenu() {
  isCabinetOpen.value = !isCabinetOpen.value
}

function closeCabinetMenu() {
  isCabinetOpen.value = false
}

function closeCatalogMenu() {
  isCatalogOpen.value = false
}

function toggleCatalogMenu() {
  isCatalogOpen.value = !isCatalogOpen.value
}

function submitSearch() {
  const query = searchValue.value.trim()
  const baseQuery = route.name === 'services' ? { ...route.query } : {}
  if ('search' in baseQuery) {
    delete (baseQuery as Record<string, unknown>).search
  }
  router.push({
    name: 'services',
    query: query ? { ...baseQuery, search: query } : baseQuery
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const handleRoleChange = () => {
  if (!user.value) return
  authStore.changeRole(currentRole.value)
  uiStore.addNotification({
    type: 'success',
    title: 'Роль изменена',
    message: `Теперь вы ${currentRole.value}`,
    duration: 2000
  })
}

const handleScroll = () => {
  const currentY = window.scrollY
  const delta = currentY - lastScrollY

  if (!hideOnRoutes.includes((route.name as string) || '')) {
    isHidden.value = false
    lastScrollY = currentY
    updateRootHiddenClass()
    updateHeaderOffset()
    return
  }

  if (currentY <= 0) {
    isHidden.value = false
  } else if (delta > 6) {
    isHidden.value = true
  } else if (delta < -6) {
    isHidden.value = false
  }

  lastScrollY = currentY
  updateHeaderOffset()
  updateRootHiddenClass()
}

const updateRootHiddenClass = () => {
  const root = document.documentElement
  if (isHidden.value) {
    root.classList.add('header-hidden')
  } else {
    root.classList.remove('header-hidden')
  }
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (cabinetMenu.value && !cabinetMenu.value.contains(target)) {
    closeCabinetMenu()
  }
}
</script>

<style scoped>
.app-header {
  background-color: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1500;
  min-height: var(--header-height);
  transition: transform var(--transition-normal);
}

.app-header.is-hidden {
  transform: translateY(-100%);
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 0;
  position: relative;
  flex-wrap: wrap;
}

.logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-primary);
  text-decoration: none;
  letter-spacing: 0.02em;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: var(--background-tertiary);
}

.cta-link {
  background: var(--primary-color);
  color: white;
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.theme-toggle {
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 1rem;
}

.role-switcher .role-select {
  padding: 0.45rem 0.75rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--text-primary);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.logout-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.35rem 0.75rem;
  border-radius: var(--border-radius-md);
  cursor: pointer;
}

.user-menu.mobile {
  flex-direction: column;
  align-items: flex-start;
}

.auth-links.mobile {
  flex-direction: column;
  align-items: flex-start;
}

.auth-links {
  display: flex;
  gap: 0.5rem;
}

.cart-link,
.cart-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  position: relative;
}

.cart-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--primary-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}

.cart-icon {
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  text-decoration: none;
  color: var(--text-primary);
  background: var(--background-secondary);
  margin-right: 0.35rem;
}

.cart-icon:hover {
  border-color: var(--primary-color-light);
  color: var(--primary-color-dark);
}

.cabinet-menu {
  position: relative;
}

.cabinet-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  color: var(--text-primary);
  font: inherit;
  cursor: pointer;
  padding: 0.35rem 0.4rem;
}

.caret {
  font-size: 0.75rem;
  opacity: 0.7;
}

.cabinet-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.4rem);
  min-width: 220px;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  display: grid;
  gap: 0.1rem;
  padding: 0.35rem;
  z-index: 2000;
}

.cabinet-link {
  text-decoration: none;
  color: var(--text-primary);
  padding: 0.55rem 0.75rem;
  border-radius: var(--border-radius-sm);
}

.cabinet-link:hover {
  background: var(--background-tertiary);
}

.cabinet-link.logout-link {
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-primary);
}

.catalog-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.catalog-caret {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.35rem 0.25rem;
  font-size: 0.9rem;
}

.header-left {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.catalog-toggle {
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  font-size: 1rem;
  cursor: pointer;
}

.header-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 520px;
  margin: 0 1rem;
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 0.25rem 0.5rem;
}

.header-search input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 0.4rem 0.5rem;
  font-size: 0.95rem;
}

.header-search input:focus {
  outline: none;
}

.header-search button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.catalog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  z-index: 1400;
}

.catalog-drawer {
  position: fixed;
  top: 0;
  left: -360px;
  width: 320px;
  height: 100vh;
  background: var(--background-secondary);
  border-right: 1px solid var(--border-color);
  padding: 1rem 1.2rem 2rem;
  display: grid;
  gap: 1rem;
  transition: transform var(--transition-normal);
  z-index: 1501;
  overflow-y: auto;
}

.catalog-drawer.open {
  transform: translateX(360px);
}

.drawer-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  font-weight: 700;
  font-size: 1.1rem;
}

.drawer-close {
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.drawer-section {
  display: grid;
  gap: 0.75rem;
}

.drawer-section-title {
  font-weight: 700;
  color: var(--text-primary);
}

.drawer-category {
  display: grid;
  gap: 0.4rem;
}

.drawer-link,
.drawer-sub-link {
  text-decoration: none;
  color: var(--text-primary);
  padding: 0.4rem 0.5rem;
  border-radius: var(--border-radius-sm);
}

.drawer-sub-link {
  color: var(--text-secondary);
  padding-left: 1rem;
}

.drawer-link:hover,
.drawer-sub-link:hover {
  background: var(--background-tertiary);
}

.drawer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
}


.auth-link {
  text-decoration: none;
  color: var(--text-primary);
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-md);
  border: 1px solid transparent;
}

.auth-link.register {
  border-color: var(--border-color);
}

.loading-indicator .spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.nav-toggle {
  display: none;
  width: 42px;
  height: 42px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--background-tertiary);
  align-items: center;
  justify-content: center;
}

.nav-toggle span,
.nav-toggle span::before,
.nav-toggle span::after {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--text-primary);
  position: relative;
  transition: all var(--transition-fast);
  content: '';
}

.nav-toggle span::before {
  top: -6px;
  position: absolute;
}

.nav-toggle span::after {
  top: 6px;
  position: absolute;
}

.nav-toggle span.open {
  background: transparent;
}

.nav-toggle span.open::before {
  transform: translateY(6px) rotate(45deg);
}

.nav-toggle span.open::after {
  transform: translateY(-6px) rotate(-45deg);
}

.nav-extra {
  display: none;
  gap: 0.5rem;
  flex-direction: column;
}

@media (max-width: 900px) {
  .main-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--background-secondary);
    border-bottom: 1px solid var(--border-color);
    padding: 0.75rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transform: translateY(-140%);
    opacity: 0;
    pointer-events: none;
    transition: transform var(--transition-normal), opacity var(--transition-normal);
    box-shadow: var(--shadow-md);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    z-index: 1600;
  }

  .main-nav.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-toggle {
    display: inline-flex;
  }

  .header-bar {
    align-items: center;
  }

  .header-actions {
    display: none;
  }

  .nav-extra {
    display: flex;
    margin-top: 0.5rem;
    gap: 0.5rem;
  }
}

@media (max-width: 640px) {
  .header-bar {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.65rem 0;
  }
  
  .logo {
    flex: 1;
  }

  .user-menu {
    width: 100%;
    justify-content: flex-end;
    gap: 0.35rem;
  }

  .nav-link {
    width: 100%;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
