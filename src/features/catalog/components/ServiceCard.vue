<template>
  <div class="service-card" @click="handleClick">
    <div class="card-image">
      <div class="image-placeholder">
        <span>{{ getCategoryEmoji(service.category) }}</span>
      </div>
      
      <div class="card-badges">
        <span class="badge category">{{ getCategoryName(service.category) }}</span>
        <span v-if="service.rating" class="badge rating">
          ⭐ {{ service.rating.toFixed(1) }}
        </span>
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ service.name }}</h3>
        <div class="card-price">{{ formatPrice(service.price) }} ₽</div>
      </div>
      
      <p class="card-description">{{ truncateDescription(service.description) }}</p>
      
      <div class="card-footer">
        <div v-if="service.reviewCount > 0" class="reviews">
          {{ service.reviewCount }} отзывов
        </div>
        
        <div class="card-actions">
          <button 
            v-if="showAddToCart && isUser" 
            class="add-to-cart-btn"
            @click.stop="addToCart"
            title="Добавить в корзину"
          >
            🛒
          </button>
          
          <button 
            v-else-if="showTakeOrder && isBuyer" 
            class="take-order-btn"
            @click.stop="takeOrder"
            title="Взять заказ"
          >
            📝
          </button>
          
          <router-link 
            :to="{ name: 'service', params: { id: service.id } }"
            class="details-link"
            @click.stop
          >
            Подробнее
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables/useAuth'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import type { Service } from '@/entities/service/types'

interface Props {
  service: Service
  showAddToCart?: boolean
  showTakeOrder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddToCart: true,
  showTakeOrder: false
})

const emit = defineEmits<{
  'add-to-cart': [service: Service]
  'take-order': [service: Service]
}>()

const router = useRouter()
const { isUser, isBuyer } = useAuth()
const cartStore = useCartStore()
const uiStore = useUiStore()

// Форматирование цены
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

// Сокращение описания
const truncateDescription = (description: string, maxLength: number = 60) => {
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength) + '...'
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

// Название категории
const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    'electronics': 'Электроника',
    'clothing': 'Одежда',
    'books': 'Книги',
    'other': 'Другое'
  }
  return names[category] || category
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
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color-light);
}

.card-image {
  position: relative;
  height: 120px;
  background: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.image-placeholder {
  font-size: 2rem;
  opacity: 0.5;
}

.card-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.badge {
  padding: 3px 6px;
  border-radius: var(--border-radius-sm);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.badge.category {
  background: var(--primary-color);
  color: white;
}

.badge.rating {
  background: var(--accent-yellow);
  color: #000;
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

.card-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
  flex: 1;
  min-height: 2.8em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.reviews {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.add-to-cart-btn,
.take-order-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 0.9rem;
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

.details-link {
  padding: 0.375rem 0.75rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.8rem;
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.details-link:hover {
  background: var(--primary-color);
  color: white;
}

/* Адаптация для разных размеров экрана */
@media (max-width: 768px) {
  .service-card {
    min-height: 260px;
  }
  
  .card-image {
    height: 100px;
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
  
  .card-description {
    font-size: 0.75rem;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: stretch;
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
  
  .card-header {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .card-price {
    align-self: flex-start;
  }
}
</style>