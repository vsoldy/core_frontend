<template>
  <div class="request-create">
    <header class="page-header">
      <div>
        <p class="eyebrow">Новый запрос</p>
        <h1>Создать объявление на выкуп</h1>
        <p class="subtitle">Опишите, что нужно купить, бюджет и сроки. Выкупщики отправят отклики.</p>
      </div>
      <router-link to="/catalog" class="link">← Вернуться в каталог</router-link>
    </header>

    <form class="card form" @submit.prevent="submitRequest">
      <label>
        Заголовок
        <input v-model="form.title" type="text" placeholder="Например, Выкуп ноутбука" required />
      </label>

      <label>
        Описание
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Что купить, требования к проверке, желаемая доставка"
          required
        ></textarea>
      </label>

      <div class="grid">
        <label>
          Бюджет, ₽
          <input v-model.number="form.budget" type="number" min="0" required />
        </label>
        <label>
          Категория
          <select v-model="form.category">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </label>
      </div>

      <label>
        Адрес (необязательно)
        <input v-model="form.address" type="text" placeholder="Город, улица, дом" />
      </label>

      <div class="actions">
        <router-link to="/catalog" class="btn ghost">Отмена</router-link>
        <button class="btn primary" type="submit">Создать запрос</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRequestsStore } from '@/stores/requests'
import { useUiStore } from '@/stores/ui'
import type { Request } from '@/entities/request/types'

const router = useRouter()
const requestsStore = useRequestsStore()
const uiStore = useUiStore()

const categories = ['electronics', 'clothing', 'books', 'other']

const form = ref({
  title: '',
  description: '',
  budget: 3000,
  category: 'other',
  address: ''
})

const submitRequest = () => {
  if (!form.value.title.trim() || !form.value.description.trim()) {
    uiStore.addNotification({
      type: 'error',
      title: 'Заполните поля',
      message: 'Заголовок и описание обязательны'
    })
    return
  }

  const newRequest = requestsStore.createRequest({
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    budget: form.value.budget,
    category: form.value.category,
    address: form.value.address || 'Не указан',
    userId: 'user-1'
  } as Omit<Request, 'id' | 'createdAt' | 'updatedAt'>)

  uiStore.addNotification({
    type: 'success',
    title: 'Запрос создан',
    message: 'Теперь выкупщики смогут откликнуться'
  })

  router.push({ name: 'request', params: { id: newRequest.id } })
}
</script>

<style scoped>
.request-create {
  padding: calc(var(--header-offset) + 1rem) 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
}

.card {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.form {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.form input,
.form textarea,
.form select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-primary);
  color: var(--text-primary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid transparent;
  text-decoration: none;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
}

.btn.primary {
  background: var(--primary-color);
  color: white;
}

.btn.ghost {
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}
</style>
