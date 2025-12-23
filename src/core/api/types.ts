export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CatalogQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string | string[]
  brand?: string | string[]
  subcategory?: string | string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'rating' | 'date'
  sortOrder?: 'asc' | 'desc'
  catalogType?: 'services' | 'requests'
}
