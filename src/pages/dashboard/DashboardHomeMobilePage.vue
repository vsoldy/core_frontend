<template>
  <div class="stack">
    <div class="top-bar">
      <RouterLink class="profile-chip" to="/dashboard/profile">
        <div class="profile-icon" aria-hidden="true">
          <svg class="icon" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2" />
            <path
              d="M4 20c2.5-4 13.5-4 16 0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="profile-main">
          <h2>{{ userName }}</h2>
          <span class="settings-link">Данные и настройки</span>
        </div>
      </RouterLink>
      <RouterLink class="icon-btn" to="/dashboard/notifications" aria-label="Уведомления">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3V9Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M9.5 18a2.5 2.5 0 0 0 5 0"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </RouterLink>
    </div>

    <RouterLink class="verification-card" to="/dashboard/verification">
      Верификация
      <span class="verification-hint">Подтвердите данные профиля</span>
    </RouterLink>

    <RouterLink class="balance-card" to="/dashboard/balance">
      Финансы
      <span class="balance-value">0 ₽</span>
    </RouterLink>

    <div class="sections-card">
      <RouterLink class="section-card" to="/dashboard/orders">Заказы</RouterLink>
      <RouterLink class="section-card" to="/dashboard/addresses">Адреса доставки</RouterLink>
      <RouterLink class="section-card" to="/dashboard/favorites">Избранное</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/shared/composables/useAuth'

const { user } = useAuth()
const userName = computed(() => user.value?.name || 'Гость')
</script>

<style scoped>
.stack { display: grid; gap: var(--space-4); width: 100%; align-self: stretch; align-content: start; justify-items: start; }
.top-bar { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); }
.profile-chip { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; color: inherit; }
.profile-icon { width: 36px; height: 36px; border-radius: 999px; border: 1px solid var(--border-color); display: grid; place-items: center; color: var(--text-primary); flex: 0 0 auto; }
.profile-main { display: grid; gap: 0.25rem; }
.profile-chip h2 { margin: 0; font-size: 1.05rem; }
.settings-link { color: var(--primary-color-dark); font-weight: 600; text-decoration: none; font-size: 0.85rem; }
.icon-btn { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 999px; border: 1px solid var(--border-color); background: transparent; color: var(--text-primary); }
.icon { width: 20px; height: 20px; }
.verification-card { width: 100%; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 0.75rem 0.9rem; background: transparent; color: var(--text-primary); text-decoration: none; font-weight: 600; display: grid; gap: 0.25rem; }
.verification-hint { color: var(--text-secondary); font-size: 0.8rem; font-weight: 500; }
.balance-card { width: 100%; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 0.75rem 0.9rem; background: transparent; color: var(--text-primary); text-decoration: none; font-weight: 600; display: flex; align-items: center; justify-content: space-between; }
.balance-value { font-weight: 700; }
.sections-card { width: 100%; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 0.25rem 0.9rem; display: grid; gap: 0; background: transparent; }
.section-card { border-bottom: 1px solid var(--border-color); padding: 0.65rem 0; background: transparent; color: var(--text-primary); text-decoration: none; font-weight: 500; }
.section-card:last-child { border-bottom: none; }

@media (max-width: 640px) {
  .top-bar { padding: 0.5rem 0; }
}
</style>
