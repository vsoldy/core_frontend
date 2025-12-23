<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar__head">
        <div class="logo">Личный кабинет</div>
      </div>
      <nav class="sidebar__nav">
        <RouterLink
          v-for="item in nav"
          :key="item.label"
          :to="item.to"
          :class="['nav-link', { active: isActive(item.to as any) }]"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <main class="content">
      <div class="content-body">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuth } from '@/shared/composables/useAuth'

const { isBuyer } = useAuth()

const nav = computed(() => {
  if (isBuyer.value) {
    return [
      { to: { name: 'dashboard-buyer-requests' }, label: 'Запросы на исполнение' },
      { to: { name: 'dashboard-buyer-in-progress' }, label: 'Заказы в работе' },
      { to: { name: 'dashboard-buyer-completed' }, label: 'Завершенные заказы' },
      { to: { name: 'dashboard-balance' }, label: 'Финансы' },
      { to: { name: 'dashboard-buyer-catalog' }, label: 'Создание объявления' },
      { to: '/support/new', label: 'Помощь' }
    ]
  }
  return [
    { to: { name: 'dashboard-orders' }, label: 'История заказов' },
    { to: { name: 'dashboard-balance' }, label: 'Финансы' },
    { to: { name: 'dashboard-favorites' }, label: 'Избранное' },
    { to: { name: 'dashboard-addresses' }, label: 'Адреса доставки' },
    { to: { name: 'dashboard-profile' }, label: 'Настройки' },
    { to: '/support/new', label: 'Помощь' }
  ]
})

const route = useRoute()

const isActive = (itemTo: { name?: string }) => {
  if (!itemTo?.name) return false
  return route.name === itemTo.name
}

</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  border-right: 1px solid var(--border-color);
  background: var(--background-secondary);
  padding: var(--space-6) var(--space-5);
  min-height: 100vh;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar__head h3 {
  margin-bottom: 0.25rem;
}

.muted {
  color: var(--text-secondary);
}

.logo {
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--text-primary);
  text-decoration: none;
  letter-spacing: 0.04em;
}

.sidebar__nav {
  display: grid;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.nav-link {
  padding: 0.65rem 0.85rem;
  border-radius: var(--border-radius-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.nav-link.active {
  background: rgba(var(--primary-color-rgb), 0.12);
  color: var(--primary-color-dark);
}

.content {
  padding: 0 var(--space-3) var(--space-6);
  background: var(--background-primary);
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.content-body {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding-top: 0;
  margin-top: 0;
}

.content-body :deep(h1) {
  margin: 0 0 var(--space-2);
}

.content-body :deep(p) {
  margin: 0 0 var(--space-2);
}

.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.pill-btn.primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pill-btn.ghost {
  background: var(--background-secondary);
}

.pill-btn:hover {
  border-color: var(--primary-color);
}

@media (max-width: 960px) {
  .dashboard {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    height: auto;
    min-height: auto;
    display: none;
  }
  .content {
    height: auto;
    overflow: visible;
    padding: 8px var(--space-2) var(--space-3);
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
  .content-body {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    margin-top: 0;
    padding-top: 0;
  }
  .content-body > * {
    margin-top: 0 !important;
  }
  .content-body :deep(h1) {
    margin-top: 0 !important;
  }
  .mobile-top {
    display: none;
  }
}
</style>
