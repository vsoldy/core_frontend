<template>
  <div class="profile-page">
    <header class="profile-header">
      <div>
        <p class="eyebrow">Личный кабинет</p>
        <h1>Привет, {{ user?.name || 'гость' }}</h1>
        <p class="subtitle">Управляйте настройками аккаунта и отслеживайте свои заказы</p>
      </div>
      <span class="role-pill">{{ roleLabel }}</span>
    </header>

    <div class="profile-grid">
      <section class="card">
        <h2>Данные аккаунта</h2>
        <div class="info-grid">
          <div class="info-row">
            <p class="info-label">Имя</p>
            <p class="info-value">{{ user?.name || '—' }}</p>
          </div>
          <div class="info-row">
            <p class="info-label">Email</p>
            <p class="info-value">{{ user?.email || '—' }}</p>
          </div>
          <div class="info-row">
            <p class="info-label">Телефон</p>
            <p class="info-value">{{ user?.phone || 'Не указан' }}</p>
          </div>
          <div class="info-row">
            <p class="info-label">Роль</p>
            <p class="info-value">{{ roleLabel }}</p>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Настройки темы</h2>
          <span class="section-note">Для авторизованных пользователей</span>
        </div>
        <p class="hint">Выберите, как выглядят интерфейс и каталог. Переключатель из хедера скрыт после входа.</p>
        <div class="theme-options">
          <label class="theme-card">
            <input v-model="selectedTheme" type="radio" value="light" />
            <div class="theme-body">
              <span class="theme-dot"></span>
              <div>
                <p class="theme-title">Светлая</p>
                <p class="theme-desc">Больше воздуха и привычный дневной режим.</p>
              </div>
            </div>
          </label>
          <label class="theme-card">
            <input v-model="selectedTheme" type="radio" value="dark" />
            <div class="theme-body">
              <span class="theme-dot dark"></span>
              <div>
                <p class="theme-title">Темная</p>
                <p class="theme-desc">Меньше яркости — удобно вечером и ночью.</p>
              </div>
            </div>
          </label>
        </div>
      </section>

      <section class="card addresses-card">
        <div class="section-head">
          <h2>Адреса доставки</h2>
          <button class="link-btn" @click="addAddress">Добавить</button>
        </div>
        <ul class="addresses-list">
          <li v-for="address in addresses" :key="address.id" class="address-row">
            <div class="address-info">
              <div class="address-top">
                <p class="address-label">{{ address.label }}</p>
                <span v-if="address.isDefault" class="address-pill">Основной</span>
              </div>
              <p class="address-line">{{ address.line1 }}</p>
              <p class="address-line">{{ address.city }}, {{ address.country }}</p>
            </div>
            <div class="address-actions">
              <button
                v-if="!address.isDefault"
                class="ghost-btn"
                @click="setDefaultAddress(address.id)"
              >
                Сделать основным
              </button>
              <button class="danger-btn" @click="removeAddress(address.id)">
                Удалить
              </button>
            </div>
          </li>
        </ul>
      </section>

      <section class="card orders-card">
        <div class="section-head">
          <h2>Последние заказы</h2>
          <router-link to="/services" class="link">Услуги</router-link>
        </div>
        <ul class="orders-list">
          <li v-for="order in recentOrders" :key="order.id" class="order-row">
            <div>
              <p class="order-title">Заказ #{{ order.id }}</p>
              <p class="order-meta">{{ order.service }} · {{ formatPrice(order.price) }}</p>
            </div>
            <div class="order-actions">
              <span :class="['status-pill', `status-${order.status}`]">
                {{ statusLabels[order.status] || order.status }}
              </span>
              <button class="open-btn" @click="openOrder(order.id)">Открыть</button>
            </div>
          </li>
        </ul>
      </section>

      <section class="card create-request-card" v-if="isUser">
        <div class="section-head">
          <h2>Новый запрос</h2>
          <router-link to="/requests/new" class="link">Создать</router-link>
        </div>
        <p class="hint">Опишите, что нужно выкупить — выкупщики отправят отклики.</p>
        <router-link to="/requests/new" class="btn primary">Создать запрос</router-link>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables/useAuth'
import { useUiStore, type Theme } from '@/stores/ui'

const { user, isUser } = useAuth()
const router = useRouter()
const uiStore = useUiStore()
const { theme } = storeToRefs(uiStore)

const selectedTheme = ref<Theme>(theme.value)

watch(theme, (value) => {
  selectedTheme.value = value
})

