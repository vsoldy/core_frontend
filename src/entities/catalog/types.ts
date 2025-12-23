export type CatalogType = 'services' | 'requests'
export type ServiceType = 'buyer-service' | 'user-request'

export interface CatalogFilter {
  category?: string | string[]
  brand?: string | string[]
  subcategory?: string | string[]
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'price' | 'rating' | 'date'
  sortOrder?: 'asc' | 'desc'
  buyerId?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}
