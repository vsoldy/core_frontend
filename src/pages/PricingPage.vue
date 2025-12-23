<template>
  <div class="page-wrapper">
    <section class="section hero">
      <div class="container">
        <p class="eyebrow">Цены</p>
        <h1>Прозрачные тарифы без скрытых сборов</h1>
        <p class="lede">Оплата за выкуп, доставку и дополнительные опции видна заранее.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="pricing-grid">
          <div class="card">
            <h3>Базовый</h3>
            <p>Для простых заказов и небольших посылок.</p>
          </div>
          <div class="card">
            <h3>Экспресс</h3>
            <p>Ускоренная доставка и приоритетная обработка.</p>
          </div>
          <div class="card">
            <h3>Премиум</h3>
            <p>Максимальные гарантии и персональный байер.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero { padding-top: var(--space-12); }
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--grid-gap);
}
</style>
