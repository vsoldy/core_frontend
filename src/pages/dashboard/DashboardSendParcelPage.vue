<template>
  <div class="stack top-align">
    <h1>Отправить посылку</h1>
    <p class="muted">Форма отправки будет здесь.</p>
    <div class="card">Добавим шаги отправки и подтверждение.</div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.stack { display: grid; gap: var(--space-4); align-content: start; justify-items: start; align-items: start; width: 100%; align-self: stretch; }
.muted { color: var(--text-secondary); }
.top-align { justify-content: flex-start; }
</style>
