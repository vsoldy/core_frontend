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

    <div class="mobile-toolbar">
      <form class="mobile-search" @submit.prevent="submitMobileSearch">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Поиск"
          @focus="openSearchOverlay"
          @input="openSearchOverlay"
        />
        <button type="submit" aria-label="Найти">🔍</button>
      </form>
      <button class="mobile-icon-btn" type="button" @click="showSort = true" aria-label="Сортировка">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 4v16M6 4l-2 2M6 4l2 2M12 20h6M12 14h4M12 8h2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button class="mobile-icon-btn" type="button" @click="showFilters = true" aria-label="Фильтры">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 6h16M7 12h10M10 18h4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="8" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="14" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="12" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
    </div>

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
            <button class="filters-back-btn" type="button" @click="closeFilters" aria-label="Назад">
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 5l-7 7 7 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <h2 class="filters-title">Фильтры</h2>
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
      </div>
      <button class="filters-close-overlay" @click="closeFilters">Закрыть</button>
    </div>

    <div v-if="showSort" class="sort-modal">
      <div class="sort-panel">
        <div class="sort-header">
          <h2>Сортировка</h2>
          <button class="close-sort-btn" @click="showSort = false">Закрыть</button>
        </div>
        <div class="sort-options">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            :class="['sort-btn', { 'sort-btn-active': filters.sortBy === option.value }]"
            @click="setSort(option.value)"
          >
            {{ option.label }}
            <span v-if="filters.sortBy === option.value" class="sort-order">
              {{ filters.sortOrder === 'desc' ? '↓' : '↑' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSearchOverlay" class="search-overlay">
      <div class="search-overlay-panel">
        <div class="search-overlay-header">
          <form class="search-overlay-input" @submit.prevent="submitMobileSearch">
            <input v-model="searchQuery" type="search" placeholder="Поиск" />
            <button type="submit" aria-label="Найти">🔍</button>
          </form>
          <button class="search-overlay-close" type="button" @click="closeSearchOverlay">Закрыть</button>
        </div>
        <div class="search-overlay-content">
          <div class="search-categories">
            <section v-for="category in searchCategories" :key="category.value" class="search-category">
              <div class="search-category-head">
                <h3>{{ category.label }}</h3>
                <RouterLink
                  class="search-category-link"
                  :to="{ name: 'services', query: { category: category.value } }"
                  @click="closeSearchOverlay"
                >
                  Все
                </RouterLink>
              </div>
              <div class="search-subcategories">
                <RouterLink
                  v-for="sub in category.subcategories"
                  :key="sub.value"
                  class="search-subcategory"
                  :to="{ name: 'services', query: { category: category.value, subcategory: sub.value } }"
                  @click="closeSearchOverlay"
                >
                  {{ sub.label }}
                </RouterLink>
              </div>
            </section>
          </div>
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
const showSort = ref(false)
const showSearchOverlay = ref(false)
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
  setBodyScrollLock(false)
})

const setBodyScrollLock = (locked: boolean) => {
  document.body.style.overflow = locked ? 'hidden' : ''
}

watch([showFilters, showSearchOverlay, showSort], ([filtersOpen, searchOpen, sortOpen]) => {
  setBodyScrollLock(filtersOpen || searchOpen || sortOpen)
})

watch(loadMoreRef, (el) => {
  if (!observer || !el) return
  observer.observe(el)
})

const searchCategories = [
  {
    label: 'Электроника',
    value: 'electronics',
    subcategories: [
      { label: 'Смартфоны', value: 'smartphones' },
      { label: 'Ноутбуки', value: 'laptops' },
      { label: 'Аксессуары', value: 'accessories' }
    ]
  },
  {
    label: 'Одежда',
    value: 'clothing',
    subcategories: [
      { label: 'Верхняя одежда', value: 'outerwear' },
      { label: 'Обувь', value: 'shoes' },
      { label: 'Аксессуары', value: 'fashion-accessories' }
    ]
  },
  {
    label: 'Книги',
    value: 'books',
    subcategories: [
      { label: 'Бестселлеры', value: 'bestsellers' },
      { label: 'Комиксы', value: 'comics' },
      { label: 'Учебные', value: 'education' }
    ]
  },
  {
    label: 'Другое',
    value: 'other',
    subcategories: [
      { label: 'Хобби', value: 'hobby' },
      { label: 'Дом', value: 'home' }
    ]
  }
]

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

const openSearchOverlay = () => {
  showSearchOverlay.value = true
}

const closeSearchOverlay = () => {
  showSearchOverlay.value = false
}

