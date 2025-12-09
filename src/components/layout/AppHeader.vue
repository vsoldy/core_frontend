<template>
  <header class="app-header" :class="{ 'is-hidden': isHidden }" ref="headerEl">
    <div class="container">
      <div class="header-bar">
        <RouterLink to="/" class="logo">
          SOLDY
        </RouterLink>

        <button class="nav-toggle" type="button" @click="toggleNav" aria-label="Toggle navigation">
          <span :class="{ open: isNavOpen }"></span>
        </button>

        <nav :class="['main-nav', { open: isNavOpen }]">
          <RouterLink to="/catalog" class="nav-link">
            Каталог
          </RouterLink>
          
          <RouterLink v-if="isUser" to="/cart" class="nav-link">
            Корзина 🛒
          </RouterLink>
          
          <RouterLink v-if="isBuyer" to="/execution" class="nav-link">
            Исполнение
          </RouterLink>
          
          <RouterLink v-if="isAdmin || isManager" to="/admin" class="nav-link">
            Админка
          </RouterLink>
          
          <RouterLink v-if="isAuthenticated" to="/profile" class="nav-link">
            Профиль
          </RouterLink>

          <div v-if="isMobileView" class="nav-extra">
            <button v-if="!isAuthenticated" @click="toggleTheme" class="theme-toggle">
              {{ isDarkTheme ? '🌙' : '☀️' }}
            </button>

            <div v-if="isAuthenticated" class="user-menu mobile">
              <span class="user-name">{{ user?.name }} ({{ user?.role }})</span>
              <button @click="handleLogout" class="logout-btn">
                Выйти
              </button>
            </div>
            
            <div v-else class="auth-links mobile">
              <RouterLink to="/login" class="auth-link">
                Войти
              </RouterLink>
              <RouterLink to="/register" class="auth-link register">
                Регистрация
              </RouterLink>
            </div>
          </div>
        </nav>

        <div class="header-actions">
          <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
          </div>

          <button v-if="!isAuthenticated" @click="toggleTheme" class="theme-toggle">
            {{ isDarkTheme ? '🌙' : '☀️' }}
          </button>

          <div v-if="isAuthenticated" class="role-switcher">
            <select v-model="currentRole" @change="handleRoleChange" class="role-select">
              <option value="user">👤 User</option>
              <option value="buyer">🛍️ Buyer</option>
              <option value="manager">👔 Manager</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>

          <div v-if="isAuthenticated" class="user-menu">
            <span class="user-name">{{ user?.name }} ({{ user?.role }})</span>
            <button @click="handleLogout" class="logout-btn">
              Выйти
            </button>
          </div>
          
          <div v-else class="auth-links">
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
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore, useUiStore } from '@/stores'
import { useAuth } from '@/shared/composables/useAuth'
import type { UserRole } from '@/entities/user/types'

const authStore = useAuthStore()
const uiStore = useUiStore()
const auth = useAuth()
const router = useRouter()
const route = useRoute()
const hideOnRoutes = ['catalog']

const { user, isAuthenticated, isUser, isBuyer, isAdmin, isManager, isLoading } = auth
const { isDarkTheme } = storeToRefs(uiStore)

const isNavOpen = ref(false)
const currentRole = ref<UserRole>(user.value?.role || 'user')
const isMobileView = ref(false)
const headerEl = ref<HTMLElement | null>(null)
const isHidden = ref(false)
let lastScrollY = 0

watch(user, (newUser) => {
  if (newUser) {
    currentRole.value = newUser.role
  }
})

watch(
  () => route.fullPath,
  () => {
    isNavOpen.value = false
  }
)

const handleResize = () => {
  isMobileView.value = window.innerWidth <= 900
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
})

watch(isNavOpen, () => {
  updateHeaderOffset()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
})

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const toggleTheme = () => {
  uiStore.toggleTheme()
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
