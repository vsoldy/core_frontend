<template>
  <div class="stack">
    <template v-if="!showForm">
      <div class="addresses-head">
        <div>
          <h1>Адреса доставки</h1>
          <p class="muted">Управление адресами для доставки заказов</p>
        </div>
        <button class="pill-btn accent pill-strong no-shadow rounder" @click="openForm">
          + Добавить адрес
        </button>
      </div>

      <div class="tabs">
        <button :class="['tab', { active: activeTab === 'active' }]" @click="activeTab = 'active'">
          Активные адреса <span class="badge">{{ addresses.length }}</span>
        </button>
        <button :class="['tab', { active: activeTab === 'archive' }]" @click="activeTab = 'archive'">
          Архивные адреса <span class="badge muted">0</span>
        </button>
      </div>

      <div class="addresses-grid" v-if="activeTab === 'active'">
        <div v-for="addr in addresses" :key="addr.id" class="card address-card">
          <div class="card-head">
            <div class="address-name">{{ addr.lastName }} {{ addr.firstName }}</div>
            <div class="card-actions">
              <button
                class="icon-btn"
                :class="{ active: addr.isDefault }"
                aria-label="Избранное"
                @click="setDefault(addr.id)"
              >
                ★
              </button>
              <button class="icon-btn" aria-label="Редактировать">✎</button>
              <button class="icon-btn" aria-label="Удалить">🗑</button>
            </div>
          </div>
          <div class="contact-block">
            <div class="address-line muted">
              {{ addr.street }}, д. {{ addr.house }}
              <span v-if="addr.building">, стр. {{ addr.building }}</span>
              <span v-if="addr.flat">, кв. {{ addr.flat }}</span>
            </div>
            <div class="muted">{{ addr.city }}, {{ addr.region }}, {{ addr.zip }}</div>
            <div class="muted phone">{{ addr.phone }}</div>
          </div>
        </div>
      </div>
      <div v-else class="card empty">
        <p class="muted">Архивных адресов пока нет</p>
      </div>
    </template>

    <template v-else>
      <div class="form-head">
        <button class="pill-btn ghost pill-strong no-shadow rounder" @click="closeForm">← Назад</button>
        <h2 class="form-title">Добавить адрес</h2>
      </div>

      <div class="card">
        <div class="card-title">Основная информация</div>
        <div class="grid two-cols">
          <div class="field">
            <label>Фамилия *</label>
            <input v-model="form.lastName" type="text" placeholder="Фамилия" />
          </div>
          <div class="field">
            <label>Имя *</label>
            <input v-model="form.firstName" type="text" placeholder="Имя" />
          </div>
          <div class="field">
            <label>Отчество</label>
            <input v-model="form.middleName" type="text" placeholder="Отчество" />
          </div>
          <div class="field">
            <label>Никнейм</label>
            <input v-model="form.nickname" type="text" placeholder="@nickname" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Адрес</div>
        <div class="grid two-cols">
          <div class="field">
            <label>Улица</label>
            <input v-model="form.street" list="street-options" type="text" placeholder="Улица" />
            <datalist id="street-options">
              <option v-for="street in filteredStreets" :key="street" :value="street" />
            </datalist>
            <small class="muted">Начните вводить — подскажем полный адрес</small>
          </div>
          <div class="field">
            <label>Дом</label>
            <input v-model="form.house" type="text" placeholder="Дом" />
          </div>
          <div class="field">
            <label>Строение/корпус</label>
            <input v-model="form.building" type="text" placeholder="Строение/корпус" />
          </div>
          <div class="field">
            <label>Квартира/Офис</label>
            <input v-model="form.flat" type="text" placeholder="Квартира/Офис" />
          </div>
          <div class="field">
            <label>Город</label>
            <input v-model="form.city" type="text" placeholder="Город" />
          </div>
          <div class="field">
            <label>Регион</label>
            <input v-model="form.region" type="text" placeholder="Регион" />
          </div>
          <div class="field">
            <label>Почтовый индекс</label>
            <input v-model="form.zip" type="text" placeholder="Индекс" />
          </div>
          <div class="field">
            <label>Телефон</label>
            <input v-model="form.phone" type="tel" placeholder="+7 (___) ___-__-__" />
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="pill-btn ghost pill-strong no-shadow rounder" @click="closeForm">Отмена</button>
        <button class="pill-btn primary pill-strong no-shadow rounder" @click="save">Добавить адрес</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

