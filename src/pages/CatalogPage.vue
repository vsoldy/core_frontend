<template>
  <div class="catalog-page">
    <h1>Каталог услуг</h1>
    <p>Страница находится в разработке</p>
    <router-link to="/" class="back-link">
      Вернуться на главную
    </router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.catalog-page {
  padding: 2rem;
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--primary-color);
  text-decoration: none;
}
</style>