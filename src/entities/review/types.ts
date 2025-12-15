export interface Review {
  id: string
  serviceId: string
  author: string
  role: 'user' | 'buyer'
  rating: number
  comment: string
  createdAt: string
}
