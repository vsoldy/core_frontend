export type OrderStatus = 'created' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  userId: string
  buyerId: string
  serviceId: string
  status: OrderStatus
  price: number
  quantity: number
  customFieldsData: Record<string, unknown>
  createdAt: string
  updatedAt?: string
  completedAt?: string
}

export interface OrderHistoryItem {
  id: string
  orderId: string
  status: OrderStatus
  changedBy: string
  comment?: string
  createdAt: string
}
