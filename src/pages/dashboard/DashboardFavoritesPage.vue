<template>
  <div class="favorites-page">
    <header class="page-head">
      <div>
        <h1>Избранное</h1>
        <p class="muted">Сохраненные товары и подборки для быстрого заказа</p>
      </div>
      <router-link to="/services" class="pill-btn ghost">Перейти в каталог</router-link>
    </header>

    <div class="card empty">
      <div class="empty-icon">⭐</div>
      <h3>Пока нет избранного</h3>
      <p>Добавляйте товары в избранное, чтобы быстро возвращаться к ним.</p>
      <router-link to="/services" class="pill-btn accent">Открыть каталог</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.favorites-page {
  display: grid;
  gap: var(--space-4);
  width: 100%;
  align-self: stretch;
}

.page-head {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  align-items: center;
}

.muted {
  color: var(--text-secondary);
}

.card.empty {
  display: grid;
  place-items: center;
  text-align: center;
  padding: var(--space-6);
  gap: var(--space-2);
}

.empty-icon {
  font-size: 2rem;
}
</style>
