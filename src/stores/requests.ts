import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Request } from '@/entities/request/types'

const categories = ['electronics', 'clothing', 'books', 'other'] as const

const mockRequests: Request[] = Array.from({ length: 12 }, (_, i) => {
  const category = categories[Math.floor(Math.random() * categories.length)] || 'other'
  return {
    id: `request-${i + 1}`,
    title: `Запрос на выкуп ${i + 1}`,
    description: 'Нужен выкуп товара с проверкой и быстрой отправкой.',
    budget: Math.floor(Math.random() * 4000) + 3000,
    category,
    address: 'Москва, Тверская 10',
    deadline: new Date(Date.now() + (i + 2) * 24 * 3600 * 1000).toISOString(),
    userId: 'user-1',
    createdAt: new Date(Date.now() - i * 12 * 3600 * 1000).toISOString()
  }
})

export const useRequestsStore = defineStore('requests', () => {
  const requests = ref<Request[]>([...mockRequests])
  const isLoading = ref(false)

  const filteredRequests = computed(() => requests.value)

  const loadRequests = async () => {
    isLoading.value = true
    try {
      // TODO: replace with API call
      return requests.value
    } finally {
      isLoading.value = false
    }
  }

  const getRequestById = (id: string) => requests.value.find((req) => req.id === id) || null

  const createRequest = (payload: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: Request = {
      ...payload,
      id: `request-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    requests.value.unshift(newRequest)
    return newRequest
  }

  return {
    requests,
    isLoading,
    filteredRequests,
    loadRequests,
    getRequestById,
    createRequest
  }
})
