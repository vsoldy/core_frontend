<template>
  <div class="request-page" v-if="request">
    <header class="page-header">
      <div class="breadcrumbs">
        <router-link to="/services">Услуги</router-link>
        <span>·</span>
        <span>{{ categoryLabel }}</span>
      </div>
      <h1 class="title">{{ request.title }}</h1>
      <p class="subtitle">{{ request.description }}</p>
      <div class="meta">
        <span class="pill">{{ categoryLabel }}</span>
        <span class="pill ghost">Бюджет: {{ formatPrice(request.budget) }}</span>
        <span class="pill ghost">Дедлайн: {{ formatDate(request.deadline) }}</span>
      </div>
    </header>

    <section class="card request-info">
      <h2>Детали запроса</h2>
      <div class="info-grid">
        <div class="info-row">
          <p class="label">Адрес</p>
          <p class="value">{{ request.address || 'Не указан' }}</p>
        </div>
        <div class="info-row">
          <p class="label">Бюджет</p>
          <p class="value">{{ formatPrice(request.budget) }}</p>
        </div>
        <div class="info-row">
          <p class="label">Дедлайн</p>
          <p class="value">{{ formatDate(request.deadline) }}</p>
        </div>
      </div>
    </section>

    <section class="card offers">
      <div class="section-head">
        <h2>Отклики</h2>
        <span class="section-note">Buyer оставляют предложения, User выбирает</span>
      </div>

      <div v-if="isBuyer" class="offer-form">
        <h3>Откликнуться</h3>
        <div class="form-row">
          <label>
            Цена, ₽
            <input v-model.number="offerForm.price" type="number" min="0" />
          </label>
          <label>
            Срок, дней
            <input v-model.number="offerForm.etaDays" type="number" min="1" />
          </label>
        </div>
        <label class="full">
          Комментарий
          <textarea v-model="offerForm.comment" rows="3" placeholder="Опишите сроки, гарантии, доставку"></textarea>
        </label>
        <button class="btn primary" :disabled="buyerAlreadyResponded" @click="submitOffer">
          {{ buyerAlreadyResponded ? 'Отклик уже отправлен' : 'Отправить отклик' }}
        </button>
      </div>

      <div v-if="acceptedOffer" class="accepted-banner">
        <p class="accepted-title">Принято предложение</p>
        <p class="accepted-meta">
          {{ acceptedOffer?.buyerName }} · {{ formatPrice(acceptedOffer?.price || 0) }} ·
          {{ acceptedOffer?.etaDays }} дн.
        </p>
      </div>

      <div v-if="offersForListing.length === 0" class="empty-offers">
        Пока нет откликов
      </div>

      <ul v-else class="offers-list">
        <li v-for="offer in offersForListing" :key="offer.id" class="offer-row">
          <div class="offer-main">
            <p class="offer-buyer">{{ offer.buyerName }}</p>
            <p class="offer-comment">{{ offer.comment || 'Без комментария' }}</p>
            <div class="offer-meta">
              <span class="pill">Цена: {{ formatPrice(offer.price) }}</span>
              <span class="pill">Срок: {{ offer.etaDays }} дн.</span>
              <span :class="['pill', `status-${offer.status}`]">{{ statusText(offer.status) }}</span>
            </div>
          </div>
          <div v-if="isUser" class="offer-actions">
            <button class="btn primary" :disabled="offer.status === 'accepted'" @click="acceptOffer(offer.id)">
              Принять
            </button>
            <button class="btn ghost" :disabled="offer.status === 'rejected'" @click="rejectOffer(offer.id)">
              Отклонить
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables/useAuth'
import { useUiStore } from '@/stores/ui'
import { useOffersStore } from '@/stores/offers'
import { useRequestsStore } from '@/stores/requests'
import type { Request } from '@/entities/request/types'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const offersStore = useOffersStore()
const requestsStore = useRequestsStore()
const { isBuyer, isUser, user } = useAuth()

const request = ref<Request | null>(requestsStore.getRequestById(route.params.id as string) || null)
if (!request.value) {
  uiStore.addNotification({
    type: 'error',
    title: 'Запрос не найден',
    message: 'Вернулись в каталог'
  })
  router.replace('/services')
}

offersStore.loadOffers(request.value?.id || '')

const offerForm = ref({
  price: request.value?.budget ?? 0,
  etaDays: 2,
  comment: ''
})

const offersForListing = computed(() => offersStore.offersByListing(request.value?.id || ''))
const acceptedOffer = computed(() => offersStore.acceptedOffer(request.value?.id || ''))
const buyerAlreadyResponded = computed(() =>
  user.value?.id ? offersStore.hasOfferFromBuyer(request.value?.id || '', user.value.id) : false
)

const categoryLabel = computed(() => getCategoryName(request.value?.category || 'other'))

const submitOffer = () => {
  if (!request.value || !user.value) return
  offersStore.createOffer({
    listingId: request.value.id,
    buyerId: user.value.id,
    buyerName: user.value.name,
    price: offerForm.value.price,
    etaDays: offerForm.value.etaDays,
    comment: offerForm.value.comment
  })
  uiStore.addNotification({
    type: 'success',
    title: 'Отклик отправлен',
    message: 'Ваше предложение отправлено пользователю'
  })
  offerForm.value.comment = ''
}

const acceptOffer = (offerId: string) => {
  if (!request.value) return
  offersStore.acceptOffer(request.value.id, offerId)
  uiStore.addNotification({
    type: 'success',
    title: 'Предложение принято',
    message: 'Отклик выбран. Покупатель получит уведомление.'
  })
}

const rejectOffer = (offerId: string) => {
  offersStore.rejectOffer(offerId)
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

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(new Date(value))
    : '—'

const statusText = (status: 'proposed' | 'accepted' | 'rejected') => {
  const map: Record<string, string> = {
    proposed: 'На рассмотрении',
    accepted: 'Принято',
    rejected: 'Отклонено'
  }
  return map[status] || status
}
</script>

<style scoped>
.request-page {
  padding: calc(var(--header-offset) + 1rem) 0 2rem;
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

.pill.ghost {
  color: var(--text-secondary);
}

.card {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.request-info {
  padding: 1rem;
}

.info-grid {
  display: grid;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
}

.label {
  margin: 0;
  color: var(--text-secondary);
}

.value {
  margin: 0;
  font-weight: 700;
}

.offers {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.offer-form {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 0.75rem;
  background: var(--background-tertiary);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.offer-form input,
.offer-form textarea {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-secondary);
  color: var(--text-primary);
}

.offer-form textarea {
  resize: vertical;
}

.accepted-banner {
  border: 1px solid var(--accent-green);
  background: rgba(16, 185, 129, 0.1);
  border-radius: var(--border-radius-md);
  padding: 0.75rem;
}

.accepted-title {
  margin: 0;
  font-weight: 700;
  color: var(--accent-green);
}

.accepted-meta {
  margin: 0.15rem 0 0;
  color: var(--text-primary);
}

.offers-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.offer-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
}

.offer-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.offer-buyer {
  margin: 0;
  font-weight: 700;
}

.offer-comment {
  margin: 0;
  color: var(--text-secondary);
}

.offer-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.offer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.empty-offers {
  color: var(--text-secondary);
}

.status-proposed {
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.status-accepted {
  color: var(--accent-green);
  border-color: var(--accent-green);
  background: rgba(16, 185, 129, 0.08);
}

.status-rejected {
  color: var(--accent-red);
  border-color: var(--accent-red);
  background: rgba(239, 68, 68, 0.08);
}

@media (max-width: 768px) {
  .offer-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>
