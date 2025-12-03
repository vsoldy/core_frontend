export type UserRole = 'user' | 'buyer' | 'manager' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar: string | null
  phone: string | null
  createdAt: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData extends LoginCredentials {
  name: string
  role?: UserRole
  phone?: string
}