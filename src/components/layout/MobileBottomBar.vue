<template>
  <Teleport to="body">
    <nav ref="barEl" class="mobile-bottom" aria-label="Быстрая навигация">
      <RouterLink to="/" class="mobile-action" aria-label="Домой">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9.5Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
        <span class="sr-only">Домой</span>
      </RouterLink>
      <RouterLink to="/catalog" class="mobile-action" aria-label="Каталог и поиск">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 4h18M3 10h18M3 16h10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="18" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="2" />
          <path
            d="M20.5 18.5l2 2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span class="sr-only">Каталог/Поиск</span>
      </RouterLink>
      <RouterLink to="/services" class="mobile-action" aria-label="Каталог услуг">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2" />
          <rect x="13" y="4" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2" />
          <rect x="4" y="13" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2" />
          <rect x="13" y="13" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
        <span class="sr-only">Каталог услуг</span>
      </RouterLink>
      <RouterLink to="/cart" class="mobile-action" aria-label="Корзина">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 6h15l-2 9H8L6 6Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <circle cx="9" cy="20" r="1.5" fill="currentColor" />
          <circle cx="17" cy="20" r="1.5" fill="currentColor" />
          <path
            d="M3 4h2l1 6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
        <span class="sr-only">Корзина</span>
      </RouterLink>
      <RouterLink :to="cabinetRoute" class="mobile-action" aria-label="Личный кабинет">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2" />
          <path
            d="M4 20c2.5-4 13.5-4 16 0"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span class="sr-only">Личный кабинет</span>
      </RouterLink>
    </nav>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useAuth } from '@/shared/composables/useAuth'

const { totalItems } = storeToRefs(useCartStore())
const { isAuthenticated } = useAuth()

const barEl = ref<HTMLElement | null>(null)

const cabinetRoute = computed(() => (isAuthenticated.value ? { name: 'dashboard-home' } : { name: 'login' }))

const updateMobileBarHeight = () => {
  const isMobile = window.innerWidth <= 900
  const height = isMobile ? barEl.value?.offsetHeight ?? 0 : 0
  document.documentElement.style.setProperty('--mobile-bar-height', `${height}px`)
}

onMounted(() => {
  updateMobileBarHeight()
  window.addEventListener('resize', updateMobileBarHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMobileBarHeight)
})
</script>

<style scoped>
.mobile-bottom {
  display: none;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.3rem;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.45rem 0.6rem 0.6rem;
  background: color-mix(in srgb, var(--background-primary) 88%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--border-color) 45%, transparent);
  z-index: 1500;
  backdrop-filter: blur(10px);
}

.mobile-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  text-decoration: none;
  min-height: 40px;
  position: relative;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  opacity: 0.9;
}

.mobile-action:active,
.mobile-action:focus-visible {
  background: color-mix(in srgb, var(--primary-color) 12%, transparent);
  border-color: color-mix(in srgb, var(--primary-color) 35%, transparent);
  opacity: 1;
}

.icon {
  width: 20px;
  height: 20px;
}

.cart-badge {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--primary-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 900px) {
  .mobile-bottom {
    display: grid;
  }

  :global(body) {
    padding-bottom: var(--mobile-bar-height, 0px);
  }
}

@media (max-width: 400px) {
  .mobile-bottom {
    gap: 0.2rem;
    padding: 0.4rem 0.5rem 0.55rem;
  }

  .mobile-action {
    min-height: 38px;
  }

  .icon {
    width: 18px;
    height: 18px;
  }
}
</style>
