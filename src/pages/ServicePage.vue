<template>
  <div class="service-page">
    <h1>Страница услуги</h1>
    <p>ID услуги: {{ $route.params.id }}</p>
    <router-link to="/catalog" class="back-link">
      ← Назад к каталогу
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.service-page {
  padding: 2rem;
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: var(--primary-color);
  text-decoration: none;
}
</style>