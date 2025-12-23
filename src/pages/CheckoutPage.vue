<template>
  <div class="checkout-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Оформление</p>
        <h1>Оформление заказа</h1>
        <p class="subtitle">Подтвердите состав и итоговую сумму перед запуском выкупа.</p>
      </div>
      <router-link to="/cart" class="link">← Вернуться в корзину</router-link>
    </header>

    <div class="card placeholder">
      <h2>Экран оформления будет доработан</h2>
      <p>Здесь появятся адрес доставки, подтверждение суммы и выбор опций.</p>
      <router-link to="/services" class="btn primary">Перейти в каталог</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.checkout-page {
  padding: calc(var(--header-offset) + 1rem) 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-header {
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

.card.placeholder {
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  border: 1px dashed var(--border-color);
  background: var(--background-secondary);
  display: grid;
  gap: 0.75rem;
}

.btn.primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1rem;
  border-radius: var(--border-radius-md);
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border: 1px solid var(--primary-color);
  font-weight: 700;
}
</style>