interface Address {
  id: string
  firstName: string
  lastName: string
  phone: string
  street: string
  house: string
  building?: string
  flat?: string
  city: string
  region: string
  zip: string
  isDefault?: boolean
}

const addresses = ref<Address[]>([
  {
    id: 'a1',
    firstName: 'Иван',
    lastName: 'Иванов',
    phone: '+7 (900) 000-00-00',
    street: 'Тверская',
    house: '10',
    building: '2',
    flat: '15',
    city: 'Москва',
    region: 'Московская обл.',
    zip: '101000',
    isDefault: false
  },
  {
    id: 'a2',
    firstName: 'Мария',
    lastName: 'Смирнова',
    phone: '+7 (921) 111-22-33',
    street: 'Невский проспект',
    house: '55',
    building: '',
    flat: '12',
    city: 'Санкт-Петербург',
    region: 'Ленинградская обл.',
    zip: '190000'
  },
  {
    id: 'a3',
    firstName: 'Дмитрий',
    lastName: 'Петров',
    phone: '+7 (916) 555-44-33',
    street: 'Арбат',
    house: '22',
    building: '',
    flat: '8',
    city: 'Москва',
    region: 'Московская обл.',
    zip: '119002'
  },
  {
    id: 'a4',
    firstName: 'Анна',
    lastName: 'Кузнецова',
    phone: '+7 (938) 222-11-00',
    street: 'Красная',
    house: '5',
    building: '',
    flat: '2',
    city: 'Краснодар',
    region: 'Краснодарский край',
    zip: '350000'
  },
  {
    id: 'a5',
    firstName: 'Сергей',
    lastName: 'Васильев',
    phone: '+7 (902) 777-88-99',
    street: 'Ленина',
    house: '14',
    building: '1',
    flat: '27',
    city: 'Пермь',
    region: 'Пермский край',
    zip: '614000'
  },
  {
    id: 'a6',
    firstName: 'Марина',
    lastName: 'Фролова',
    phone: '+7 (913) 333-22-11',
    street: 'Советская',
    house: '9',
    building: '',
    flat: '5',
    city: 'Новосибирск',
    region: 'Новосибирская обл.',
    zip: '630001'
  },
  {
    id: 'a7',
    firstName: 'Алексей',
    lastName: 'Егоров',
    phone: '+7 (921) 765-43-21',
    street: 'Пушкинская',
    house: '18',
    building: '',
    flat: '34',
    city: 'Ярославль',
    region: 'Ярославская обл.',
    zip: '150000'
  },
  {
    id: 'a8',
    firstName: 'Ольга',
    lastName: 'Соколова',
    phone: '+7 (999) 111-22-33',
    street: 'Мира',
    house: '3',
    building: '',
    flat: '19',
    city: 'Казань',
    region: 'Республика Татарстан',
    zip: '420066'
  },
  {
    id: 'a9',
    firstName: 'Николай',
    lastName: 'Романов',
    phone: '+7 (903) 654-32-10',
    street: 'Садовая',
    house: '45',
    building: '2',
    flat: '7',
    city: 'Самара',
    region: 'Самарская обл.',
    zip: '443000'
  },
  {
    id: 'a10',
    firstName: 'Елена',
    lastName: 'Громова',
    phone: '+7 (905) 123-45-67',
    street: 'Чехова',
    house: '6',
    building: '',
    flat: '11',
    city: 'Ростов-на-Дону',
    region: 'Ростовская обл.',
    zip: '344000'
  },
  {
    id: 'a11',
    firstName: 'Павел',
    lastName: 'Жуков',
    phone: '+7 (960) 888-77-66',
    street: 'Горького',
    house: '12',
    building: '',
    flat: '23',
    city: 'Владивосток',
    region: 'Приморский край',
    zip: '690001'
  }
])

