import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { user, token, isAuthenticated, isLoading, isUser, isBuyer, isManager, isAdmin } = storeToRefs(authStore)

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isUser,
    isBuyer,
    isManager,
    isAdmin,
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth,
    changeRole: authStore.changeRole,
    register: authStore.register
  }
}
