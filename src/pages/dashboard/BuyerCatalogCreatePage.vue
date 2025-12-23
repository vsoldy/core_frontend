<template>
  <div class="stack">
    <header class="page-head">
      <div>
        <h1>Создание объявления</h1>
        <p class="muted">Добавьте предложение для каталога</p>
      </div>
    </header>

    <div class="card empty">
      <div class="empty-icon">🛍️</div>
      <h3>Форма будет добавлена позже</h3>
      <p>Здесь появятся поля для описания и условий выкупа.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.stack {
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
