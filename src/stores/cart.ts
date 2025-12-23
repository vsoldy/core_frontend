import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Service } from '@/entities/service/types'
import { cartApi } from '@/features/cart/api/cart.api'

export interface CartItem {
  service: Service
  quantity: number
  selectedOptions?: Record<string, unknown>
}

const CART_STORAGE_KEY = 'soldy_cart_items_v1'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as CartItem[]
      if (Array.isArray(parsed)) {
        items.value = parsed
      }
    } catch (error) {
      console.warn('Failed to load cart from storage', error)
    }
  }

  // Геттеры
  const totalItems = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => 
      total + (item.service.price * item.quantity), 0
    )
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Действия
  const addToCart = (service: Service, quantity: number = 1, options?: Record<string, unknown>) => {
    const existingItem = items.value.find(item => 
      item.service.id === service.id && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(options)
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        service,
        quantity,
        selectedOptions: options
      })
    }
  }

  const removeFromCart = (serviceId: string, options?: Record<string, unknown>) => {
    items.value = items.value.filter(item => 
      !(item.service.id === serviceId && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(options))
    )
  }

  const updateQuantity = (serviceId: string, quantity: number, options?: Record<string, unknown>) => {
    const item = items.value.find(item => 
      item.service.id === serviceId && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(options)
    )
    
    if (item) {
      if (quantity <= 0) {
        removeFromCart(serviceId, options)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  const syncAfterLogin = async () => {
    try {
      const payload = {
        items: items.value.map((item) => ({
          serviceId: item.service.id,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions
        }))
      }
      await cartApi.syncCart(payload)
      const serverItems = await cartApi.getCart()
      if (serverItems?.length) {
        items.value = serverItems as CartItem[]
      }
    } catch (error) {
      console.warn('Failed to sync cart with server', error)
    }
  }

  watch(
    items,
    (value) => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value))
      } catch (error) {
        console.warn('Failed to persist cart', error)
      }
    },
    { deep: true }
  )

  loadFromStorage()

  return {
    // Состояние
    items,
    isOpen,
    
    // Геттеры
    totalItems,
    totalPrice,
    isEmpty,
    
    // Действия
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    syncAfterLogin
  }
})
