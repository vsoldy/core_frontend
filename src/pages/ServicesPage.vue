<template>
  <div class="page-wrapper">
    <section class="section hero">
      <div class="container">
        <p class="eyebrow">Услуги</p>
        <h1>Каталог выкупа и доставки</h1>
        <p class="lede">Выбирайте байера, фильтруйте по категории и цене, оформляйте запросы и заказы.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <RouterLink to="/requests/new" class="btn">Создать запрос</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.hero {
  padding-top: var(--space-12);
}
</style>
