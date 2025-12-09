<template>
  <div class="catalog-filters">
    <div class="filters-header">
      <h3 class="filters-title">Фильтры</h3>
      <button v-if="hasActiveFilters" @click="resetFilters" class="reset-btn">
        Сбросить все
      </button>
    </div>
    
    <!-- Категории (множественный выбор) -->
    <div class="filter-group">
      <label class="filter-label">Категории</label>
      <div class="categories-list">
        <label 
          v-for="category in categories" 
          :key="category"
          :class="['category-option', { 'category-selected': isCategorySelected(category) }]"
        >
          <input
            type="checkbox"
            :value="category"
            v-model="selectedCategories"
            class="category-checkbox"
            @change="updateFilters"
          />
          <span class="category-name">{{ getCategoryName(category) }}</span>
        </label>
      </div>
    </div>
    
    <!-- Цена -->
    <div class="filter-group">
      <label class="filter-label">Цена, ₽</label>
      <div class="price-range">
        <input
          v-model.number="localFilters.minPrice"
          type="number"
          placeholder="От"
          class="price-input"
          :min="priceRange.min"
          :max="priceRange.max"
          @input="debouncedUpdateFilters"
        />
        <span class="price-separator">—</span>
        <input
          v-model.number="localFilters.maxPrice"
          type="number"
          placeholder="До"
          class="price-input"
          :min="priceRange.min"
          :max="priceRange.max"
          @input="debouncedUpdateFilters"
        />
      </div>
      <div class="price-labels">
        <span>{{ priceRange.min.toLocaleString('ru-RU') }} ₽</span>
        <span>{{ priceRange.max.toLocaleString('ru-RU') }} ₽</span>
      </div>
    </div>
    
    <!-- Сортировка -->
    <div class="filter-group">
      <label class="filter-label">Сортировка</label>
      <div class="sort-options">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          :class="['sort-btn', { 'sort-btn-active': localFilters.sortBy === option.value }]"
          @click="setSort(option.value)"
        >
          {{ option.label }}
          <span v-if="localFilters.sortBy === option.value" class="sort-order">
            {{ localFilters.sortOrder === 'desc' ? '↓' : '↑' }}
          </span>
        </button>
      </div>
    </div>
    
    <!-- Активные фильтры -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="active-filters-title">Активные фильтры:</div>
      <div class="active-filters-list">
        <span 
          v-for="filter in activeFiltersList" 
          :key="filter.key"
          class="active-filter"
          @click="removeFilter(filter.key)"
        >
          {{ filter.label }}
          <span class="remove-filter">×</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { CatalogFilter } from '@/entities/catalog/types'

interface Props {
  filters: CatalogFilter
  categories: string[]
  priceRange: { min: number; max: number }
}

interface Emits {
  (e: 'update:filters', filters: CatalogFilter): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Локальная копия фильтров для быстрого отклика
const localFilters = ref<CatalogFilter>({ ...props.filters })

// Выбранные категории (массив)
const selectedCategories = ref<string[]>([])

// Инициализируем выбранные категории из фильтров
if (props.filters.category) {
  // Поддерживаем как строку (старый формат), так и массив (новый формат)
  if (Array.isArray(props.filters.category)) {
    selectedCategories.value = props.filters.category
  } else {
    selectedCategories.value = [props.filters.category]
  }
}

// Опции сортировки
const sortOptions = [
  { value: 'price' as const, label: 'По цене' },
  { value: 'rating' as const, label: 'По рейтингу' },
  { value: 'date' as const, label: 'По дате' }
]

// Названия категорий
const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    'electronics': 'Электроника',
    'clothing': 'Одежда',
    'books': 'Книги',
    'other': 'Другое'
  }
  return names[category] || category
}

// Проверка, выбрана ли категория
const isCategorySelected = (category: string) => {
  return selectedCategories.value.includes(category)
}

// Активные фильтры
const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 ||
    localFilters.value.minPrice !== undefined ||
    localFilters.value.maxPrice !== undefined ||
    localFilters.value.sortBy !== undefined
})

