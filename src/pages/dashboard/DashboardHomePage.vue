<template>
  <div class="stack">
    <h1>Главная</h1>
    <p class="muted">Быстрый обзор: активные заказы, посылки, баланс.</p>
    <div class="cards">
      <div class="card">Активных заказов: 0</div>
      <div class="card">Посылок в пути: 0</div>
      <div class="card">Баланс: 0 ₽</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.stack { display: grid; gap: var(--space-4); width: 100%; align-self: stretch; align-content: start; justify-items: start; }
.cards { display: grid; gap: var(--grid-gap); grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.muted { color: var(--text-secondary); }
</style>
