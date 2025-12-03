import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserRole } from '@/entities/user/types'

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role?: UserRole
}

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isLoading = ref(false)

  // Геттеры для проверки ролей
  const isUser = computed(() => user.value?.role === 'user')
  const isBuyer = computed(() => user.value?.role === 'buyer')
  const isManager = computed(() => user.value?.role === 'manager')
  const isAdmin = computed(() => user.value?.role === 'admin')

  const changeRole = (newRole: UserRole) => {
    if (user.value) {
        user.value = {
          ...user.value,
          role: newRole
        }
    }
  }

  // Действия
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    isLoading.value = true
    try {
      // TODO: Заменить на реальный API вызов
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        role: 'user' as UserRole,
        avatar: null,
        phone: null,
        createdAt: new Date().toISOString()
      }
      
      user.value = mockUser
      token.value = 'mock-token'
      
      // Сохраняем токен в зависимости от rememberMe
      if (rememberMe) {
        localStorage.setItem('auth_token', 'mock-token')
      } else {
        sessionStorage.setItem('auth_token', 'mock-token')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_token')
  }

  const checkAuth = async () => {
    const tokenFromLocal = localStorage.getItem('auth_token')
    const tokenFromSession = sessionStorage.getItem('auth_token')
    
    if (tokenFromLocal || tokenFromSession) {
      token.value = tokenFromLocal || tokenFromSession
      
      // TODO: Проверка токена через API
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as UserRole,
        avatar: null,
        phone: null,
        createdAt: new Date().toISOString()
      }
      user.value = mockUser
    }
  }

  const register = async (data: RegisterData) => {
    isLoading.value = true
    try {
      // TODO: Заменить на реальный API вызов
      const mockUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role || 'user',
        avatar: null,
        phone: data.phone || null,
        createdAt: new Date().toISOString()
      }
      
      user.value = mockUser
      token.value = 'mock-token'
      localStorage.setItem('auth_token', 'mock-token')
      
      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Registration failed' }
    } finally {
      isLoading.value = false
    }
  }


  return {
    // Состояние
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Геттеры
    isUser,
    isBuyer,
    isManager,
    isAdmin,
    
    // Действия
    login,
    logout,
    checkAuth,
    changeRole,
    register
  }
})