<template>
  <div class="stack">
    <template v-if="!showTopUp">
      <div class="balance-header">
        <div>
          <h1>Финансы</h1>
          <p class="muted">Предоплата за услуги и история операций</p>
        </div>
      </div>

    <div class="card balance-card">
      <div class="balance-top">
        <div class="balance-left">
          <div class="label">Ваш баланс</div>
          <div class="balance-amount">{{ balance.toLocaleString('ru-RU') }} ₽</div>
        </div>
        <button class="pill-btn accent pill-strong no-shadow tight-radius balance-btn" @click="openTopUp">+ Пополнить</button>
      </div>
    </div>

    <div class="cards-grid two-cols">
      <div class="card split-card">
        <div class="label">Пополнения</div>
        <div class="value positive big">+{{ income.toLocaleString('ru-RU') }} ₽</div>
      </div>
      <div class="card split-card">
        <div class="label">Списания</div>
        <div class="value negative big">-{{ outcome.toLocaleString('ru-RU') }} ₽</div>
      </div>
    </div>

      <div class="card">
        <div class="card-title">История транзакций</div>
        <div class="transactions">
          <div v-for="tx in transactions" :key="tx.id" class="tx-row">
            <div>
              <div class="tx-title">{{ tx.title }}</div>
              <div class="muted">{{ tx.date }}</div>
            </div>
            <div :class="['tx-amount', tx.type === 'in' ? 'positive' : 'negative']">
              {{ tx.type === 'in' ? '+' : '-' }}{{ tx.amount.toLocaleString('ru-RU') }} ₽
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="topup-header">
        <button class="pill-btn ghost pill-strong no-shadow rounder" @click="closeTopUp">← Назад</button>
        <h2 class="topup-title">Пополнение</h2>
      </div>

      <div class="card">
        <div class="card-title">Актуальные курсы</div>
        <div class="rates">
          <div class="rate" v-for="rate in rates" :key="rate.pair">
            <div class="label">{{ rate.pair }}</div>
            <div class="value">{{ rate.value }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Способ оплаты</div>
        <div class="methods">
          <label v-for="method in paymentMethods" :key="method.value" :class="['method', { active: selectedMethod === method.value }]">
            <input type="radio" :value="method.value" v-model="selectedMethod" />
            <div>
              <div class="method-title">{{ method.label }}</div>
              <div class="muted">{{ method.desc }}</div>
            </div>
          </label>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type TxType = 'in' | 'out'
interface Tx {
  id: string
  title: string
  date: string
  amount: number
  type: TxType
}

const balance = ref(12500)
const income = ref(34000)
const outcome = ref(21500)

const transactions = ref<Tx[]>([
  { id: 't1', title: 'Пополнение карты', date: '12 янв, 14:20', amount: 5000, type: 'in' },
  { id: 't2', title: 'Оплата заказа #1023', date: '11 янв, 19:05', amount: 14800, type: 'out' },
  { id: 't3', title: 'Возврат средств', date: '10 янв, 11:10', amount: 3200, type: 'in' },
  { id: 't4', title: 'Оплата доставки #1018', date: '9 янв, 09:40', amount: 2900, type: 'out' }
])

const rates = ref([
  { pair: 'EUR → USDT', value: '1.07' },
  { pair: 'EUR → RUB', value: '98.3' }
])

const paymentMethods = [
  { value: 'card', label: 'Банковская карта', desc: 'VISA / MasterCard / МИР' },
  { value: 'crypto', label: 'Криптовалюта', desc: 'USDT, BTC, ETH' },
  { value: 'sbp', label: 'Рубли по СБП', desc: 'Моментальное зачисление' }
]

const selectedMethod = ref(paymentMethods[0]?.value || 'card')
const showTopUp = ref(false)

const openTopUp = () => { showTopUp.value = true }
const closeTopUp = () => { showTopUp.value = false }
</script>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-4);
  width: 100%;
  align-self: stretch;
}

.balance-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

.cards-grid.two-cols {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.balance-card .balance-amount {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  text-align: left;
}

.balance-top {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-3);
  align-items: center;
  width: 100%;
  padding: var(--space-1) var(--space-2);
}

.balance-left {
  display: grid;
  gap: 0.2rem;
}

.label {
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.value {
  font-weight: 700;
  font-size: 1.1rem;
}

.value.big {
  font-size: 1.4rem;
}

.positive { color: #0f766e; }
.negative { color: #b91c1c; }

.pill-btn.accent {
  background: var(--accent-green);
  color: white;
  border-color: transparent;
}

.pill-strong {
  padding: 0.65rem 1.25rem;
  font-weight: 700;
  border-radius: var(--border-radius-md);
}

.no-shadow {
  box-shadow: none;
  border: none;
}

.tight-radius {
  border-radius: var(--border-radius-sm);
  border-color: transparent;
}

.rounder {
  border-radius: var(--radius-pill);
  border: none;
}

.balance-btn {
  justify-self: end;
}

.transactions {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.tx-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tx-title {
  font-weight: 600;
}

.tx-amount {
  font-weight: 700;
}

.card-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.muted {
  color: var(--text-secondary);
}

.topup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  position: relative;
}

.topup-title {
  margin: 0;
}

.topup-header .pill-btn {
  position: absolute;
  left: 0;
}

.rates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.rate {
  padding: var(--space-3);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  min-width: 0;
}

.methods {
  display: grid;
  gap: var(--space-3);
}

.method {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  align-items: flex-start;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.method input {
  margin-top: 0.3rem;
}

.method-title {
  font-weight: 700;
}

.method.active {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}
</style>
