import type { PaginatedResponse, CatalogQueryParams } from '@/core/api/types'
import type { Service } from '@/entities/service/types'

const CATEGORIES = ['electronics', 'clothing', 'books', 'other'] as const
const getRandomCategory = (): string => CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)] || 'other'

export const catalogApi = {
  // Получить услуги с фильтрацией
  async getServices(params: CatalogQueryParams): Promise<PaginatedResponse<Service>> {
    // TODO: Заменить на реальный API вызов
    // const response = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>('/services', { params })
    // return response.data.data
    
    // Моковая реализация (пока)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Генерация моковых данных
        const mockServices: Service[] = Array.from({ length: 24 }, (_, i) => ({
          id: `service-${i + 1}`,
          name: `Услуга по выкупу товаров ${i + 1}`,
          description: `Профессиональный выкуп товаров из-за границы. Быстро, надежно, с гарантией.`,
          price: Math.floor(Math.random() * 10000) + 1000,
          category: getRandomCategory(),
          images: [],
          customFields: [],
          buyerId: `buyer-${Math.floor(Math.random() * 5) + 1}`,
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          reviewCount: Math.floor(Math.random() * 50),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }))
        
        // Фильтрация (пока на фронтенде, потом на бэкенде)
        let filtered = [...mockServices]
        
        if (params.search) {
          const searchLower = params.search.toLowerCase()
          filtered = filtered.filter(service => 
            service.name.toLowerCase().includes(searchLower) ||
            service.description.toLowerCase().includes(searchLower)
          )
        }
        
        if (params.category) {
          const categories = Array.isArray(params.category) ? params.category : [params.category]
          if (categories.length > 0) {
            filtered = filtered.filter(service => 
              categories.includes(service.category || 'other')
            )
          }
        }
        
        if (params.minPrice !== undefined) {
          filtered = filtered.filter(service => service.price >= params.minPrice!)
        }
        
        if (params.maxPrice !== undefined) {
          filtered = filtered.filter(service => service.price <= params.maxPrice!)
        }
        
        // Сортировка
        if (params.sortBy) {
      filtered.sort((a, b) => {
        let aValue: number
        let bValue: number
            
            switch (params.sortBy) {
              case 'price':
                aValue = a.price
                bValue = b.price
                break
              case 'rating':
                aValue = a.rating
                bValue = b.rating
                break
              case 'date':
                aValue = new Date(a.createdAt).getTime()
                bValue = new Date(b.createdAt).getTime()
                break
              default:
                return 0
            }
            
            const order = params.sortOrder === 'desc' ? -1 : 1
            return (aValue - bValue) * order
          })
        }
        
        // Пагинация
        const page = params.page || 1
        const limit = params.limit || 12
        const start = (page - 1) * limit
        const end = start + limit
        
        resolve({
          items: filtered.slice(start, end),
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit)
        })
      }, 300) // Имитация задержки сети
    })
  },
  
  // Получить категории
  async getCategories(): Promise<string[]> {
    // TODO: Заменить на реальный API вызов
    // const response = await apiClient.get<ApiResponse<string[]>>('/services/categories')
    // return response.data.data
    
    return ['electronics', 'clothing', 'books', 'other']
  },
  
  // Получить диапазон цен
  async getPriceRange(): Promise<{ min: number; max: number }> {
    // TODO: Заменить на реальный API вызов
    // const response = await apiClient.get<ApiResponse<{ min: number; max: number }>>('/services/price-range')
    // return response.data.data
    
    return { min: 1000, max: 10000 }
  }
}
