import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Service } from '@/entities/service/types'

export interface CartItem {
  service: Service
  quantity: number
  selectedOptions?: Record<string, unknown>
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

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
    toggleCart
  }
})
