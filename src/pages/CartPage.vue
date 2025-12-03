<template>
  <div class="cart-page">
    <h1>Корзина</h1>
    <p>Доступно только для пользователей (user)</p>
    <div v-if="isEmpty" class="empty-cart">
      <p>Корзина пуста</p>
    </div>
    <div v-else>
      <p>Товаров в корзине: {{ totalItems }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const { totalItems, isEmpty } = storeToRefs(cartStore)
</script>

<style scoped>
.cart-page {
  padding: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  background: var(--background-tertiary);
  border-radius: var(--border-radius-md);
  margin-top: 2rem;
}
</style>