<template>
  <div class="page-wrapper">
    <section class="section hero">
      <div class="container">
        <p class="eyebrow">Контакты</p>
        <h1>Всегда на связи</h1>
        <p class="lede">Напишите нам в чат, по почте или телефону — ответим в течение пары минут.</p>
      </div>
    </section>
    <section class="section">
      <div class="container contact-grid">
        <div class="card">
          <h3>Поддержка</h3>
          <p>support@soldy.com</p>
          <p>+7 (XXX) XXX-XX-XX</p>
        </div>
        <div class="card">
          <h3>Чат</h3>
          <p>Доступен в личном кабинете 24/7</p>
          <RouterLink to="/dashboard/chat" class="btn">Открыть чат</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.hero { padding-top: var(--space-12); }
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--grid-gap);
}
</style>