const activeFiltersList = computed(() => {
  const filters: Array<{ key: string; label: string }> = []
  
  // Категории
  if (selectedCategories.value.length > 0) {
    if (selectedCategories.value.length === 1) {
      const firstCategory = selectedCategories.value[0] || ''
      filters.push({ 
        key: 'category', 
        label: `Категория: ${getCategoryName(firstCategory || 'other')}` 
      })
    } else {
      filters.push({ 
        key: 'category', 
        label: `Категории: ${selectedCategories.value.length}` 
      })
    }
  }
  
  // Цена
  if (localFilters.value.minPrice) {
    filters.push({ 
      key: 'minPrice', 
      label: `Цена от: ${localFilters.value.minPrice.toLocaleString('ru-RU')} ₽` 
    })
  }
  
  if (localFilters.value.maxPrice) {
    filters.push({ 
      key: 'maxPrice', 
      label: `Цена до: ${localFilters.value.maxPrice.toLocaleString('ru-RU')} ₽` 
    })
  }
  
  // Сортировка
  if (localFilters.value.sortBy) {
    const order = localFilters.value.sortOrder === 'desc' ? ' (убыв.)' : ' (возр.)'
    const sortLabel = sortOptions.find(opt => opt.value === localFilters.value.sortBy)?.label || ''
    filters.push({ 
      key: 'sortBy', 
      label: `Сортировка: ${sortLabel}${order}` 
    })
  }
  
  return filters
})

// Debounced обновление фильтров
const debouncedUpdateFilters = debounce(() => {
  updateFiltersWithCategories()
}, 300)

// Обновление фильтров с категориями
const updateFiltersWithCategories = () => {
  const newFilters: CatalogFilter = {
    ...localFilters.value,
    category: selectedCategories.value.length > 0 ? selectedCategories.value : undefined
  }
  emit('update:filters', newFilters)
}

// Обновление фильтров (для немедленного обновления)
const updateFilters = () => {
  updateFiltersWithCategories()
}

// Установка сортировки
const setSort = (sortBy: 'price' | 'rating' | 'date') => {
  if (localFilters.value.sortBy === sortBy) {
    // Переключение порядка
    localFilters.value.sortOrder = localFilters.value.sortOrder === 'desc' ? 'asc' : 'desc'
  } else {
    // Новая сортировка
    localFilters.value.sortBy = sortBy
    localFilters.value.sortOrder = 'asc'
  }
  updateFilters()
}

// Удаление фильтра
const removeFilter = (key: string) => {
  if (key === 'category') {
    selectedCategories.value = []
  } else if (key === 'minPrice') {
    localFilters.value.minPrice = undefined
  } else if (key === 'maxPrice') {
    localFilters.value.maxPrice = undefined
  } else if (key === 'sortBy') {
    localFilters.value.sortBy = undefined
    localFilters.value.sortOrder = undefined
  }
  updateFilters()
}

// Сброс всех фильтров
const resetFilters = () => {
  localFilters.value = {}
  selectedCategories.value = []
  updateFilters()
}

// Следим за изменениями внешних фильтров
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
  
  // Обновляем выбранные категории
  if (newFilters.category) {
    if (Array.isArray(newFilters.category)) {
      selectedCategories.value = newFilters.category
    } else {
      selectedCategories.value = [newFilters.category]
    }
  } else {
    selectedCategories.value = []
  }
}, { deep: true })
</script>

<style scoped>
.catalog-filters {
  background: var(--background-secondary);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.filters-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.reset-btn {
  background: none;
  border: none;
  color: var(--accent-red);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.reset-btn:hover {
  text-decoration: underline;
}

.filter-group {
  margin-bottom: 2rem;
}

.filter-label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875rem;
}

/* Категории (множественный выбор) */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-option:hover {
  border-color: var(--primary-color-light);
  background: var(--background-tertiary);
}

.category-selected {
  border-color: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 15%, transparent);
}

.category-checkbox {
  display: none;
}

.category-name {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Цена */
.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.price-input {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-primary);
  color: var(--text-primary);
  text-align: center;
  font-size: 0.875rem;
}

.price-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.price-separator {
  color: var(--text-secondary);
}

.price-labels {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.75rem;
}

/* Сортировка */
.sort-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sort-btn {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-primary);
  color: var(--text-secondary);
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all var(--transition-fast);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sort-btn:hover {
  border-color: var(--primary-color-light);
  color: var(--text-primary);
}

.sort-btn-active {
  border-color: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 14%, var(--background-secondary));
  color: var(--primary-color);
  font-weight: 500;
}

.sort-order {
  font-size: 1rem;
  font-weight: bold;
}

/* Активные фильтры */
.active-filters {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.active-filters-title {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.active-filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.active-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: color-mix(in srgb, var(--primary-color) 12%, var(--background-secondary));
  border: 1px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
  border-radius: var(--border-radius-md);
  font-size: 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.active-filter:hover {
  background: color-mix(in srgb, var(--primary-color) 18%, var(--background-secondary));
  border-color: var(--primary-color);
}

.remove-filter {
  font-size: 1.125rem;
  line-height: 1;
  margin-left: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .catalog-filters {
    padding: 1rem;
  }
}
</style>
