<template>
  <div class="page-wrapper">
    <section class="section hero">
      <div class="container">
        <p class="eyebrow">Вопросы</p>
        <h1>Часто спрашивают</h1>
        <p class="lede">Собрали ответы про оплату, сроки, гарантию и возврат.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="card faq-card" v-for="item in faq" :key="item.q">
          <h3>{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const faq = [
  { q: 'Как выбрать байера?', a: 'Смотрите рейтинг, опыт по категории и сроки. Мы подскажем, кто лучше подойдёт.' },
  { q: 'Что насчёт гарантии?', a: 'Страхуем посылку, фиксируем чек и фото. При нарушении условий вернём деньги.' },
  { q: 'Сколько идёт доставка?', a: 'Экспресс — от 3 дней, стандарт — от 7. Сроки зависят от страны и перевозчика.' }
]
</script>

<style scoped>
.hero { padding-top: var(--space-12); }
.faq-card { margin-bottom: var(--space-4); }
</style>
