<template>
  <div class="catalog-page">
    <!-- Поисковая строка (всегда видна) -->
    <div class="search-section">
      <div class="container">
        <div class="search-container">
          <div class="search-input-wrapper">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск услуг..."
              class="search-input"
              @input="onSearchInput"
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <button 
            class="filters-btn"
            @click="showFilters = true"
          >
            <span class="filters-icon">⚙️</span>
            Фильтры
            <span v-if="hasActiveFilters" class="active-filters-badge"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Контролы и статистика -->
    <div class="catalog-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1 class="catalog-title">
              <template v-if="catalogType === 'services'">
                Услуги по выкупу
              </template>
              <template v-else>
                Запросы пользователей
              </template>
            </h1>
            
            <div v-if="isBuyer" class="catalog-type-switcher">
              <button
                :class="['type-btn', { 'type-btn-active': catalogType === 'services' }]"
                @click="switchCatalogType('services')"
              >
                Услуги
              </button>
              <button
                :class="['type-btn', { 'type-btn-active': catalogType === 'requests' }]"
                @click="switchCatalogType('requests')"
              >
                Запросы
              </button>
            </div>
          </div>
          
          <div class="header-stats">
            <span class="stat-item">Найдено: {{ filteredServices.length }}</span>
            <span class="stat-item">Всего: {{ totalServices }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной контент (карточки) -->
    <div class="catalog-main">
      <div class="container">
        <!-- Индикатор загрузки -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Загрузка услуг...</p>
        </div>

        <!-- Сообщение при отсутствии результатов -->
        <div v-else-if="paginatedServices.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Услуги не найдены</h3>
          <p>Попробуйте изменить параметры поиска или фильтры</p>
          <button @click="resetAllFilters" class="reset-btn">
            Сбросить все фильтры
          </button>
        </div>

        <!-- Сетка карточек -->
        <div v-else class="services-grid">
          <ServiceCard
            v-for="service in paginatedServices"
            :key="service.id"
            :service="service"
            :show-add-to-cart="catalogType === 'services'"
            :show-take-order="catalogType === 'requests'"
            @add-to-cart="handleAddToCart"
            @take-order="handleTakeOrder"
          />
        </div>

        <!-- Пагинация -->
        <div v-if="!isLoading && paginatedServices.length > 0" class="pagination">
          <button
            :disabled="pagination.page === 1"
            @click="previousPage"
            class="pagination-btn"
          >
            ← Назад
          </button>
          
          <div class="pagination-info">
            Страница {{ pagination.page }} из {{ pagination.totalPages }}
          </div>
          
          <button
            :disabled="pagination.page === pagination.totalPages"
            @click="nextPage"
            class="pagination-btn"
          >
            Далее →
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка фильтров (отдельная страница) -->
    <div v-if="showFilters" class="filters-modal">
      <div class="filters-modal-header">
        <div class="container">
          <div class="filters-header-content">
            <h2 class="filters-title">Фильтры</h2>
            <div class="filters-header-actions">
              <button @click="resetAllFilters" class="reset-all-btn">
                Сбросить все
              </button>
              <button @click="showFilters = false" class="close-filters-btn">
                Готово
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="filters-modal-content">
        <div class="container">
          <CatalogFilters
            :filters="filters"
            :categories="categories"
            :price-range="priceRange"
            @update:filters="handleFiltersUpdate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce } from 'lodash-es'
import { useCatalogStore } from '@/stores/catalog'
import { useAuth } from '@/shared/composables/useAuth'
import { useUiStore } from '@/stores/ui'
import CatalogFilters from '@/features/catalog/components/CatalogFilters.vue'
import ServiceCard from '@/features/catalog/components/ServiceCard.vue'
import type { CatalogFilter } from '@/entities/catalog/types'

const catalogStore = useCatalogStore()
const { isBuyer } = useAuth()
const uiStore = useUiStore()

// Получаем все реактивные свойства из хранилища через storeToRefs
const {
  services,
  isLoading,
  filters,
  pagination,
  paginatedServices,
  filteredServices,
  categories,
  priceRange
} = storeToRefs(catalogStore)

// Тип каталога
const catalogType = ref<'services' | 'requests'>('services')
// Показывать ли фильтры (модалка)
const showFilters = ref(false)
// Поисковый запрос
const searchQuery = ref('')

// Загружаем данные при монтировании
onMounted(() => {
  loadCatalogData()
})

// Переключение типа каталога
const switchCatalogType = (type: 'services' | 'requests') => {
  catalogType.value = type
  catalogStore.resetFilters()
  searchQuery.value = ''
  loadCatalogData()
}

// Загрузка данных каталога
const loadCatalogData = () => {
  const serviceType = catalogType.value === 'services' ? 'buyer-service' : 'user-request'
  catalogStore.loadServices(serviceType)
}

// Есть ли активные фильтры
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => 
    value !== undefined && value !== '' && value !== null
  ) || searchQuery.value !== ''
})

