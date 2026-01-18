<template>
  <div class="catalog-mobile">
    <header class="catalog-header">
      <div class="container">
        <form class="search-bar" @submit.prevent="submitSearch">
          <input v-model="searchValue" type="search" placeholder="Поиск по товарам и брендам" />
          <button type="submit" aria-label="Найти">
            🔍
          </button>
        </form>
      </div>
    </header>

    <main class="catalog-body">
      <div class="container">
        <div class="categories">
          <section v-for="category in catalogCategories" :key="category.value" class="category-group">
            <div class="category-head">
              <h2>{{ category.label }}</h2>
              <RouterLink
                class="category-link"
                :to="{ name: 'services', query: { category: category.value } }"
              >
                Все
              </RouterLink>
            </div>
            <div class="subcategory-grid">
              <RouterLink
                v-for="sub in category.subcategories"
                :key="sub.value"
                class="subcategory-pill"
                :to="{ name: 'services', query: { category: category.value, subcategory: sub.value } }"
              >
                {{ sub.label }}
              </RouterLink>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()
const searchValue = ref((route.query.search as string) || '')

const catalogCategories = [
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

const submitSearch = () => {
  const query = searchValue.value.trim()
  const baseQuery = route.name === 'services' ? { ...route.query } : {}
  if ('search' in baseQuery) {
    delete (baseQuery as Record<string, unknown>).search
  }
  router.push({
    name: 'services',
    query: query ? { ...baseQuery, search: query } : baseQuery
  })
}
</script>

<style scoped>
.catalog-mobile {
  min-height: 100vh;
  background: var(--background-primary);
  display: flex;
  flex-direction: column;
}

.catalog-header {
  padding: 0.5rem 0;
  background: var(--background-primary);
  border-bottom: 1px solid var(--border-color);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 0.35rem 0.4rem;
  font-size: 0.9rem;
}

.search-bar input:focus {
  outline: none;
}

.search-bar button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.catalog-body {
  flex: 1;
  padding: 0.6rem 0 1rem;
}

.categories {
  display: grid;
  gap: 0.75rem;
}

.category-group {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  display: grid;
  gap: 0.5rem;
}

.category-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.category-head h2 {
  font-size: 1rem;
  margin: 0;
}

.category-link {
  color: var(--primary-color-dark);
  font-weight: 600;
  font-size: 0.8rem;
  text-decoration: none;
}

.subcategory-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.subcategory-pill {
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.8rem;
  text-decoration: none;
}

@media (min-width: 901px) {
  .catalog-mobile {
    padding-top: calc(var(--header-offset) + 0.75rem);
  }
}
</style>
