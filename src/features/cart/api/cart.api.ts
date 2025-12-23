import { apiClient } from '@/core/api/client'
import type { ApiResponse } from '@/core/api/types'

export interface CartSyncItem {
  serviceId: string
  quantity: number
  selectedOptions?: Record<string, unknown>
}

export interface CartSyncPayload {
  items: CartSyncItem[]
}

export interface CartResponseItem {
  service: unknown
  quantity: number
  selectedOptions?: Record<string, unknown>
}

export const cartApi = {
  async syncCart(payload: CartSyncPayload) {
    // TODO: заменить на реальный API вызов /cart/sync
    try {
      await apiClient.post('/cart/sync', payload)
    } catch (error) {
      throw error
    }
  },
  async getCart(): Promise<CartResponseItem[] | null> {
    // TODO: заменить на реальный API вызов /cart
    try {
      const response = await apiClient.get<ApiResponse<CartResponseItem[]>>('/cart')
      return response.data.data
    } catch (error) {
      throw error
    }
  }
}