// Обработка поиска с debounce
const onSearchInput = debounce(() => {
  catalogStore.setFilters({ ...filters.value, search: searchQuery.value })
}, 300)

// Обновление фильтров
const handleFiltersUpdate = (newFilters: CatalogFilter) => {
  catalogStore.setFilters(newFilters)
}

// Сброс всех фильтров
const resetAllFilters = () => {
  catalogStore.resetFilters()
  searchQuery.value = ''
}

// Статистика
const totalServices = computed(() => services.value.length)
const averageRating = computed(() => {
  if (services.value.length === 0) return 0
  const sum = services.value.reduce((acc: number, service: any) => acc + service.rating, 0)
  return sum / services.value.length
})

// Пагинация
const showingFrom = computed(() => 
  Math.min((pagination.value.page - 1) * pagination.value.limit + 1, filteredServices.value.length)
)

const showingTo = computed(() => 
  Math.min(pagination.value.page * pagination.value.limit, filteredServices.value.length)
)

const previousPage = () => {
  if (pagination.value.page > 1) {
    catalogStore.setPage(pagination.value.page - 1)
  }
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    catalogStore.setPage(pagination.value.page + 1)
  }
}

// Обработчики действий
const handleAddToCart = (service: any) => {
  console.log('Service added to cart:', service)
}

const handleTakeOrder = (service: any) => {
  console.log('Order taken:', service)
}

// Следим за изменением фильтров для сброса пагинации
watch(filters, () => {
  catalogStore.setPage(1)
})

// Инициализируем поиск из фильтров при загрузке
watch(filters, (newFilters) => {
  searchQuery.value = newFilters.search || ''
}, { immediate: true })
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Поисковая строка */
.search-section {
  background: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background-color: rgba(var(--background-secondary-rgb), 0.95);
}

.search-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--background-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--background-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.filters-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filters-icon {
  font-size: 1.125rem;
}

.active-filters-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 12px;
  height: 12px;
  background: var(--accent-red);
  border-radius: 50%;
  border: 2px solid var(--background-secondary);
}

/* Заголовок каталога */
.catalog-header {
  background: linear-gradient(135deg, var(--primary-color-light), var(--primary-color));
  padding: 2rem 0;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.catalog-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.catalog-type-switcher {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-lg);
  padding: 0.25rem;
}

.type-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.type-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.type-btn-active {
  background: white;
  color: var(--primary-color);
  font-weight: 600;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Основной контент */
.catalog-main {
  flex: 1;
  padding: 2rem 0;
  background: var(--background-primary);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Адаптивная сетка карточек - минимум 2 в строке всегда */
.services-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  width: 100%;
}

/* Адаптация для разных размеров экрана */
@media (min-width: 640px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (min-width: 1280px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (min-width: 1536px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

@media (min-width: 1920px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
}

@media (max-width: 639px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(calc(50% - 0.625rem), 1fr));
  }
}

/* Состояния */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: var(--text-secondary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  background: var(--background-secondary);
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--border-color);
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.reset-btn:hover {
  background: var(--primary-color-dark);
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--border-color);
  background: var(--background-primary);
  color: var(--text-primary);
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 100px;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Модалка фильтров (отдельная страница) */
.filters-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--background-primary);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

.filters-modal-header {
  background: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.filters-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.filters-header-actions {
  display: flex;
  gap: 1rem;
}

.reset-all-btn {
  padding: 0.625rem 1.25rem;
  background: none;
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reset-all-btn:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.close-filters-btn {
  padding: 0.625rem 1.25rem;
  background: var(--primary-color);
  border: none;
  color: white;
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.close-filters-btn:hover {
  background: var(--primary-color-dark);
}

.filters-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 0;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-input-wrapper,
  .filters-btn {
    width: 100%;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }
  
  .catalog-type-switcher {
    width: 100%;
  }
  
  .type-btn {
    flex: 1;
    text-align: center;
  }
  
  .header-stats {
    width: 100%;
    justify-content: center;
  }
  
  .services-grid {
    gap: 1rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 0;
  }
  
  .pagination-info {
    order: -1;
  }
}

@media (max-width: 480px) {
  .catalog-title {
    font-size: 1.5rem;
  }
  
  .filters-header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filters-header-actions {
    justify-content: space-between;
  }
}
</style>