const showForm = ref(false)
const activeTab = ref<'active' | 'archive'>('active')
const form = reactive({
  firstName: '',
  lastName: '',
  middleName: '',
  nickname: '',
  phone: '',
  street: '',
  house: '',
  building: '',
  flat: '',
  city: '',
  region: '',
  zip: ''
})
const streetSuggestions = [
  'Россия, Москва, ул. Тверская, д. 10',
  'Россия, Санкт-Петербург, Невский проспект, д. 55',
  'Россия, Казань, ул. Баумана, д. 6',
  'Россия, Екатеринбург, ул. Ленина, д. 24',
  'Россия, Новосибирск, Красный проспект, д. 12',
  'Россия, Краснодар, ул. Советская, д. 18'
]
const filteredStreets = computed(() => {
  const q = form.street.toLowerCase().trim()
  if (!q || q.length < 2) return streetSuggestions.slice(0, 5)
  return streetSuggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 5)
})

const openForm = () => { showForm.value = true }
const closeForm = () => {
  showForm.value = false
}

const save = () => {
  if (!form.firstName.trim() || !form.lastName.trim()) {
    alert('Имя и фамилия обязательны')
    return
  }
  addresses.value.unshift({
    id: `addr-${Date.now()}`,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phone: form.phone.trim(),
    street: form.street.trim(),
    house: form.house.trim(),
    building: form.building.trim(),
    flat: form.flat.trim(),
    city: form.city.trim(),
    region: form.region.trim(),
    zip: form.zip.trim(),
    isDefault: false
  })
  Object.assign(form, {
    firstName: '',
    lastName: '',
    middleName: '',
    nickname: '',
    phone: '',
    street: '',
    house: '',
    building: '',
    flat: '',
    city: '',
    region: '',
    zip: ''
  })
  showForm.value = false
}

const setDefault = (id: string) => {
  addresses.value = addresses.value.map((addr) => {
    if (addr.id === id) {
      return { ...addr, isDefault: !addr.isDefault }
    }
    return { ...addr, isDefault: false }
  })
}
</script>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-4);
  width: 100%;
  align-self: stretch;
}

.addresses-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  width: 100%;
}

.tabs {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.tab {
  padding: 0.45rem 0.8rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
}

.tab.active {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color-dark);
}

.badge {
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--background-tertiary);
  font-size: 0.85rem;
}

.pill-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.pill-btn.accent {
  background: var(--accent-green);
  color: white;
  border: none;
}

.pill-btn.primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.pill-btn.ghost {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
}

.pill-strong {
  padding: 0.65rem 1.3rem;
  font-weight: 700;
}

.no-shadow {
  box-shadow: none;
}

.rounder {
  border-radius: var(--radius-pill);
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-3);
  width: 100%;
}

.address-card {
  display: grid;
  gap: 0.2rem;
  min-height: auto;
  padding: var(--space-3);
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
}

.address-name {
  font-weight: 700;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.address-card .muted {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.address-card .muted.phone {
  color: var(--text-secondary);
  font-weight: 600;
}

.address-line {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  align-items: center;
}

.card-actions {
  display: inline-flex;
  gap: 0.35rem;
}

.icon-btn {
  border: 1px solid var(--border-color);
  background: var(--background-tertiary);
  border-radius: var(--border-radius-md);
  padding: 0.25rem 0.4rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.icon-btn.active {
  border-color: var(--accent-green);
  background: rgba(16, 185, 129, 0.12);
  color: var(--accent-green);
}

.icon-btn {
  min-width: 32px;
  justify-content: center;
}

.contact-block {
  margin-top: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--border-radius-md);
  background: var(--background-tertiary);
  display: grid;
  gap: 0.2rem;
}

@media (max-width: 960px) {
  .addresses-grid {
    grid-template-columns: 1fr;
  }
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
  gap: var(--space-2);
}

.muted {
  color: var(--text-secondary);
}

.form-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  position: relative;
  width: 100%;
}

.form-head .pill-btn {
  position: absolute;
  left: 0;
}

.form-title {
  margin: 0;
}
</style>
