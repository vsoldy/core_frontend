<template>
  <div class="service-card" @click="handleClick">
    <div class="card-image">
      <div class="image-placeholder">
        <span>{{ getCategoryEmoji(service.category || 'other') }}</span>
      </div>
      
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <div>
          <p class="card-brand">{{ service.brand || 'Без бренда' }}</p>
          <h3 class="card-title">{{ service.name }}</h3>
        </div>
        <div class="card-price">{{ formatPrice(service.price) }} ₽</div>
      </div>

      <div class="card-footer">
        <div v-if="service.rating" class="reviews">
          ⭐ {{ service.rating.toFixed(1) }}
          <span v-if="service.reviewCount">· {{ service.reviewCount }}</span>
        </div>
        <div v-else class="reviews muted">Нет оценок</div>

        <div class="card-actions">
          <button
            v-if="showAddToCart && !isBuyer"
            class="add-to-cart-btn"
            @click.stop="addToCart"
            title="Добавить в корзину"
          >
            Добавить в корзину
          </button>

          <button
            v-else-if="showTakeOrder && isBuyer"
            class="take-order-btn"
            @click.stop="takeOrder"
            title="Взять заказ"
          >
            Взять заказ
          </button>
        </div>
      </div>
    </div>
    <button
      v-if="showFavorite && !isBuyer"
      :class="['favorite-btn', { active: isFavorite }]"
      @click.stop="toggleFavorite"
      title="В избранное"
      aria-label="Добавить в избранное"
    >
      ♥
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables/useAuth'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import type { Service } from '@/entities/service/types'

interface Props {
  service: Service
  showAddToCart?: boolean
  showTakeOrder?: boolean
  showFavorite?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddToCart: true,
  showTakeOrder: false,
  showFavorite: true
})

const emit = defineEmits<{
  'add-to-cart': [service: Service]
  'take-order': [service: Service]
}>()

const router = useRouter()
const { isBuyer } = useAuth()
const cartStore = useCartStore()
const uiStore = useUiStore()
const isFavorite = ref(false)

// Форматирование цены
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

// Эмодзи для категорий
const getCategoryEmoji = (category: string) => {
  const emojiMap: Record<string, string> = {
    'electronics': '📱',
    'clothing': '👕',
    'books': '📚',
    'other': '📦'
  }
  return emojiMap[category] || '📦'
}

// Обработка клика по карточке
const handleClick = () => {
  router.push({ name: 'service', params: { id: props.service.id } })
}

// Добавление в корзину
const addToCart = () => {
  cartStore.addToCart(props.service, 1)
  
  uiStore.addNotification({
    type: 'success',
    title: 'Добавлено в корзину',
    message: `${props.service.name} добавлен в корзину`,
    duration: 2000
  })
  
  emit('add-to-cart', props.service)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uiStore.addNotification({
    type: 'success',
    title: isFavorite.value ? 'В избранном' : 'Удалено из избранного',
    message: props.service.name,
    duration: 2000
  })
}

// Взятие заказа в работу
const takeOrder = () => {
  uiStore.addNotification({
    type: 'info',
    title: 'Взято в работу',
    message: `Вы взяли заказ "${props.service.name}" в работу`,
    duration: 3000
  })
  
  emit('take-order', props.service)
}
</script>

<style scoped>
.service-card {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
  position: relative;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color-light);
}

.card-image {
  position: relative;
  background: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  width: 100%;
  min-height: 180px;
}

.image-placeholder {
  font-size: 2rem;
  opacity: 0.5;
}

.card-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.card-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  flex: 1;
}

.card-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
  white-space: nowrap;
  flex-shrink: 0;
}

.card-brand {
  margin: 0 0 0.15rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
}

.card-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
}

.reviews {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.reviews.muted {
  opacity: 0.7;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
}

.add-to-cart-btn,
.take-order-btn {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.add-to-cart-btn {
  background: var(--primary-color);
  color: white;
}

.add-to-cart-btn:hover {
  background: var(--primary-color-dark);
  transform: scale(1.05);
}

.take-order-btn {
  background: var(--accent-green);
  color: white;
}

.take-order-btn:hover {
  background: #0da371;
  transform: scale(1.05);
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.7);
  color: #f8fafc;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 2;
}

.favorite-btn.active {
  color: #f472b6;
  border-color: rgba(244, 114, 182, 0.8);
  background: rgba(15, 23, 42, 0.85);
}

/* Адаптация для разных размеров экрана */
@media (max-width: 768px) {
  .service-card {
    min-height: 240px;
  }
  
  .card-image {
    min-height: 140px;
  }
  
  .image-placeholder {
    font-size: 1.5rem;
  }
  
  .card-content {
    padding: 0.75rem;
    gap: 0.375rem;
  }
  
  .card-title {
    font-size: 0.9rem;
  }
  
  .card-price {
    font-size: 1rem;
  }
  
  .card-footer {
    gap: 0.375rem;
  }
  
  .reviews {
    text-align: center;
  }
  
  .card-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .service-card {
    min-height: auto;
  }
  
  .card-image {
    min-height: 160px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .card-price {
    align-self: flex-start;
  }
}
</style>
