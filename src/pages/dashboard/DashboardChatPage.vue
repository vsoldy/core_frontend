<template>
  <div class="stack top-align">
    <h1>Чат</h1>
    <p class="muted">Переписка с байером и поддержкой.</p>
    <div class="card">История диалогов появится здесь.</div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.stack { display: grid; gap: var(--space-4); align-content: start; justify-items: start; align-items: start; width: 100%; align-self: stretch; }
.muted { color: var(--text-secondary); }
.top-align { justify-content: flex-start; }
</style>
