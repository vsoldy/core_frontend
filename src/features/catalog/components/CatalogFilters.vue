<template>
  <div class="catalog-filters">
    <div class="filters-header">
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


// Названия категорий
const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    electronics: 'Электроника',
    clothing: 'Одежда',
    books: 'Книги',
    other: 'Другое'
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
  background: transparent;
  border-radius: 0;
  padding: 0;
}

.filters-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.75rem;
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
  margin-bottom: 1.25rem;
}

.filter-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
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
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-option:hover {
  border-color: var(--primary-color-light);
}

.category-selected {
  border-color: var(--primary-color);
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
  margin-bottom: 0.35rem;
}

.price-input {
  flex: 1;
  padding: 0.6rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: transparent;
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

/* Активные фильтры */
.active-filters {
  margin-top: 1.5rem;
  padding-top: 0.75rem;
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
