<template>
  <div class="execution-page">
    <h1>Исполнение заказов</h1>
    <p>Доступно только для выкупщиков (buyer)</p>
    <div class="info-card">
      <p>Здесь будут отображаться заказы, взятые в работу</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.execution-page {
  padding: 2rem;
}

.info-card {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--background-secondary);
  border-radius: var(--border-radius-md);
  max-width: 600px;
}
</style>