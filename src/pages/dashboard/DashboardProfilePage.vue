<template>
  <div class="stack">
    <div class="profile-head">
      <div>
        <h1>Профиль</h1>
        <p class="muted">Управление личными данными и контактами</p>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Код клиента</div>
      <div class="client-code-block">
        <div class="code">{{ clientCode }}</div>
      </div>
      <div class="card-title">Личные данные</div>
      <div class="grid two-cols">
        <div class="field">
          <label>Имя</label>
          <input type="text" v-model="form.name" placeholder="Ваше имя" />
        </div>
        <div class="field">
          <label>Email</label>
          <input type="email" v-model="form.email" placeholder="email@example.com" />
        </div>
      </div>
      <div class="contacts-row">
        <div class="field">
          <label>Телефон</label>
          <input type="tel" v-model="form.phone" placeholder="+7 (___) ___-__-__" />
        </div>
        <div class="field">
          <label>Telegram</label>
          <input type="text" v-model="form.telegram" placeholder="@nickname" />
        </div>
        <div class="field">
          <label>WhatsApp</label>
          <input type="text" v-model="form.whatsapp" placeholder="+7 (___) ___-__-__" />
        </div>
      </div>
      <div class="actions">
        <button class="pill-btn primary pill-strong no-shadow rounder" @click="save">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const clientCode = 'SOLDY-4821'

const form = reactive({
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  phone: '+7 (900) 000-00-00',
  telegram: '@ivan',
  whatsapp: '+7 (900) 000-00-00'
})

const save = () => {
  alert('Сохранение профиля добавим позже')
}
</script>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-4);
  width: 100%;
  align-self: stretch;
}

.profile-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.client-code {
  padding: var(--space-3);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--background-secondary);
  text-align: right;
}

.client-code .label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.client-code .code {
  font-weight: 700;
  font-size: 1.05rem;
}

.client-code-inline {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-secondary);
  margin-bottom: var(--space-3);
  width: fit-content;
}

.client-code-block {
  display: grid;
  gap: 0.35rem;
  padding: var(--space-3);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--background-secondary);
  text-align: center;
  width: 100%;
  margin-bottom: var(--space-3);
}

.client-code-block .code {
  font-weight: 700;
  font-size: 1.1rem;
}

.card-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.grid.two-cols {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.contacts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-3);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field input {
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-primary);
  color: var(--text-primary);
}

.actions {
  margin-top: var(--space-3);
  display: flex;
  justify-content: flex-end;
}

.actions .pill-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  box-shadow: 0 10px 25px -8px rgba(14, 165, 233, 0.35);
  padding: 0.7rem 1.6rem;
  border-radius: var(--radius-pill);
  letter-spacing: 0.01em;
}

.muted {
  color: var(--text-secondary);
}
</style>
