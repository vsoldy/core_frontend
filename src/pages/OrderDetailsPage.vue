<template>
  <div class="order-page">
    <header class="page-header">
      <div>
        <p class="breadcrumbs">Профиль / Заказы / #{{ order.id }}</p>
        <h1 class="page-title">Заказ #{{ order.id }}</h1>
        <p class="page-subtitle">Обновлен {{ formatDate(lastUpdated) }}</p>
      </div>
      <span :class="['status-pill', `status-${order.status}`]">
        {{ statusLabels[order.status] || order.status }}
      </span>
    </header>

    <div class="grid">
      <section class="card">
        <h2>Сводка заказа</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <p class="summary-label">Стоимость услуги</p>
            <p class="summary-value">{{ formatPrice(order.price) }}</p>
          </div>
          <div class="summary-item">
            <p class="summary-label">Количество</p>
            <p class="summary-value">{{ order.quantity }} шт.</p>
          </div>
          <div class="summary-item">
            <p class="summary-label">Итого</p>
            <p class="summary-value">{{ formatPrice(total) }}</p>
          </div>
          <div class="summary-item">
            <p class="summary-label">Создан</p>
            <p class="summary-value">{{ formatDate(order.createdAt) }}</p>
          </div>
        </div>

        <div class="service-card">
          <div class="service-icon">🧾</div>
          <div>
            <p class="service-label">Услуга</p>
            <p class="service-title">{{ service.name }}</p>
            <p class="service-description">{{ service.description }}</p>
          </div>
          <router-link :to="{ name: 'service', params: { id: service.id } }" class="link">
            Открыть карточку
          </router-link>
        </div>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Ход выполнения</h2>
          <span class="section-note">Обновляется автоматически</span>
        </div>
        <OrderTracker
          :statuses="statuses"
          :current-status="order.status"
          :descriptions="statusDescriptions"
          :labels="statusLabels"
        />
      </section>

      <section class="card history">
        <div class="section-head">
          <h2>История изменений</h2>
          <span class="section-note">Время сервера</span>
        </div>
        <ul class="history-list">
          <li v-for="item in history" :key="item.id" class="history-item">
            <div class="history-status">
              <span :class="['dot', { active: item.status === order.status }]"></span>
              <p class="history-title">{{ statusLabels[item.status] || item.status }}</p>
            </div>
            <div class="history-meta">
              <p class="history-date">{{ formatDate(item.createdAt) }}</p>
              <p class="history-author">Обновил: {{ item.changedBy }}</p>
              <p v-if="item.comment" class="history-comment">{{ item.comment }}</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import OrderTracker from '@/components/OrderTracker.vue'
import type { Order, OrderHistoryItem, OrderStatus } from '@/entities/order/types'

const route = useRoute()

const statuses: OrderStatus[] = ['created', 'in_progress', 'shipped', 'delivered']

const statusLabels: Record<string, string> = {
  created: 'Создан',
  in_progress: 'В работе',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен'
}

const statusDescriptions: Record<string, string> = {
  created: 'Заказ оформлен и ожидает подтверждения.',
  in_progress: 'Исполнитель уточняет детали и выкупает товар.',
  shipped: 'Посылка передана в доставку.',
  delivered: 'Посылка доставлена получателю.'
}

const order = ref<Order>({
  id: (route.params.id as string) || 'SO-1042',
  userId: 'user-1',
  buyerId: 'buyer-3',
  serviceId: 'service-12',
  status: 'in_progress',
  price: 5400,
  quantity: 1,
  customFieldsData: {},
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString()
})

const service = {
  id: order.value.serviceId,
  name: 'Выкуп и проверка электроники из США',
  description: 'Проверка комплектации, фотоотчет и отправка в день выкупа.',
  seller: 'tech-hub'
}

const history = ref<OrderHistoryItem[]>([
  {
    id: 'h-1',
    orderId: order.value.id,
    status: 'created',
    changedBy: 'user-1',
    comment: 'Указан адрес доставки и способ связи.',
    createdAt: order.value.createdAt
  },
  {
    id: 'h-2',
    orderId: order.value.id,
    status: 'in_progress',
    changedBy: 'buyer-3',
    comment: 'Исполнитель подтвердил заказ и уточнил детали.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'h-3',
    orderId: order.value.id,
    status: 'shipped',
    changedBy: 'buyer-3',
    comment: 'Получен трек-номер и фото упаковки.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
])

const total = computed(() => order.value.price * order.value.quantity)
const lastUpdated = computed(() => order.value.updatedAt || order.value.createdAt)

const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(
    new Date(value)
  )
</script>

<style scoped>
.order-page {
  padding: calc(var(--header-offset) + 1rem) 0 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.breadcrumbs {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.page-title {
  margin: 0.15rem 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.page-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.status-pill {
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-pill);
  font-weight: 600;
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
}

.status-created {
  color: var(--text-secondary);
}

.status-in_progress {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb, 14, 165, 233), 0.08);
}

.status-shipped {
  color: var(--accent-green);
  border-color: var(--accent-green);
  background: rgba(16, 185, 129, 0.08);
}

.status-delivered {
  color: #0f5132;
  border-color: #0f5132;
  background: rgba(16, 185, 129, 0.12);
}

.status-cancelled {
  color: var(--accent-red);
  border-color: var(--accent-red);
  background: rgba(239, 68, 68, 0.08);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.card {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-md);
}

.card h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.summary-item {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
}

.summary-label {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.summary-value {
  margin: 0.25rem 0 0;
  font-weight: 700;
  color: var(--text-primary);
}

.service-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.85rem;
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
}

.service-icon {
  font-size: 1.5rem;
}

.service-label {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.service-title {
  margin: 0.15rem 0;
  font-weight: 700;
  color: var(--text-primary);
}

.service-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.section-note {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.history {
  grid-column: 1 / -1;
}

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  padding: 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
}

.history-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-color);
  display: inline-block;
}

.dot.active {
  background: var(--primary-color);
}

.history-title {
  margin: 0;
  font-weight: 700;
  color: var(--text-primary);
}

.history-meta {
  display: grid;
  gap: 0.25rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.history-date,
.history-author,
.history-comment {
  margin: 0;
}

@media (max-width: 768px) {
  .order-page {
    padding-top: calc(var(--header-offset) + 0.5rem);
  }

  .page-title {
    font-size: 1.4rem;
  }

  .service-card {
    grid-template-columns: 1fr;
  }

  .history {
    grid-column: auto;
  }

  .history-item {
    grid-template-columns: 1fr;
  }
}
</style>
