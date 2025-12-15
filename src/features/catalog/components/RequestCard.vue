<template>
  <div class="request-card">
    <div class="card-header">
      <div class="icon">{{ getCategoryEmoji(request.category) }}</div>
      <div class="titles">
        <h3 class="title">{{ request.title }}</h3>
        <p class="desc">{{ truncate(request.description) }}</p>
      </div>
    </div>

    <div class="meta">
      <span class="pill">{{ getCategoryName(request.category) }}</span>
      <span class="pill ghost">Бюджет: {{ formatPrice(request.budget) }}</span>
      <span v-if="request.deadline" class="pill ghost">Дедлайн: {{ formatDate(request.deadline) }}</span>
    </div>

    <div class="footer">
      <router-link :to="{ name: 'request', params: { id: request.id } }" class="details-link">
        Открыть запрос
      </router-link>
      <button v-if="isBuyer" class="cta" @click.stop="$emit('respond', request)">Откликнуться</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/shared/composables/useAuth'
import type { Request } from '@/entities/request/types'

interface Props {
  request: Request
}

defineProps<Props>()
defineEmits<{ respond: [request: Request] }>()

const { isBuyer } = useAuth()

const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(new Date(value))

const truncate = (value: string, len = 100) => (value.length > len ? `${value.slice(0, len)}...` : value)

const getCategoryEmoji = (category: string) => {
  const map: Record<string, string> = {
    electronics: '💻',
    clothing: '👕',
    books: '📚',
    other: '📦'
  }
  return map[category] || '📦'
}

const getCategoryName = (category: string) => {
  const map: Record<string, string> = {
    electronics: 'Электроника',
    clothing: 'Одежда',
    books: 'Книги',
    other: 'Другое'
  }
  return map[category] || category
}
</script>

<style scoped>
.request-card {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  gap: 0.75rem;
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--primary-color) 12%, var(--background-tertiary));
}

.title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.desc {
  margin: 0.2rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.meta {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.pill {
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
  background: var(--background-tertiary);
  font-size: 0.85rem;
  color: var(--text-primary);
}

.pill.ghost {
  color: var(--text-secondary);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.details-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.cta {
  padding: 0.55rem 0.85rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-color);
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cta:hover {
  background: var(--primary-color-dark);
}
</style>
