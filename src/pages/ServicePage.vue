<template>
  <div class="service-page" v-if="service">
    <header class="page-header">
      <div class="breadcrumbs">
        <router-link to="/catalog">Каталог</router-link>
        <span>·</span>
        <span>{{ categoryLabel }}</span>
      </div>
      <h1 class="title">{{ service.name }}</h1>
      <p class="subtitle">{{ service.description }}</p>
      <div class="meta">
        <span class="pill">{{ categoryLabel }}</span>
        <span class="pill rating">⭐ {{ service.rating.toFixed(1) }} · {{ service.reviewCount }} отзывов</span>
        <span class="pill ghost">ID: {{ service.id }}</span>
      </div>
    </header>

    <div class="grid">
      <section class="media card">
        <div class="media-main">
          <div class="media-placeholder">
            <span class="media-emoji">{{ categoryEmoji }}</span>
            <p>Фото/видео будут доступны позднее</p>
          </div>
        </div>
        <div class="media-thumbs">
          <div class="thumb active">Фото</div>
          <div class="thumb">Видео</div>
          <div class="thumb">Отчёт</div>
        </div>
      </section>

      <aside class="summary card">
        <div class="price-block">
          <p class="label">Стоимость услуги</p>
          <p class="price">{{ formatPrice(service.price) }}</p>
          <p class="hint">Оплата после подтверждения выкупщика</p>
        </div>

        <div class="actions">
          <button v-if="isUser" class="btn primary" @click="handleAddToCart">Добавить в корзину</button>
          <button v-if="isBuyer" class="btn success" @click="handleTakeOrder">Взять заказ</button>
          <router-link class="btn ghost" to="/profile">Настроить адрес доставки</router-link>
        </div>

        <ul class="quick-facts">
          <li>
            <span>Срок выкупа</span>
            <strong>1–3 дня</strong>
          </li>
          <li>
            <span>Доставка</span>
            <strong>Мир / EMS / курьер</strong>
          </li>
          <li>
            <span>Поддержка</span>
            <strong>24/7 чат с менеджером</strong>
          </li>
        </ul>
      </aside>
    </div>

    <section class="card details">
      <div class="section-head">
        <h2>Описание услуги</h2>
        <span class="section-note">Прозрачные шаги и кастомные поля</span>
      </div>
      <div class="details-grid">
        <div class="text">
          <p>
            Профессиональный выкуп товаров из других стран: проверка продавца, фото/видео подтверждение,
            формирование трека и контроль доставки. Выкупщик держит связь в чате и отправляет отчёты по каждому этапу.
          </p>
          <p>
            Услуга соответствует требованиям SOLDY: прозрачные статусы, возможность оставить отзыв и чат с менеджером.
          </p>
          <div class="badges">
            <span class="chip">Гарантия возврата</span>
            <span class="chip">Фотоотчет</span>
            <span class="chip">Проверка комплектации</span>
          </div>
        </div>

        <div class="fields">
          <h3>Кастомные поля заказа</h3>
          <ul>
            <li v-for="field in customFields" :key="field.id">
              <p class="field-name">{{ field.name }}</p>
              <p class="field-type">{{ field.type }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="card highlights">
      <div class="section-head">
        <h2>Что включено</h2>
        <span class="section-note">Пункты можно уточнить при создании заказа</span>
      </div>
      <div class="highlight-grid">
        <div v-for="item in highlights" :key="item.title" class="highlight">
          <div class="icon">{{ item.icon }}</div>
          <div>
            <p class="highlight-title">{{ item.title }}</p>
            <p class="highlight-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/shared/composables/useAuth'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import type { Service, CustomField } from '@/entities/service/types'

const route = useRoute()
const { isUser, isBuyer } = useAuth()
const cartStore = useCartStore()
const uiStore = useUiStore()

const service = ref<Service | null>(createMockService(route.params.id as string))

const customFields = computed<CustomField[]>(() => service.value?.customFields ?? [])

const categoryLabel = computed(() => getCategoryName(service.value?.category || 'other'))
const categoryEmoji = computed(() => getCategoryEmoji(service.value?.category || 'other'))

const highlights = [
  { icon: '📦', title: 'Проверка посылки', desc: 'Фото/видео распаковки и сверка артикула' },
  { icon: '🧾', title: 'Документы', desc: 'Чек, трек-номер и гарантийные данные' },
  { icon: '🚚', title: 'Отправка в день выкупа', desc: 'Минимизируем сроки доставки до клиента' },
  { icon: '🛡️', title: 'Безопасность', desc: 'Фрод-чек продавца и защита платежей' }
]

function createMockService(id: string): Service {
  const categories = ['electronics', 'clothing', 'books', 'other'] as const
  const category = categories[Math.floor(Math.random() * categories.length)] || 'electronics'
  return {
    id: id || 'service-1',
    name: 'Выкуп и проверка товара из США',
    description: 'Проверка продавца, фото/видео подтверждение, трек-номер и контроль доставки.',
    price: Math.floor(Math.random() * 5000) + 3500,
    category,
    images: [],
    customFields: [
      { id: 'cf-1', name: 'Ссылка на товар', type: 'text', required: true },
      { id: 'cf-2', name: 'Комментарий к комплектации', type: 'text', required: false },
      { id: 'cf-3', name: 'Желаемая служба доставки', type: 'select', required: false, options: ['EMS', 'UPS', 'DHL'] }
    ],
    buyerId: 'buyer-42',
    rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 120),
    createdAt: new Date().toISOString()
  }
}

