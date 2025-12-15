<template>
  <div class="reviews-page" v-if="service">
    <header class="page-header">
      <div>
        <p class="eyebrow">Отзывы</p>
        <h1>{{ service.name }}</h1>
        <p class="subtitle">
          Средняя оценка: {{ averageRating }} · {{ reviews.length }} отзывов
        </p>
      </div>
      <router-link :to="{ name: 'service', params: { id: service.id } }" class="link">
        ← Вернуться к услуге
      </router-link>
    </header>

    <section class="card">
      <ul v-if="reviews.length" class="reviews-list">
        <li v-for="review in reviews" :key="review.id" class="review-row">
          <div class="review-head">
            <p class="review-author">{{ review.author }}</p>
            <span class="pill rating-pill">⭐ {{ review.rating }}</span>
            <span class="pill ghost">{{ review.role === 'user' ? 'Покупатель' : 'Выкупщик' }}</span>
            <span class="review-date">{{ formatDate(review.createdAt) }}</span>
          </div>
          <p class="review-text">{{ review.comment }}</p>
        </li>
      </ul>
      <div v-else class="empty">Пока нет отзывов</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Service } from '@/entities/service/types'
import type { Review } from '@/entities/review/types'

const route = useRoute()
const router = useRouter()
const service = ref<Service | null>(createMockService(route.params.id as string))
const reviews = ref<Review[]>(createMockReviews(service.value?.id || 'service-1'))

const averageRating = computed(() => {
  if (!reviews.value.length) return service.value?.rating || 0
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return parseFloat((sum / reviews.value.length).toFixed(1))
})

if (!service.value) {
  router.replace('/catalog')
}

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(new Date(value))
    : '—'

function createMockService(id: string): Service {
  return {
    id: id || 'service-1',
    name: 'Выкуп и проверка товара из США',
    description: '',
    price: 0,
    category: 'electronics',
    images: [],
    customFields: [],
    buyerId: '',
    rating: 4.6,
    reviewCount: 2,
    createdAt: new Date().toISOString()
  }
}

function createMockReviews(serviceId: string): Review[] {
  return [
    {
      id: 'rev-1',
      serviceId,
      author: 'Анна К.',
      role: 'user',
      rating: 5,
      comment: 'Все прошло быстро, продавец проверен, трек дали сразу.',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'rev-2',
      serviceId,
      author: 'Илья П.',
      role: 'user',
      rating: 4,
      comment: 'Доставка заняла 4 дня, но упаковка и отчет отличные.',
      createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString()
    }
  ]
}
</script>

<style scoped>
.reviews-page {
  padding: calc(var(--header-offset) + 1rem) 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
}

.card {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.25rem;
}

.reviews-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.review-row {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 0.85rem;
  background: var(--background-tertiary);
}

.review-head {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.review-author {
  margin: 0;
  font-weight: 700;
}

.review-date {
  margin-left: auto;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.review-text {
  margin: 0.5rem 0 0;
  color: var(--text-primary);
}

.rating-pill {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 12%, var(--background-secondary));
}

.empty {
  color: var(--text-secondary);
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}
</style>
