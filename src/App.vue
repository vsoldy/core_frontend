<template>
  <div class="app-wrapper" :class="{ 'dark-theme': isDarkTheme }">
    <AppHeader />

<main class="app-main" :class="{ 'app-main--offset': !isCatalogRoute }">
  <div class="container">
    <router-view />
  </div>
</main>

    <AppFooter />
    <NotificationCenter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import NotificationCenter from '@/widgets/NotificationCenter.vue'
import { useUiStore } from './stores'

const uiStore = useUiStore()
const { isDarkTheme } = storeToRefs(uiStore)
const route = useRoute()
const isCatalogRoute = computed(() => (route.name as string) === 'catalog')
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 0 0 2rem;
}

.app-main--offset {
  padding-top: calc(var(--header-offset) + 0.75rem);
}
</style>
