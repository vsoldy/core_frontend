import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Service } from '@/entities/service/types'
import type { CatalogFilter, Pagination } from '@/entities/catalog/types'
import type { CatalogQueryParams } from '@/core/api/types'

// Список категорий для гарантии string типа
const CATEGORIES: string[] = ['electronics', 'clothing', 'books', 'other']

// Хелпер функция для получения случайной категории
const getRandomCategory = (): string => {
  const index = Math.floor(Math.random() * CATEGORIES.length)
  return CATEGORIES[index]
}

// Mock API функция (позже заменим на реальный API)
const mockApi = {
  async getServices(params: CatalogQueryParams) {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Генерация моковых данных с гарантированными типами
    const allServices: Service[] = Array.from({ length: 100 }, (_, i) => {
      return {
        id: `service-${i + 1}`,
        name: params.catalogType === 'requests' 
          ? `Запрос на выкуп товара ${i + 1}`
          : `Услуга по выкупу товаров ${i + 1}`,
        description: params.catalogType === 'requests'
          ? `Нужно выкупить товар из США. Требуется помощь с покупкой и доставкой.`
          : `Профессиональный выкуп товаров из-за границы. Быстро, надежно, с гарантией. Услуга ${i + 1} включает полное сопровождение.`,
        price: Math.floor(Math.random() * 9000) + 1000, // 1000-10000
        category: getRandomCategory(), // Гарантированно string
        images: [],
        customFields: [],
        buyerId: `buyer-${Math.floor(Math.random() * 5) + 1}`,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3-5 звезд
        reviewCount: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
    
    // Фильтрация (имитация бэкенд фильтрации)
    let filtered = [...allServices]
    
    // Поиск
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Категории
    if (params.category) {
      const categories = Array.isArray(params.category) ? params.category : [params.category]
      if (categories.length > 0) {
        filtered = filtered.filter(service => 
          categories.includes(service.category)
        )
      }
    }
    
    // Цена
    if (params.minPrice !== undefined) {
      filtered = filtered.filter(service => service.price >= params.minPrice!)
    }
    
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter(service => service.price <= params.maxPrice!)
    }
    
    // Сортировка
    if (params.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any
        
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
    
    return {
      items: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    }
  },
  
  async getCategories(): Promise<string[]> {
    return CATEGORIES
  },
  
  async getPriceRange(): Promise<{ min: number; max: number }> {
    return { min: 1000, max: 10000 }
  }
}

export const useCatalogStore = defineStore('catalog', () => {
  // Состояние
  const services = ref<Service[]>([])
  const isLoading = ref(false)
  const filters = ref<CatalogFilter>({})
  const pagination = ref<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  
  // Кэшированные данные
  const cachedCategories = ref<string[]>(CATEGORIES)
  const cachedPriceRange = ref<{ min: number; max: number }>({ min: 1000, max: 10000 })

  // Геттеры
  const filteredServices = computed(() => services.value)
  const categories = computed(() => cachedCategories.value)
  const priceRange = computed(() => cachedPriceRange.value)
  
  const paginatedServices = computed(() => services.value)

  // Действия
  const loadServices = async (catalogType: 'buyer-service' | 'user-request' = 'buyer-service') => {
    isLoading.value = true
    try {
      const params: CatalogQueryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        catalogType: catalogType === 'buyer-service' ? 'services' : 'requests',
        ...filters.value
      }
      
      const response = await mockApi.getServices(params)
      
      services.value = response.items
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      }
      
    } catch (error) {
      console.error('Error loading services:', error)
      services.value = []
      pagination.value.total = 0
      pagination.value.totalPages = 0
      
      // Fallback на локальную генерацию при ошибке
      generateMockServices(catalogType)
    } finally {
      isLoading.value = false
    }
  }

  const loadCategories = async () => {
    try {
      const categories = await mockApi.getCategories()
      cachedCategories.value = categories
      return categories
    } catch (error) {
      console.error('Error loading categories:', error)
      cachedCategories.value = CATEGORIES
      return cachedCategories.value
    }
  }

  const loadPriceRange = async () => {
    try {
      const range = await mockApi.getPriceRange()
      cachedPriceRange.value = range
      return range
    } catch (error) {
      console.error('Error loading price range:', error)
      cachedPriceRange.value = { min: 1000, max: 10000 }
      return cachedPriceRange.value
    }
  }

  const setFilters = (newFilters: Partial<CatalogFilter>) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1
  }

  const resetFilters = () => {
    filters.value = {}
    pagination.value.page = 1
  }

  const setPage = (page: number) => {
    pagination.value.page = page
  }

  // Fallback функция для генерации моковых данных
  const generateMockServices = (type: 'buyer-service' | 'user-request') => {
    const mockServices: Service[] = Array.from({ length: 24 }, (_, i) => {
      return {
        id: `service-${i + 1}`,
        name: type === 'buyer-service' 
          ? `Услуга по выкупу товаров ${i + 1}`
          : `Запрос на выкуп товара ${i + 1}`,
        description: type === 'buyer-service'
          ? `Профессиональный выкуп товаров из-за границы. Быстро, надежно, с гарантией.`
          : `Нужно выкупить товар из США. Требуется помощь с покупкой и доставкой.`,
        price: Math.floor(Math.random() * 9000) + 1000,
        category: getRandomCategory(),
        images: [],
        customFields: [],
        buyerId: `buyer-${Math.floor(Math.random() * 5) + 1}`,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
    
    services.value = mockServices
    pagination.value.total = mockServices.length
    pagination.value.totalPages = Math.ceil(mockServices.length / pagination.value.limit)
  }

  // Инициализация при создании хранилища
  const initialize = async () => {
    await Promise.all([
      loadCategories(),
      loadPriceRange()
    ])
  }

  // Вызываем инициализацию
  initialize()

  return {
    // Состояние
    services,
    isLoading,
    filters,
    pagination,
    
    // Геттеры
    filteredServices,
    paginatedServices,
    categories,
    priceRange,
    
    // Действия
    setFilters,
    resetFilters,
    setPage,
    loadServices,
    loadCategories,
    loadPriceRange
  }
})