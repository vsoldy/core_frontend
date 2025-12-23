<template>
  <div class="stack top-align">
    <h1>Посылки</h1>
    <p class="muted">Трекинг посылок появится здесь.</p>
    <div class="card">Пока нет посылок в пути.</div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.stack { display: grid; gap: var(--space-4); align-content: start; justify-items: start; align-items: start; width: 100%; align-self: stretch; }
.muted { color: var(--text-secondary); }
.top-align { justify-content: flex-start; }
</style>
