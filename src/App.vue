<template>
  <div class="app-wrapper" :class="{ 'dark-theme': isDarkTheme }">
    <AppHeader />
    <MobileBottomBar />

    <main
      class="app-main"
      :class="{
        'app-main--offset': true,
        'app-main--dashboard': isDashboardRoute
      }"
    >
      <div v-if="isDashboardRoute">
        <router-view />
      </div>
      <div v-else class="container">
        <router-view />
      </div>
    </main>

    <AppFooter v-if="showFooter" />
    <NotificationCenter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileBottomBar from '@/components/layout/MobileBottomBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import NotificationCenter from '@/widgets/NotificationCenter.vue'
import { useUiStore } from './stores'

const uiStore = useUiStore()
const { isDarkTheme } = storeToRefs(uiStore)
const route = useRoute()
const isDashboardRoute = computed(() => {
  const name = (route.name as string) || ''
  return name.startsWith('dashboard') || route.path.startsWith('/dashboard')
})
const showFooter = computed(() => !isDashboardRoute.value)
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 0;
}

.app-main--offset {
  padding-top: 0;
}

.app-main--dashboard {
  padding: 0;
  min-height: 100vh;
}

@media (max-width: 960px) {
  .app-main--dashboard {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 0;
  }
}
</style>
