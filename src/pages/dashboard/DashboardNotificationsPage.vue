<template>
  <div class="stack">
    <header class="page-head">
      <h1>Уведомления</h1>
      <p class="muted">Все обновления по заказам, платежам и статусам.</p>
    </header>
    <div class="empty card">
      Пока нет уведомлений
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.stack { display: grid; gap: var(--space-4); width: 100%; align-self: stretch; }
.page-head h1 { margin: 0 0 0.5rem; }
.muted { color: var(--text-secondary); margin: 0; }
.empty { padding: 1rem; }
</style>
