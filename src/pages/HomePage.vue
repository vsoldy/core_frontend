<template>
  <div class="catalog-page">
    <button
      class="filters-btn prominent filters-fab"
      @click="showFilters = true"
      aria-label="Фильтры"
    >
      <span class="filters-icon">⚙️</span>
      <span class="filters-label">Фильтры</span>
      <span v-if="hasActiveFilters" class="active-filters-badge"></span>
    </button>

    <!-- Переключатель типов -->
    <div v-if="isBuyer" class="container catalog-heading">
      <div class="catalog-type-switcher">
        <button
          :class="['type-btn', { 'type-btn-active': catalogType === 'services' }]"
          @click="switchCatalogType('services')"
        >
          Товары
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
            <p>Загрузка товаров...</p>
          </div>

        <!-- Сообщение при отсутствии результатов -->
        <div v-else-if="paginatedServices.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить параметры поиска или фильтры</p>
          <button @click="resetAllFilters" class="reset-btn">
            Сбросить все фильтры
          </button>
        </div>

        <!-- Сетка карточек -->
        <div v-else class="services-grid">
          <template v-if="catalogType === 'services'">
            <ServiceCard
              v-for="service in paginatedServices"
              :key="service.id"
              :service="service"
              :show-add-to-cart="true"
              :show-take-order="false"
              @add-to-cart="handleAddToCart"
              @take-order="handleTakeOrder"
            />
          </template>
          <template v-else>
            <RequestCard
              v-for="req in filteredRequests"
              :key="req.id"
              :request="req"
              @respond="handleRespond"
            />
          </template>
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
      <div class="filters-modal-panel">
        <div class="filters-modal-header">
          <div class="filters-header-content">
            <h2 class="filters-title">Фильтры</h2>
            <div class="filters-header-actions">
              <button @click="resetAllFilters" class="reset-all-btn">
                Сбросить все
              </button>
              <button @click="closeFilters" class="close-filters-btn">
                Закрыть
              </button>
            </div>
          </div>
        </div>
        
        <div class="filters-modal-content">
          <CatalogFilters
            :filters="filters"
            :categories="categories"
            :price-range="priceRange"
            @update:filters="handleFiltersUpdate"
          />
        </div>

        <div class="filters-modal-footer">
          <button class="apply-filters-btn" @click="closeFilters">Показать товары</button>
        </div>
      </div>
    </div>

    <!-- Модалка создания запроса -->
    <Teleport to="body">
      <div v-if="showRequestModal" class="modal-backdrop" @click.self="showRequestModal = false">
        <div class="modal">
          <div class="modal-head">
            <h3>Создать запрос на выкуп</h3>
            <button class="close-btn" @click="showRequestModal = false">×</button>
          </div>
          <div class="modal-body">
            <label>
              Заголовок
              <input v-model="requestForm.title" type="text" placeholder="Например, Выкуп ноутбука" />
            </label>
            <label>
              Описание
              <textarea
                v-model="requestForm.description"
                rows="3"
                placeholder="Что купить, требования к проверке, сроки"
              ></textarea>
            </label>
            <div class="modal-grid">
              <label>
                Бюджет, ₽
                <input v-model.number="requestForm.budget" type="number" min="0" />
              </label>
              <label>
                Категория
                <select v-model="requestForm.category">
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </label>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn ghost" type="button" @click="showRequestModal = false">Отмена</button>
            <button class="btn primary" type="button" @click="submitRequest">Создать</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { useRequestsStore } from '@/stores/requests'
import { useAuth } from '@/shared/composables/useAuth'
import CatalogFilters from '@/features/catalog/components/CatalogFilters.vue'
import ServiceCard from '@/features/catalog/components/ServiceCard.vue'
import RequestCard from '@/features/catalog/components/RequestCard.vue'
import type { CatalogFilter } from '@/entities/catalog/types'
import type { Service } from '@/entities/service/types'
import type { Request } from '@/entities/request/types'

const catalogStore = useCatalogStore()
const requestsStore = useRequestsStore()
const router = useRouter()
const route = useRoute()
const { isBuyer, user } = useAuth()

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

const { requests, isLoading: isLoadingRequests } = storeToRefs(requestsStore)

