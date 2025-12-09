<template>
  <div class="cart-page">
    <header class="cart-header">
      <div>
        <p class="eyebrow">Корзина</p>
        <h1>Ваши услуги для выкупа</h1>
        <p class="subtitle">Доступно только для роли user. Управляйте заказом перед оформлением.</p>
      </div>
      <router-link to="/catalog" class="link">← Вернуться в каталог</router-link>
    </header>

    <div v-if="isEmpty" class="empty-state">
      <div class="empty-icon">🛒</div>
      <h3>Корзина пуста</h3>
      <p>Добавьте услуги из каталога, чтобы продолжить оформление.</p>
      <router-link to="/catalog" class="btn primary">Перейти в каталог</router-link>
    </div>

    <div v-else class="cart-grid">
      <section class="card items-card">
        <div class="section-head">
          <h2>Товары ({{ totalItems }})</h2>
          <button class="link-btn" @click="clearCart">Очистить</button>
        </div>

        <ul class="items-list">
          <li v-for="item in items" :key="item.service.id" class="item-row">
            <div class="item-info">
              <div class="item-thumb">{{ getCategoryEmoji(item.service.category) }}</div>
              <div>
                <p class="item-title">{{ item.service.name }}</p>
                <p class="item-meta">{{ getCategoryName(item.service.category) }}</p>
              </div>
            </div>

            <div class="qty">
              <button class="qty-btn" @click="changeQty(item.service.id, item.quantity - 1)">−</button>
              <input
                type="number"
                min="1"
                :value="item.quantity"
                @input="onQtyInput(item.service.id, ($event.target as HTMLInputElement).value)"
              />
              <button class="qty-btn" @click="changeQty(item.service.id, item.quantity + 1)">+</button>
            </div>

            <div class="price-block">
              <p class="price">{{ formatPrice(item.service.price * item.quantity) }}</p>
              <p class="unit">({{ formatPrice(item.service.price) }} за услугу)</p>
            </div>

            <button class="remove-btn" @click="remove(item.service.id)">×</button>
          </li>
        </ul>
      </section>

      <aside class="card summary-card">
        <h2>Итого</h2>
        <div class="summary-row">
          <span>Товары</span>
          <strong>{{ formatPrice(totalPrice) }}</strong>
        </div>
        <div class="summary-row">
          <span>Доставка</span>
          <strong>{{ shippingPrice > 0 ? formatPrice(shippingPrice) : 'Бесплатно' }}</strong>
        </div>
        <div class="summary-row total">
          <span>К оплате</span>
          <strong>{{ formatPrice(grandTotal) }}</strong>
        </div>

        <div class="summary-actions">
          <button class="btn primary" @click="checkout">Оформить заказ</button>
          <router-link to="/catalog" class="btn ghost">Добавить ещё</router-link>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'

const cartStore = useCartStore()
const uiStore = useUiStore()
const router = useRouter()

const { items, totalItems, totalPrice, isEmpty } = storeToRefs(cartStore)

const shippingPrice = computed(() => (totalPrice.value > 10000 ? 0 : 500))
const grandTotal = computed(() => totalPrice.value + shippingPrice.value)

const changeQty = (serviceId: string, newQty: number) => {
  if (newQty <= 0) {
    remove(serviceId)
    return
  }
  cartStore.updateQuantity(serviceId, newQty)
}

const onQtyInput = (serviceId: string, value: string) => {
  const numeric = parseInt(value, 10)
  if (Number.isNaN(numeric) || numeric <= 0) return
  changeQty(serviceId, numeric)
}

const remove = (serviceId: string) => {
  cartStore.removeFromCart(serviceId)
  uiStore.addNotification({
    type: 'warning',
    title: 'Удалено',
    message: 'Услуга убрана из корзины',
    duration: 2000
  })
}

const clearCart = () => {
  cartStore.clearCart()
  uiStore.addNotification({
    type: 'warning',
    title: 'Корзина очищена',
    message: 'Все позиции удалены',
    duration: 2000
  })
}

const checkout = () => {
  uiStore.addNotification({
    type: 'info',
    title: 'Оформление',
    message: 'Формирование заказа будет добавлено позже',
    duration: 3000
  })
  router.push('/profile')
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value)

const getCategoryName = (category: string) => {
  const map: Record<string, string> = {
    electronics: 'Электроника',
    clothing: 'Одежда',
    books: 'Книги',
    other: 'Другое'
  }
  return map[category] || category
}

const getCategoryEmoji = (category: string) => {
  const map: Record<string, string> = {
    electronics: '💻',
    clothing: '👕',
    books: '📚',
    other: '📦'
  }
  return map[category] || '📦'
}
</script>

<style scoped>
.cart-page {
  padding: calc(var(--header-offset) + 1rem) 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
}

.cart-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.card {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.items-card {
  padding: 1rem;
}

.summary-card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-row {
  display: grid;
  grid-template-columns: 1.5fr auto auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
}

.item-info {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.item-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--primary-color) 12%, var(--background-secondary));
}

.item-title {
  margin: 0;
  font-weight: 700;
}

.item-meta {
  margin: 0.2rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.qty {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.qty input {
  width: 60px;
  padding: 0.4rem;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-secondary);
  color: var(--text-primary);
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  cursor: pointer;
}

.qty-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.price-block {
  text-align: right;
}

.price {
  margin: 0;
  font-weight: 700;
}

.unit {
  margin: 0.15rem 0 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  cursor: pointer;
}

.remove-btn:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-primary);
}

.summary-row.total {
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
  font-size: 1.1rem;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid transparent;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn.primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn.primary:hover {
  background: var(--primary-color-dark);
}

.btn.ghost {
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn.ghost:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--background-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }

  .item-row {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .price-block {
    text-align: left;
  }
}
</style>
