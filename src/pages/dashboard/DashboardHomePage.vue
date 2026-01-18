<template>
  <DashboardHomeMobilePage v-if="isMobile" />
  <div v-else class="stack">
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DashboardHomeMobilePage from './DashboardHomeMobilePage.vue'

const isMobile = ref(false)

const updateViewport = () => {
  isMobile.value = window.innerWidth <= 960
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewport)
})
</script>

<style scoped>
.stack { display: grid; gap: var(--space-4); width: 100%; align-self: stretch; align-content: start; justify-items: start; }
.cards { display: grid; gap: var(--grid-gap); grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); width: 100%; }
.muted { color: var(--text-secondary); margin: 0; }
</style>