// Тип каталога
const catalogType = ref<'services' | 'requests'>('services')
// Показывать ли фильтры (модалка)
const showFilters = ref(false)
const showRequestModal = ref(false)
// Поисковый запрос
const searchQuery = ref('')
const requestForm = ref({
  title: '',
  description: '',
  budget: 3000,
  category: 'other'
})
// Точка для авто-подгрузки
const loadMoreRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// Загружаем данные при монтировании
onMounted(() => {
  applyQueryFilters()
  if (catalogType.value === 'requests') {
    requestsStore.loadRequests()
  }
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
  if (type === 'requests') {
    requestsStore.loadRequests()
  }
}

// Загрузка данных каталога
const loadCatalogData = () => {
  if (catalogType.value === 'services') {
    catalogStore.loadServices(mapCatalogType(), { append: false })
  } else {
    requestsStore.loadRequests()
  }
}

const applyQueryFilters = () => {
  if (catalogType.value !== 'services') return
  const category = typeof route.query.category === 'string' ? route.query.category : undefined
  const brand = typeof route.query.brand === 'string' ? route.query.brand : undefined
  const subcategory = typeof route.query.subcategory === 'string' ? route.query.subcategory : undefined
  const search = typeof route.query.search === 'string' ? route.query.search : undefined
  const sortBy = typeof route.query.sortBy === 'string' ? route.query.sortBy : undefined
  const sortOrder = typeof route.query.sortOrder === 'string' ? route.query.sortOrder : undefined
  catalogStore.setFilters({
    category: category || undefined,
    brand: brand || undefined,
    subcategory: subcategory || undefined,
    search: search || undefined,
    sortBy: (sortBy as 'price' | 'rating' | 'date') || undefined,
    sortOrder: (sortOrder as 'asc' | 'desc') || undefined
  })
  searchQuery.value = search || ''
  loadCatalogData()
}

const loadMore = () => {
  if (catalogType.value === 'requests') return
  if (!hasMore.value || isLoading.value) return
  catalogStore.loadServices(mapCatalogType(), { append: true })
}

const initialLoading = computed(() => {
  if (catalogType.value === 'requests') return isLoadingRequests.value && filteredRequests.value.length === 0
  return isLoading.value && paginatedServices.value.length === 0
})
const isAppending = computed(() => {
  if (catalogType.value === 'requests') return false
  return isLoading.value && paginatedServices.value.length > 0
})

// Есть ли активные фильтры
const hasActiveFilters = computed(() => {
  if (catalogType.value === 'requests') {
    return searchQuery.value !== ''
  }
  return Object.values(filters.value).some(value => 
    value !== undefined && value !== '' && value !== null
  ) || searchQuery.value !== ''
})

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

const closeFilters = () => {
  showFilters.value = false
}

// Обработчики действий
const handleAddToCart = (service: Service) => {
  console.log('Service added to cart:', service)
}

const handleTakeOrder = (service: Service) => {
  console.log('Order taken:', service)
}

const handleRespond = (request: Request) => {
  router.push({ name: 'request', params: { id: request.id } })
}

const submitRequest = () => {
  if (!requestForm.value.title.trim() || !requestForm.value.description.trim()) {
    alert('Заполните заголовок и описание')
    return
  }
  const newRequest = requestsStore.createRequest({
    title: requestForm.value.title.trim(),
    description: requestForm.value.description.trim(),
    budget: requestForm.value.budget,
    category: requestForm.value.category,
    address: 'Не указан',
    userId: user.value?.id || 'user-1'
  })
  showRequestModal.value = false
  requestForm.value = {
    title: '',
    description: '',
    budget: 3000,
    category: 'other'
  }
  router.push({ name: 'request', params: { id: newRequest.id } })
}

// Инициализируем поиск из фильтров при загрузке
watch(filters, (newFilters) => {
  searchQuery.value = newFilters.search || ''
}, { immediate: true })

watch(
  () => route.query,
  () => {
    applyQueryFilters()
  }
)

const filteredRequests = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return requests.value.filter((req) =>
    req.title.toLowerCase().includes(q) || req.description.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 0;
}

.search-chip {
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  margin-right: 0.75rem;
}

.filters-fab {
  position: static;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.6rem;
  font-size: 0.8rem;
  min-width: 0;
  width: auto;
  max-width: max-content;
  white-space: nowrap;
  align-self: flex-end;
  margin: var(--space-3) var(--gutter) 0 auto;
}

@media (max-width: 768px) {
  .filters-fab {
    width: 44px;
    height: 44px;
    padding: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }

  .filters-fab .filters-icon {
    margin: 0;
  }
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

.filters-btn.prominent {
  border-color: var(--primary-color);
  box-shadow: 0 6px 20px rgba(var(--primary-color-rgb), 0.15);
}

.create-request-btn {
  padding: 0.55rem 0.85rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: 700;
  cursor: pointer;
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

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.modal {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  width: min(520px, 100%);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.modal-body input,
.modal-body textarea,
.modal-body select {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-primary);
  color: var(--text-primary);
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
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
  inset: 0;
  background: rgba(10, 12, 20, 0.6);
  z-index: 2400;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.filters-modal-panel {
  width: min(920px, 100%);
  height: min(92vh, 820px);
  background: var(--background-secondary);
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--border-color);
  display: grid;
  grid-template-rows: auto 1fr auto;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.filters-modal-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.filters-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.filters-header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
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
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.close-filters-btn:hover {
  background: var(--background-tertiary);
}

.filters-modal-content {
  overflow-y: auto;
  padding: 1.5rem;
}

.filters-modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.apply-filters-btn {
  background: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
  padding: 0.7rem 1.25rem;
  border-radius: var(--border-radius-md);
  font-weight: 700;
  cursor: pointer;
}

.apply-filters-btn:hover {
  background: var(--primary-color-dark);
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .catalog-page {
    padding-top: 0;
  }

  .filters-label {
    display: none;
  }

  .filters-fab {
    margin-right: var(--gutter);
    margin-left: auto;
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