watch(selectedTheme, (value) => {
  uiStore.setTheme(value)
})

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    user: 'Покупатель',
    buyer: 'Выкупщик',
    manager: 'Менеджер',
    admin: 'Администратор'
  }
  return map[user.value?.role || ''] || 'Неизвестно'
})

type OrderPreview = { id: string; service: string; price: number; status: string }

const recentOrders = ref<OrderPreview[]>([
  { id: 'SO-1042', service: 'Выкуп электроники', price: 5400, status: 'in_progress' },
  { id: 'SO-1038', service: 'Доставка одежды из ЕС', price: 3200, status: 'shipped' }
])

type Address = {
  id: string
  label: string
  line1: string
  city: string
  country: string
  isDefault: boolean
}

const addresses = ref<Address[]>([
  {
    id: 'adr-1',
    label: 'Дом',
    line1: 'ул. Ленина, 12, кв. 45',
    city: 'Москва',
    country: 'Россия',
    isDefault: true
  },
  {
    id: 'adr-2',
    label: 'Офис',
    line1: 'ул. Бейкер, 221B',
    city: 'Лондон',
    country: 'Великобритания',
    isDefault: false
  }
])

const addAddress = () => {
  uiStore.addNotification({
    type: 'info',
    title: 'Добавление адреса',
    message: 'Форма добавления появится позже. Сейчас используются мок-данные.'
  })
}

const setDefaultAddress = (id: string) => {
  addresses.value = addresses.value.map((addr) => ({
    ...addr,
    isDefault: addr.id === id
  }))
  uiStore.addNotification({
    type: 'success',
    title: 'Адрес обновлен',
    message: 'Новый адрес установлен как основной',
    duration: 2000
  })
}

const removeAddress = (id: string) => {
  addresses.value = addresses.value.filter((addr) => addr.id !== id)
  uiStore.addNotification({
    type: 'warning',
    title: 'Адрес удален',
    message: 'Адрес убран из профиля',
    duration: 2000
  })
}

const statusLabels: Record<string, string> = {
  created: 'Создан',
  in_progress: 'В работе',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен'
}

const openOrder = (id: string) => {
  router.push({ name: 'order-details', params: { id } })
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value)
</script>

<style scoped>
.profile-page {
  padding: calc(var(--header-offset) + 1rem) 0 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
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

.role-pill {
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-pill);
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  font-weight: 600;
}

.profile-grid {
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
}

.info-grid {
  display: grid;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
}

.info-label {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.info-value {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
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

.hint {
  margin: 0 0 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.theme-options {
  display: grid;
  gap: 0.5rem;
}

.theme-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 0.75rem;
  background: var(--background-tertiary);
  display: block;
  cursor: pointer;
}

.theme-card input {
  display: none;
}

.theme-card input:checked + .theme-body {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 14, 165, 233), 0.15);
}

.theme-body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: center;
  border: 1px dashed transparent;
  border-radius: var(--border-radius-md);
  padding: 0.5rem;
}

.theme-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--neutral-200);
  border: 1px solid var(--border-color);
}

.theme-dot.dark {
  background: var(--neutral-800);
}

.theme-title {
  margin: 0;
  font-weight: 700;
}

.theme-desc {
  margin: 0.15rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.orders-card {
  grid-column: 1 / -1;
}

.addresses-card {
  grid-column: 1 / -1;
}

.create-request-card {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.orders-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  padding: 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
}

.order-title {
  margin: 0;
  font-weight: 700;
}

.order-meta {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.status-pill {
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  font-weight: 600;
  font-size: 0.9rem;
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

.addresses-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.address-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
}

.address-info {
  flex: 1;
}

.address-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.address-label {
  margin: 0;
  font-weight: 700;
}

.address-line {
  margin: 0.15rem 0 0;
  color: var(--text-secondary);
}

.address-pill {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--primary-color) 12%, var(--background-secondary));
  color: var(--primary-color);
  border: 1px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
  font-weight: 600;
  font-size: 0.8rem;
}

.address-actions {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: flex-end;
}

.ghost-btn,
.danger-btn {
  padding: 0.45rem 0.75rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.ghost-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.danger-btn {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.danger-btn:hover {
  background: color-mix(in srgb, var(--accent-red) 10%, var(--background-secondary));
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
}

.open-btn {
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-color);
  background: var(--primary-color);
  color: white;
  cursor: pointer;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: calc(var(--header-offset) + 0.5rem);
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .orders-card {
    grid-column: auto;
  }

  .addresses-card {
    grid-column: auto;
  }

  .order-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
