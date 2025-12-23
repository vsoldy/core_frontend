<template>
  <div class="page-wrapper">
    <section class="section hero">
      <div class="container-wide hero__grid">
        <div>
          <p class="eyebrow">О нас</p>
          <h1>Мы соединяем людей и магазины по всему миру</h1>
          <p class="lede">
            SOLDY — это сервис, где user находит байера, а байер берёт на себя покупку, проверку и доставку. Прозрачность, доверие и скорость — наш базис.
          </p>
        </div>
        <div class="hero-card shadow-lg">
          <h3>Ценности команды</h3>
          <ul>
            <li v-for="item in values" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head">
          <h2>История и путь</h2>
          <p class="lede">От первых доставок до тысяч заказов в месяц</p>
        </div>
        <div class="timeline">
          <div class="timeline__item" v-for="item in timeline" :key="item.year">
            <div class="badge">{{ item.year }}</div>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container">
        <div class="section__head">
          <h2>Почему нам доверяют</h2>
          <p class="lede">Простые правила, которые не меняются</p>
        </div>
        <div class="grid">
          <div class="card" v-for="item in reasons" :key="item.title">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta">
          <div>
            <h3>Готовы оформить заказ?</h3>
            <p>Создайте запрос, мы подберём байера под ваш товар и бюджет.</p>
          </div>
          <RouterLink to="/requests/new" class="btn">Создать запрос</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const values = [
  'Прозрачная коммуникация и чек-листы',
  'Ответственность за товар и сроки',
  'Поддержка 24/7 и быстрые решения',
  'Внимание к деталям: фото, видео, упаковка'
]

const timeline = [
  { year: '2019', title: 'Первые заказы', text: 'Команда байеров запустила пилот на 100 заказов и получила рейтинг 4.9.' },
  { year: '2021', title: 'География и команды', text: 'Открыли склады в ЕС и США, расширили команды поддержки.' },
  { year: '2023', title: 'Автоматизация', text: 'Запустили трекинг, страховку и единый чат в приложении.' }
]

const reasons = [
  { title: 'Гарантии и страховка', text: 'Страхуем посылки, возвращаем деньги при нарушении условий.' },
  { title: 'Честные цены', text: 'Без скрытых сборов: видно, за что платите и какие опции выбираете.' },
  { title: 'Экспертиза байеров', text: 'Выбираем по категории: техника, мода, хобби — нужен опыт, а не случайный курьер.' },
  { title: 'Контроль качества', text: 'Фото/видео-отчёт до отправки, проверка комплектности и упаковки.' }
]
</script>

<style scoped>
.hero {
  padding-top: var(--space-12);
}

.hero__grid {
  display: grid;
  gap: var(--space-8);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: center;
}

.hero-card {
  background: var(--background-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
}

.hero-card ul {
  list-style: none;
  display: grid;
  gap: var(--space-3);
  padding: 0;
  margin: var(--space-3) 0 0;
}

.section__head {
  text-align: center;
  margin-bottom: var(--space-8);
}

.timeline {
  display: grid;
  gap: var(--space-4);
}

.timeline__item {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: var(--space-4);
  align-items: center;
  background: var(--background-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--space-5);
}

.badge {
  display: inline-grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: var(--border-radius-lg);
  background: rgba(var(--primary-color-rgb), 0.12);
  color: var(--primary-color-dark);
  font-weight: 700;
  font-size: 1.2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--grid-gap);
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--border-radius-xl);
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1), rgba(14, 165, 233, 0.04));
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .timeline__item {
    grid-template-columns: 1fr;
  }
}
</style>
