export interface Request {
  id: string
  title: string
  description: string
  budget: number
  category: string
  address?: string
  deadline?: string
  userId: string
  createdAt: string
  updatedAt?: string
}