const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    electronics: 'Электроника',
    clothing: 'Одежда',
    books: 'Книги',
    other: 'Другое'
  }
  return names[category] || category
}

const getCategoryEmoji = (category: string) => {
  const emojiMap: Record<string, string> = {
    electronics: '💻',
    clothing: '👕',
    books: '📚',
    other: '📦'
  }
  return emojiMap[category] || '📦'
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value)

const handleAddToCart = () => {
  if (!service.value) return
  cartStore.addToCart(service.value, 1)
  uiStore.addNotification({
    type: 'success',
    title: 'В корзине',
    message: `${service.value.name} добавлена в корзину`,
    duration: 2500
  })
}

const handleTakeOrder = () => {
  if (!service.value) return
  uiStore.addNotification({
    type: 'info',
    title: 'Заказ взят в работу',
    message: `Услуга "${service.value.name}" закреплена за вами`,
    duration: 3000
  })
}
</script>

<style scoped>
.service-page {
  padding: 1rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.breadcrumbs a {
  color: var(--primary-color);
  text-decoration: none;
}

.title {
  margin: 0;
  font-size: 2rem;
  color: var(--text-primary);
  line-height: 1.2;
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
}

.meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pill {
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
}

.pill.rating {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 12%, var(--background-secondary));
}

.pill.ghost {
  color: var(--text-secondary);
}

.grid {
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

.media {
  display: flex;
  flex-direction: column;
}

.media-main {
  border-bottom: 1px solid var(--border-color);
}

.media-placeholder {
  aspect-ratio: 16 / 9;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 15%, transparent), var(--background-tertiary));
}

.media-emoji {
  font-size: 2rem;
}

.media-thumbs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  padding: 0.75rem;
}

.thumb {
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 0.75rem;
  text-align: center;
  color: var(--text-secondary);
}

.thumb.active {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 10%, var(--background-secondary));
}

.summary {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.price-block .label {
  margin: 0;
  color: var(--text-secondary);
}

.price-block .price {
  margin: 0.1rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.price-block .hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.btn.success {
  background: var(--accent-green);
  color: white;
  border-color: var(--accent-green);
}

.btn.success:hover {
  background: #0da371;
}

.btn.ghost {
  background: var(--background-tertiary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn.ghost:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.quick-facts {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.quick-facts li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
  color: var(--text-primary);
}

.quick-facts span {
  color: var(--text-secondary);
}

.details {
  padding: 1.25rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.section-head h2 {
  margin: 0;
}

.section-note {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.text p {
  margin: 0 0 0.75rem;
  color: var(--text-primary);
}

.badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.chip {
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--primary-color) 10%, var(--background-secondary));
  color: var(--primary-color);
  border: 1px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
  font-weight: 600;
  font-size: 0.9rem;
}

.fields {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 0.75rem;
  background: var(--background-tertiary);
}

.fields h3 {
  margin: 0 0 0.75rem;
}

.fields ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.fields li {
  padding: 0.65rem;
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-md);
}

.field-name {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
}

.field-type {
  margin: 0.15rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.highlights {
  padding: 1.25rem;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.highlight {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 0.75rem;
  background: var(--background-tertiary);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: flex-start;
}

.icon {
  font-size: 1.4rem;
}

.highlight-title {
  margin: 0;
  font-weight: 700;
  color: var(--text-primary);
}

.highlight-desc {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .title {
    font-size: 1.5rem;
  }

  .media-placeholder {
    aspect-ratio: 4 / 3;
  }
}
</style>
