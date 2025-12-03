import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Инициализация хранилищ
import { useAuthStore } from './stores/auth'
import { useUiStore } from './stores/ui'

// Стили
import './assets/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Инициализация состояний при запуске
const uiStore = useUiStore()
const authStore = useAuthStore()

// Проверяем авторизацию при загрузке
authStore.checkAuth()

app.mount('#app')