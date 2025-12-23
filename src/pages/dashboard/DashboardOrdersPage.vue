<template>
  <div class="stack">
    <div class="page-head">
      <div>
        <h1>История заказов</h1>
        <p class="muted">Все оформленные заказы и их статусы</p>
      </div>
      <div class="filters">
        <select v-model="statusFilter" class="select">
          <option value="all">Все</option>
          <option value="in_progress">В работе</option>
          <option value="completed">Завершён</option>
          <option value="canceled">Отменён</option>
        </select>
      </div>
    </div>

    <div class="orders">
      <div class="card order" v-for="order in filteredOrders" :key="order.id">
        <div class="order__head">
          <div class="order__title">
            <div class="badge">#{{ order.id }}</div>
            <div>
              <h3>{{ order.title }}</h3>
              <p class="muted">{{ order.store }}</p>
            </div>
          </div>
          <span :class="['status', order.status]">{{ statusLabels[order.status] }}</span>
        </div>
        <div class="order__body">
          <div class="row">
            <span>Дата</span>
            <strong>{{ order.date }}</strong>
          </div>
          <div class="row">
            <span>Стоимость</span>
            <strong>{{ order.amount.toLocaleString('ru-RU') }} ₽</strong>
          </div>
          <div class="row">
            <span>Доставка</span>
            <strong>{{ order.delivery }}</strong>
          </div>
        </div>
        <div class="order__footer">
          <div class="tags">
            <span class="tag" v-for="tag in order.tags" :key="tag">{{ tag }}</span>
          </div>
          <div class="actions">
            <button class="pill-btn ghost">Детали</button>
            <button class="pill-btn ghost">Чат</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type OrderStatus = 'in_progress' | 'completed' | 'canceled'

interface Order {
  id: string
  title: string
  store: string
  date: string
  amount: number
  delivery: string
  status: OrderStatus
  tags: string[]
}

const statusFilter = ref<OrderStatus | 'all'>('all')

const orders = ref<Order[]>([
  {
    id: '1023',
    title: 'Кроссовки Nike Air Max',
    store: 'nike.com (США)',
    date: '12 янв',
    amount: 14800,
    delivery: 'Экспресс, 3-5 дней',
    status: 'in_progress',
    tags: ['Оплачено', 'Ожидает отправки']
  },
  {
    id: '1018',
    title: 'Ноутбук MacBook Air',
    store: 'apple.com (США)',
    date: '7 янв',
    amount: 138000,
    delivery: 'Экспресс, 5-7 дней',
    status: 'completed',
    tags: ['Доставлено', 'Чек получен']
  },
  {
    id: '994',
    title: 'Куртка Arc’teryx Beta',
    store: 'rei.com (США)',
    date: '28 дек',
    amount: 42000,
    delivery: 'Стандарт, 10-14 дней',
    status: 'canceled',
    tags: ['Отмена', 'Возврат оформлен']
  }
])

const statusLabels: Record<OrderStatus, string> = {
  in_progress: 'В работе',
  completed: 'Завершён',
  canceled: 'Отменён'
}

const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') return orders.value
  return orders.value.filter((o) => o.status === statusFilter.value)
})
</script>

<style scoped>
.stack { display: grid; gap: var(--space-4); width: 100%; align-self: stretch; align-content: start; justify-items: start; }
.muted { color: var(--text-secondary); }

.page-head {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  align-items: center;
}

.orders {
  display: grid;
  gap: var(--space-4);
}

.order__head {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  align-items: center;
  flex-wrap: wrap;
}

.order__title {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.badge {
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-pill);
  background: rgba(var(--primary-color-rgb), 0.12);
  color: var(--primary-color-dark);
  font-weight: 700;
  font-size: 0.9rem;
}

.status {
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
}

.status.in_progress { color: #0f766e; background: #ecfdf3; border-color: #a7f3d0; }
.status.completed { color: #065f46; background: #ecfdf3; border-color: #bbf7d0; }
.status.canceled { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }

.order__body {
  display: grid;
  gap: 0.5rem;
  margin: var(--space-3) 0;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  color: var(--text-secondary);
}

.order__footer {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  align-items: center;
  flex-wrap: wrap;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-pill);
  background: var(--background-tertiary);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.select {
  padding: 0.45rem 0.75rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
}

.pill-btn {
  padding: 0.45rem 0.9rem;
}
</style>
