import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  timestamp: number
}

export const useUiStore = defineStore('ui', () => {
  // Тема - исправляем инициализацию
  const theme = ref<Theme>(localStorage.getItem('theme') as Theme || 'light')

  // Язык
  const language = ref<string>(localStorage.getItem('language') || 'ru')

  // Уведомления
  const notifications = ref<Notification[]>([])

  // Компьютед свойства
  const isDarkTheme = computed(() => theme.value === 'dark')

  // Действия
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    updateThemeClass()
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    updateThemeClass()
  }

  const updateThemeClass = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString()
    const fullNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now()
    }
    
    notifications.value.unshift(fullNotification)

    // Автоматическое удаление
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  // Инициализация темы при создании
  updateThemeClass()

  return {
    // Состояние
    theme,
    language,
    notifications,
    
    // Геттеры
    isDarkTheme,
    
    // Действия
    toggleTheme,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications
  }
})