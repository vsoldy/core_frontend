<template>
  <div class="page-wrapper">
    <section class="hero">
      <div class="container-wide hero__grid">
        <div class="hero__content">
          <p class="eyebrow">Выкуп и доставка без сюрпризов</p>
          <h1>Надёжный покупатель за рубежом для каждого заказа</h1>
          <p class="lede">
            Подберём байера, оформим доставку и покажем прозрачный трекинг — от корзины до двери.
          </p>
          <div class="hero__actions">
            <RouterLink to="/services" class="btn">Перейти в каталог</RouterLink>
            <a href="#how" class="btn btn-ghost">Как это работает</a>
          </div>
          <div class="hero__meta">
            <div>
              <strong>10 000+</strong>
              <span>выполненных заказов</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>оценка покупателей</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>поддержка</span>
            </div>
          </div>
        </div>
        <div class="hero__visual">
          <div class="hero-card shadow-lg">
            <p class="hero-card__title">Ваш заказ в пути</p>
            <div class="hero-card__track">
              <span class="dot active"></span>
              <span class="dot active"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <div class="hero-card__rows">
              <div class="row">
                <span>Статус</span>
                <strong>Проверка и упаковка</strong>
              </div>
              <div class="row">
                <span>Доставка</span>
                <strong>Экспресс, 3–5 дней</strong>
              </div>
              <div class="row">
                <span>Страховка</span>
                <strong>Включена</strong>
              </div>
            </div>
          </div>
          <div class="hero-note">
            Покупаем в проверенных магазинах США и ЕС. Фотоотчёт и чек — в приложении.
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="how">
      <div class="container">
        <div class="section__head">
          <h2>Как это работает</h2>
          <p class="lede">Прозрачный процесс от выбора товара до выдачи трек‑номера</p>
        </div>
        <div class="steps">
          <div class="step-card" v-for="(step, idx) in steps" :key="step.title">
            <div class="step-card__badge">{{ idx + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container grid two-cols">
        <div class="card">
          <h2>Что делает платформа</h2>
          <ul class="list">
            <li>Показываем товары из каталогов магазинов и брендов.</li>
            <li>Подбираем исполнителя (баера) под заказ.</li>
            <li>Склад в Испании принимает, проверяет и отправляет посылки.</li>
          </ul>
        </div>
        <div class="card">
          <h2>Как устроены платежи</h2>
          <p>
            В интерфейсе используются формулировки “предоплата за услуги” и “средства по заказам”.
            Это не банковский счет и не электронный кошелек.
          </p>
          <ul class="list">
            <li>Оплата проходит в рублях через турецкий PSP/EMI.</li>
            <li>Средства учитываются во внутреннем учете заказа.</li>
            <li>Возврат — на исходный метод оплаты через PSP.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container">
        <div class="section__head">
          <h2>Преимущества</h2>
          <p class="lede">Безопасные покупки за рубежом для user и buyer</p>
        </div>
        <div class="features">
          <div class="feature-card" v-for="item in features" :key="item.title">
            <div class="feature-card__icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head">
          <h2>Популярные услуги</h2>
          <p class="lede">Выкуп, проверка, доставка — под ваш запрос</p>
        </div>
        <div class="cta-bar">
          <div>
            <h3>Готовы начать?</h3>
            <p>Создайте запрос, и мы предложим байеров за пару минут.</p>
          </div>
          <RouterLink to="/requests/new" class="btn">Создать запрос</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const steps = [
  { title: 'Выбор товара', text: 'Каталог собирается из магазинов и брендов. Добавьте позиции в корзину.' },
  { title: 'Предоплата', text: 'Оплачиваете услуги выкупа и логистики через PSP.' },
  { title: 'Выкуп и доказательства', text: 'Баер покупает товар и загружает чек и фото.' },
  { title: 'Склад и отправка', text: 'Склад проверяет и выдает трек‑номер Pegasus.' }
]

const features = [
  { title: 'Прозрачность', text: 'Чеки, фото, трек-номер и история действий в одном месте.', icon: '🔍' },
  { title: 'Гарантии', text: 'Страховка посылки, безопасная оплата, возврат при браке.', icon: '🛡️' },
  { title: 'Скорость', text: 'Экспресс-доставка от 3 дней, автоматические уведомления.', icon: '⚡' },
  { title: 'Опытные байеры', text: 'Рейтинг и отзывы видны до сделки, подбор под категорию.', icon: '⭐' }
]
</script>

<style scoped>
.hero {
  padding: var(--space-16) 0 var(--space-12);
  background: radial-gradient(circle at 20% 20%, rgba(var(--primary-color-rgb), 0.08), transparent 30%),
    radial-gradient(circle at 80% 0%, rgba(var(--primary-color-rgb), 0.12), transparent 35%),
    var(--background-primary);
}

.hero__grid {
  display: grid;
  gap: var(--space-10);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: center;
}

.hero__content h1 {
  font-size: var(--heading-1);
  margin: var(--space-4) 0 var(--space-3);
}

.hero__content .lede {
  font-size: 1.05rem;
  max-width: 640px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-pill);
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color-dark);
  font-weight: 600;
  font-size: 0.9rem;
}

.lede {
  color: var(--text-secondary);
}

.hero__actions {
  display: flex;
  gap: 0.75rem;
  margin: var(--space-5) 0 var(--space-4);
  flex-wrap: wrap;
}

.hero__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--border-radius-lg);
  background: var(--background-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.hero__meta strong {
  font-size: 1.2rem;
}

.hero__visual {
  display: grid;
  gap: var(--space-4);
}

.grid.two-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--grid-gap);
}

.list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.hero-card {
  background: var(--background-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  backdrop-filter: blur(10px);
}

.hero-card__title {
  font-weight: 700;
  margin-bottom: var(--space-4);
}

.hero-card__track {
  display: flex;
  gap: 10px;
  margin-bottom: var(--space-5);
}

.hero-card__track .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border-color);
}

.hero-card__track .dot.active {
  background: var(--primary-color);
}

.hero-card__rows {
  display: grid;
  gap: var(--space-3);
}

.hero-card .row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  font-size: 0.95rem;
}

.hero-card .row strong {
  color: var(--text-primary);
}

.hero-note {
  padding: var(--space-4);
  border-radius: var(--border-radius-lg);
  background: rgba(var(--primary-color-rgb), 0.08);
  color: var(--text-primary);
  border: 1px dashed var(--primary-color-light);
}

.section {
  padding: var(--space-12) 0;
}

.section--muted {
  background: var(--background-tertiary);
}

.section__head {
  text-align: center;
  margin-bottom: var(--space-8);
}

.section__head h2 {
  font-size: var(--heading-2);
  margin-bottom: var(--space-2);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

.step-card {
  background: var(--background-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--space-5);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.step-card__badge {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-pill);
  display: grid;
  place-items: center;
  background: rgba(var(--primary-color-rgb), 0.12);
  color: var(--primary-color-dark);
  font-weight: 700;
  margin-bottom: var(--space-3);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

.feature-card {
  background: var(--background-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}

.feature-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  display: grid;
  place-items: center;
  background: rgba(var(--primary-color-rgb), 0.12);
  margin-bottom: var(--space-3);
}

.cta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--border-radius-xl);
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.14), rgba(14, 165, 233, 0.06));
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  flex-wrap: wrap;
}

.cta-bar h3 {
  margin-bottom: 0.35rem;
}

@media (max-width: 768px) {
  .hero {
    padding: var(--space-12) 0 var(--space-10);
  }
}
</style>
