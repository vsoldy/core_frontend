<template>
  <div class="app-wrapper" :class="{ 'dark-theme': isDarkTheme }">
    <!-- Хедер -->
    <header class="app-header">
      <div class="container">
        <router-link to="/" class="logo">
          SOLDY
        </router-link>

        <nav class="main-nav">
          <router-link to="/catalog" class="nav-link">
            Каталог
          </router-link>
          
          <router-link v-if="isUser" to="/cart" class="nav-link">
            Корзина 🛒
          </router-link>
          
          <router-link v-if="isBuyer" to="/execution" class="nav-link">
            Исполнение
          </router-link>
          
          <router-link v-if="isAdmin || isManager" to="/admin" class="nav-link">
            Админка
          </router-link>
        </nav>

        <div class="header-controls">
          <!-- Переключатель темы -->
           <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
          </div>
          <button @click="toggleTheme" class="theme-toggle">
            {{ isDarkTheme ? '🌙' : '☀️' }}
          </button>

          <!-- Тестовый переключатель ролей -->
          <div v-if="isAuthenticated" class="role-switcher">
            <select v-model="currentRole" @change="changeRole" class="role-select">
              <option value="user">👤 User</option>
              <option value="buyer">🛍️ Buyer</option>
              <option value="manager">👔 Manager</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>

          <!-- Профиль/Вход -->
          <div v-if="isAuthenticated" class="user-menu">
            <span class="user-name">{{ user?.name }} ({{ user?.role }})</span>
            <button @click="handleLogout" class="logout-btn">
              Выйти
            </button>
          </div>
          
          <div v-else class="auth-links">
            <router-link to="/login" class="auth-link">
              Войти
            </router-link>
            <router-link to="/register" class="auth-link register">
              Регистрация
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="app-main">
      <div class="container">
        <router-view />
      </div>
    </main>

    <!-- Футер -->
    <footer class="app-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>SOLDY</h3>
            <p>Сервис для выкупа товаров из других стран</p>
          </div>
          
          <div class="footer-section">
            <h3>Контакты</h3>
            <p>support@soldy.com</p>
            <p>+7 (XXX) XXX-XX-XX</p>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>© 2024 Soldy. Все права защищены.</p>
          <div class="footer-links">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Уведомления -->
    <div class="notifications-container">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-content">
          <strong>{{ notification.title }}</strong>
          <p>{{ notification.message }}</p>
        </div>
        <button @click.stop="removeNotification(notification.id)" class="notification-close">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore, useUiStore } from './stores'
import { useAuth } from './shared/composables/useAuth'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const authStore = useAuthStore()
const uiStore = useUiStore()
const auth = useAuth()
const router = useRouter()

const { user, isAuthenticated, isUser, isBuyer, isAdmin, isManager } = auth
const { theme, isDarkTheme, notifications } = storeToRefs(uiStore)
const { isLoading } = storeToRefs(authStore)

// Для тестирования - переключатель ролей
const currentRole = ref(user.value?.role || 'user')

// Следим за изменением пользователя
watch(user, (newUser) => {
  if (newUser) {
    currentRole.value = newUser.role
  }
})

const toggleTheme = () => {
  uiStore.toggleTheme()
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const removeNotification = (id: string) => {
  uiStore.removeNotification(id)
}

// Функция для смены роли
const changeRole = async () => {
  if (!user.value) return
  
  // Обновляем пользователя с новой ролью
  authStore.user = {
    ...user.value,
    role: currentRole.value
  }
  
  // Показываем уведомление
  uiStore.addNotification({
    type: 'success',
    title: 'Роль изменена',
    message: `Теперь вы ${currentRole.value}`,
    duration: 2000
  })
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.app-header {
  background-color: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: var(--border-radius-sm);
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.router-link-active {
  color: var(--primary-color);
  font-weight: 500;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-primary);
}

.role-switcher {
  margin-right: 0.5rem;
}

.role-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--background-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: var(--text-primary);
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.auth-links {
  display: flex;
  gap: 0.75rem;
}

.auth-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: var(--border-radius-sm);
}

.auth-link.register {
  background-color: var(--primary-color);
  color: white;
}

/* Main content */
.app-main {
  flex: 1;
  padding: 2rem 0;
}

/* Footer */
.app-footer {
  background-color: var(--background-secondary);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0 1.5rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.footer-section p {
  color: var(--text-secondary);
  margin: 0.25rem 0;
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
}

/* Notifications */
.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 400px;
  width: 100%;
}

.notification {
  background-color: var(--background-secondary);
  border-left: 4px solid;
  border-radius: var(--border-radius-md);
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: transform var(--transition-fast);
  animation: slideIn 0.3s ease;
}

.notification:hover {
  transform: translateX(-4px);
}

.notification-info {
  border-left-color: #3b82f6;
}

.notification-success {
  border-left-color: var(--accent-green);
}

.notification-warning {
  border-left-color: var(--accent-yellow);
}

.notification-error {
  border-left-color: var(--accent-red);
}

.notification-content {
  flex: 1;
}

.notification-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0 0.25rem;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.notification-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .app-header .container {
    flex-wrap: wrap;
  }
  
  .main-nav {
    order: 3;
    width: 100%;
    margin-top: 1rem;
    justify-content: flex-start;
    overflow-x: auto;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .notifications-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
 
  .loading-indicator {
    display: flex;
    align-items: center;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>