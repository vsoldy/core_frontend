<template>
  <div class="admin-page">
    <h1>Админ-панель</h1>
    <p>Доступно для администраторов и менеджеров</p>
    <div class="admin-grid">
      <div class="admin-card">
        <h3>Статистика</h3>
        <p>Будет доступна позже</p>
      </div>
      <div class="admin-card">
        <h3>Пользователи</h3>
        <p>Будет доступна позже</p>
      </div>
      <div class="admin-card">
        <h3>Заказы</h3>
        <p>Будет доступна позже</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.admin-page {
  padding: 2rem;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.admin-card {
  background: var(--background-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
}
</style>