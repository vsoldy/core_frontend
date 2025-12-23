<template>
  <div class="support-page">
    <header class="page-head">
      <div>
        <p class="eyebrow">Поддержка</p>
        <h1>Создать обращение</h1>
        <p class="muted">Опишите вопрос — мы ответим в чате и по email.</p>
      </div>
      <router-link to="/dashboard/orders" class="pill-btn ghost">К заказам</router-link>
    </header>

    <div class="card form-card">
      <div class="form-grid">
        <label>
          Тема
          <input v-model="form.subject" type="text" placeholder="Например, оплата не прошла" />
        </label>

        <label>
          Категория
          <select v-model="form.category">
            <option value="payment">Платежи</option>
            <option value="order">Заказ</option>
            <option value="delivery">Доставка</option>
            <option value="account">Аккаунт</option>
            <option value="other">Другое</option>
          </select>
        </label>

        <label>
          Номер заказа (если есть)
          <input v-model="form.orderId" type="text" placeholder="SO-1042" />
        </label>

        <label class="full">
          Описание
          <textarea v-model="form.message" rows="5" placeholder="Подробно опишите проблему"></textarea>
        </label>
      </div>

      <div class="form-actions">
        <button class="pill-btn ghost" type="button" @click="resetForm">Очистить</button>
        <button class="pill-btn accent" type="button" @click="submitForm">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const form = reactive({
  subject: '',
  category: 'order',
  orderId: '',
  message: ''
})

const resetForm = () => {
  form.subject = ''
  form.category = 'order'
  form.orderId = ''
  form.message = ''
}

const submitForm = () => {
  if (!form.subject.trim() || !form.message.trim()) {
    uiStore.addNotification({
      type: 'error',
      title: 'Заполните поля',
      message: 'Тема и описание обязательны.',
      duration: 3000
    })
    return
  }
  uiStore.addNotification({
    type: 'success',
    title: 'Обращение отправлено',
    message: 'Поддержка ответит в ближайшее время.',
    duration: 3000
  })
  resetForm()
}
</script>

<style scoped>
.support-page {
  padding: calc(var(--header-offset) + 1rem) 0 2rem;
  display: grid;
  gap: var(--space-4);
}

.page-head {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  align-items: center;
}

.eyebrow {
  margin: 0;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.muted {
  color: var(--text-secondary);
}

.form-card {
  padding: var(--space-5);
}

.form-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.form-grid label {
  display: grid;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-secondary);
  padding: 0.6rem 0.75rem;
  color: var(--text-primary);
}

.form-grid textarea {
  resize: vertical;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.pill-btn.accent {
  background: var(--accent-green);
  color: white;
  border-color: transparent;
}
</style>
