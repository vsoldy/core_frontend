import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  return {
    // Данные пользователя
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),

    // Проверка ролей
    isUser: computed(() => authStore.isUser),
    isBuyer: computed(() => authStore.isBuyer),
    isManager: computed(() => authStore.isManager),
    isAdmin: computed(() => authStore.isAdmin),

    // Методы
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth
  }
}