export interface Service {
  id: string
  sku?: string
  name: string
  brand?: string
  category?: string
  subcategory?: string
  description: string
  price: number
  colors?: string[]
  sizes?: string[]
  images: string[]
  customFields?: CustomField[]
  buyerId?: string
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt?: string
}

export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'select' | 'checkbox'
  required: boolean
  options?: string[]
  value?: unknown
}
