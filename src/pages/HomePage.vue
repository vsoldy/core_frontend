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
            aria-label="Фильтры"
          >
            <span class="filters-icon">⚙️</span>
            <span v-if="hasActiveFilters" class="active-filters-badge"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Переключатель типов -->
    <div v-if="isBuyer" class="container catalog-heading">
      <div class="catalog-type-switcher">
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

    <!-- Основной контент (карточки) -->
    <div class="catalog-main">
      <div class="container">
        <!-- Индикатор загрузки -->
        <div v-if="initialLoading" class="loading-state">
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
        
        <div ref="loadMoreRef" class="load-more-trigger"></div>
        <div v-if="isAppending" class="loading-more">
          <div class="spinner small"></div>
          <span>Подгружаем ещё...</span>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce } from 'lodash-es'
import { useCatalogStore } from '@/stores/catalog'
import { useAuth } from '@/shared/composables/useAuth'
import CatalogFilters from '@/features/catalog/components/CatalogFilters.vue'
import ServiceCard from '@/features/catalog/components/ServiceCard.vue'
import type { CatalogFilter } from '@/entities/catalog/types'
import type { Service } from '@/entities/service/types'

const catalogStore = useCatalogStore()
const { isBuyer } = useAuth()

// Получаем все реактивные свойства из хранилища через storeToRefs
const {
  isLoading,
  filters,
  paginatedServices,
  categories,
  priceRange,
  hasMore: storeHasMore
} = storeToRefs(catalogStore)
const hasMore = computed(() => storeHasMore?.value ?? false)

// Тип каталога
const catalogType = ref<'services' | 'requests'>('services')
// Показывать ли фильтры (модалка)
const showFilters = ref(false)
// Поисковый запрос
const searchQuery = ref('')
// Точка для авто-подгрузки
const loadMoreRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// Загружаем данные при монтировании
onMounted(() => {
  loadCatalogData()
  setupInfiniteScroll()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})

watch(loadMoreRef, (el) => {
  if (!observer || !el) return
  observer.observe(el)
})

const setupInfiniteScroll = () => {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      if (entry?.isIntersecting && hasMore.value && !isLoading.value) {
        loadMore()
      }
    },
    { rootMargin: '200px' }
  )
  
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
}

const mapCatalogType = () => (catalogType.value === 'services' ? 'buyer-service' : 'user-request')

// Переключение типа каталога
const switchCatalogType = (type: 'services' | 'requests') => {
  catalogType.value = type
  catalogStore.resetFilters()
  searchQuery.value = ''
  loadCatalogData()
}

// Загрузка данных каталога
const loadCatalogData = () => {
  catalogStore.loadServices(mapCatalogType(), { append: false })
}

const loadMore = () => {
  if (!hasMore.value || isLoading.value) return
  catalogStore.loadServices(mapCatalogType(), { append: true })
}

const initialLoading = computed(() => isLoading.value && paginatedServices.value.length === 0)
const isAppending = computed(() => isLoading.value && paginatedServices.value.length > 0)

// Есть ли активные фильтры
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => 
    value !== undefined && value !== '' && value !== null
  ) || searchQuery.value !== ''
})

// Обработка поиска с debounce
const onSearchInput = debounce(() => {
  catalogStore.setFilters({ ...filters.value, search: searchQuery.value })
  loadCatalogData()
}, 300)

// Обновление фильтров
const handleFiltersUpdate = (newFilters: CatalogFilter) => {
  catalogStore.setFilters(newFilters)
  loadCatalogData()
}

// Сброс всех фильтров
const resetAllFilters = () => {
  catalogStore.resetFilters()
  searchQuery.value = ''
  loadCatalogData()
}

// Обработчики действий
const handleAddToCart = (service: Service) => {
  console.log('Service added to cart:', service)
}

const handleTakeOrder = (service: Service) => {
  console.log('Order taken:', service)
}

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
  padding-top: var(--header-offset);
}

/* Поисковая строка */
.search-section {
  background: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.35rem 0 0.35rem;
  position: sticky;
  top: var(--header-offset);
  z-index: 90;
  background-color: var(--background-secondary);
  left: 0;
  right: 0;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  transition: transform var(--transition-normal);
}

.search-section .container {
  max-width: none;
  width: 100%;
  padding-left: var(--gutter);
  padding-right: var(--gutter);
}

.header-hidden .search-section {
  transform: translateY(calc(-1 * var(--header-offset)));
}

.search-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: nowrap;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.55rem 0.85rem 0.55rem 2.4rem;
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
  padding: 0.55rem 0.75rem;
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

.catalog-heading {
  padding: 1.5rem 0 0.5rem;
}

.heading-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.catalog-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.catalog-type-switcher {
  display: flex;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  padding: 0.25rem;
}

.type-btn {
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.type-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.type-btn-active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  font-weight: 600;
}

/* Основной контент */
.catalog-main {
  flex: 1;
  padding: 2rem 0;
  background: var(--background-primary);
}

/* Адаптивная сетка карточек */
.services-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  width: 100%;
}

@media (min-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 900px) {
  .services-grid {
    gap: 1rem;
  }
}

@media (max-width: 639px) {
  .services-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

.spinner.small {
  width: 28px;
  height: 28px;
  margin-bottom: 0;
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

.load-more-trigger {
  height: 1px;
  width: 100%;
}

.loading-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  padding: 1.5rem 0;
  color: var(--text-secondary);
}

/* Модалка фильтров (отдельная страница) */
.filters-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--background-primary);
  z-index: 2000;
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
    flex-direction: row;
    align-items: stretch;
    gap: 0.5rem;
  }

  .search-section {
    top: var(--header-offset);
    padding: 0.35rem 0 0.35rem;
  }

  .catalog-page {
    padding-top: var(--header-offset);
  }
  
  .search-input-wrapper,
  .filters-btn {
    flex: 1;
  }

  .filters-btn {
    flex: 0 0 auto;
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