const submitMobileSearch = () => {
  const query = searchQuery.value.trim()
  const baseQuery = route.name === 'services' ? { ...route.query } : {}
  if ('search' in baseQuery) {
    delete (baseQuery as Record<string, unknown>).search
  }
  router.push({
    name: 'services',
    query: query ? { ...baseQuery, search: query } : baseQuery
  })
}

const sortOptions = [
  { value: 'price' as const, label: 'Цена' },
  { value: 'rating' as const, label: 'Рейтинг' },
  { value: 'date' as const, label: 'Новизна' }
]

const setSort = (sortBy: 'price' | 'rating' | 'date') => {
  const nextFilters = { ...filters.value }
  if (nextFilters.sortBy === sortBy) {
    nextFilters.sortOrder = nextFilters.sortOrder === 'desc' ? 'asc' : 'desc'
  } else {
    nextFilters.sortBy = sortBy
    nextFilters.sortOrder = 'asc'
  }
  catalogStore.setFilters(nextFilters)
  loadCatalogData()
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

watch(
  () => route.fullPath,
  () => {
    showSearchOverlay.value = false
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

.mobile-toolbar {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  position: sticky;
  top: 0;
  z-index: 1200;
  background: var(--background-primary);
  border-bottom: 1px solid var(--border-color);
}

.mobile-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  flex: 1;
}

.mobile-search input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 0.35rem 0.4rem;
  font-size: 0.9rem;
}

.mobile-search input:focus {
  outline: none;
}

.mobile-search button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.mobile-icon-btn {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--text-primary);
  cursor: pointer;
  padding: 0;
}

.mobile-icon-btn .icon {
  width: 18px;
  height: 18px;
}

.sort-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  z-index: 1600;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sort-panel {
  width: 100%;
  background: var(--background-secondary);
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
}

.sort-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sort-header h2 {
  margin: 0;
  font-size: 1.05rem;
}

.close-sort-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.sort-options {
  display: grid;
  gap: 0.5rem;
}

.sort-btn {
  text-align: left;
  padding: 0.65rem 0.75rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--background-tertiary);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-btn-active {
  border-color: var(--primary-color-light);
  color: var(--primary-color-dark);
}

.sort-order {
  opacity: 0.7;
}

.search-overlay {
  position: fixed;
  inset: 0;
  background: var(--background-primary);
  z-index: 2300;
  display: grid;
  grid-template-rows: auto 1fr;
}

.search-overlay-panel {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
}

.search-overlay-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.search-overlay-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
}

.search-overlay-input input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 0.35rem 0.4rem;
  font-size: 0.9rem;
}

.search-overlay-input input:focus {
  outline: none;
}

.search-overlay-input button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.search-overlay-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
}

.search-overlay-content {
  overflow-y: auto;
  padding: 0.75rem 1rem 1rem;
}

.search-categories {
  display: grid;
  gap: 1rem;
}

.search-category {
  display: grid;
  gap: 0.5rem;
}

.search-category-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.search-category-head h3 {
  margin: 0;
  font-size: 0.95rem;
}

.search-category-link {
  color: var(--primary-color-dark);
  font-weight: 600;
  text-decoration: none;
  font-size: 0.8rem;
}

.search-subcategories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.search-subcategory {
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.8rem;
  text-decoration: none;
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
  .filters-modal {
    place-items: stretch;
    padding: 0;
  }

  .filters-modal-panel {
    width: 100%;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .filters-modal-content {
    padding: 0.75rem 1rem 1rem;
  }

  .mobile-toolbar {
    display: flex;
  }

  .filters-fab {
    display: none;
  }

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
  place-items: stretch;
  padding: 0;
}

.filters-modal-panel {
  width: 100%;
  height: 100%;
  max-height: none;
  background: var(--background-primary);
  border-radius: 0;
  border: none;
  display: grid;
  grid-template-rows: auto 1fr auto;
  box-shadow: none;
  overflow: hidden;
}

.filters-modal-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--background-primary);
  position: sticky;
  top: 0;
  z-index: 2;
}

.filters-header-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.filters-title {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  white-space: nowrap;
}

.filters-back-btn {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}

.filters-back-btn .icon {
  width: 18px;
  height: 18px;
}

.filters-modal-content {
  overflow-y: auto;
  padding: 0.75rem 1rem 5rem;
}

.filters-close-overlay {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 0.8rem;
  padding: 0.7rem 1rem;
  border-radius: var(--border-radius-md);
  background: color-mix(in srgb, var(--background-primary) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 55%, transparent);
  color: var(--text-primary);
  font-weight: 700;
  cursor: pointer;
  z-index: 3;
  backdrop-filter: blur(8px);
}

.filters-close-overlay:hover {
  background: var(--background-primary);
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
}
</style>
