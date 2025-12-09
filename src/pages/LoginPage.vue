<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">Вход в SOLDY</h1>
        
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Пароль</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-input"
              placeholder="Введите пароль"
              required
            />
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.rememberMe" />
              <span>Запомнить меня</span>
            </label>
            <a href="#" class="forgot-link">Забыли пароль?</a>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
          
          <div class="divider">
            <span>или</span>
          </div>
          
          <button type="button" class="google-btn" @click="loginWithGoogle">
            <span class="google-icon">G</span>
            Войти через Google
          </button>
          
          <div class="register-link">
            Нет аккаунта?
            <router-link to="/register">Зарегистрироваться</router-link>
          </div>
        </form>
      </div>
      
      <div class="login-info">
        <h3>Что такое SOLDY?</h3>
        <ul>
          <li>🛍️ Выкуп товаров из других стран</li>
          <li>👤 Пользователи создают заказы на выкуп</li>
          <li>🛒 Выкупщики помогают с покупками</li>
          <li>🔒 Безопасные транзакции</li>
          <li>⭐ Система рейтингов и отзывов</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const isLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const handleSubmit = async () => {
  if (!form.email || !form.password) {
    uiStore.addNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Заполните все поля',
      duration: 3000
    })
    return
  }

  isLoading.value = true
  
  try {
    const result = await authStore.login(form.email, form.password)
    
    if (result.success) {
      uiStore.addNotification({
        type: 'success',
        title: 'Успешный вход',
        message: 'Добро пожаловать!',
        duration: 2000
      })
      
      // Получаем redirect параметр из URL
      const redirect = router.currentRoute.value.query.redirect as string
      
      // Перенаправляем на запрошенную страницу или на главную
      if (redirect) {
        router.push(redirect)
      } else {
        router.push('/')
      }
    } else {
      uiStore.addNotification({
        type: 'error',
        title: 'Ошибка входа',
        message: result.error || 'Неверный email или пароль',
        duration: 3000
      })
    }
  } catch (error: unknown) {
    console.error('Login error:', error)
    uiStore.addNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Произошла ошибка при входе',
      duration: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const loginWithGoogle = () => {
  uiStore.addNotification({
    type: 'info',
    title: 'Google вход',
    message: 'Функция входа через Google будет реализована позже',
    duration: 3000
  })
}
</script>

<style scoped>
.login-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1000px;
  width: 100%;
}

.login-card {
  background: var(--background-secondary);
  padding: 3rem;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
}

.login-title {
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-primary);
  font-size: 1.875rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: var(--text-primary);
  font-weight: 500;
}

.form-input {
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--background-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
}

.submit-btn {
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-color-dark);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-secondary);
  margin: 1rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 1rem;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  color: #333;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.google-btn:hover {
  background: #f8fafc;
}

.google-icon {
  width: 24px;
  height: 24px;
  background: #4285f4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.register-link {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 1.5rem;
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
}

.login-info {
  padding: 1rem;
}

.login-info h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.login-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.login-info li {
  padding: 0.75rem 0;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.login-info li:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .login-card {
    padding: 2rem;
  }
}
</style>
