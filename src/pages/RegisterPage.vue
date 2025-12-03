<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <h1 class="register-title">Регистрация в SOLDY</h1>
        
        <form @submit.prevent="handleSubmit" class="register-form">
          <!-- Личные данные -->
          <div class="form-section">
            <h3 class="section-title">Личные данные</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label required">Имя</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  placeholder="Иван Иванов"
                  required
                />
                <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
              </div>
              
              <div class="form-group">
                <label for="phone" class="form-label">Телефон</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  placeholder="+7 (999) 999-99-99"
                />
                <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
              </div>
            </div>
          </div>
          
          <!-- Данные для входа -->
          <div class="form-section">
            <h3 class="section-title">Данные для входа</h3>
            
            <div class="form-group">
              <label for="email" class="form-label required">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="your@email.com"
                required
              />
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="password" class="form-label required">Пароль</label>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Минимум 8 символов"
                  required
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
                <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
              </div>
              
              <div class="form-group">
                <label for="confirmPassword" class="form-label required">Подтверждение пароля</label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Повторите пароль"
                  required
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
                <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
              </div>
            </div>
          </div>
          
          <!-- Тип аккаунта -->
          <div class="form-section">
            <h3 class="section-title">Тип аккаунта</h3>
            
            <div class="role-selection">
              <label 
                v-for="role in availableRoles" 
                :key="role.value"
                :class="['role-option', { 'role-selected': form.role === role.value }]"
              >
                <input
                  type="radio"
                  v-model="form.role"
                  :value="role.value"
                  name="role"
                  class="role-input"
                />
                <div class="role-content">
                  <div class="role-icon">{{ role.icon }}</div>
                  <div class="role-info">
                    <div class="role-title">{{ role.title }}</div>
                    <div class="role-description">{{ role.description }}</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Соглашения -->
          <div class="form-section">
            <div class="agreement-group">
              <label class="checkbox-label required">
                <input 
                  type="checkbox" 
                  v-model="form.agreeTerms" 
                  required
                />
                <span>Я принимаю <a href="#" @click.prevent="showTerms">Условия использования</a> сервиса</span>
              </label>
              <div v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</div>
            </div>
            
            <div class="agreement-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.subscribeNews" />
                <span>Я хочу получать уведомления о новых услугах и акциях</span>
              </label>
            </div>
          </div>
          
          <!-- Кнопки -->
          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn" 
              :disabled="isLoading || !form.agreeTerms"
            >
              {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
            
            <div class="divider">
              <span>или</span>
            </div>
            
            <button 
              type="button" 
              class="google-btn" 
              @click="registerWithGoogle"
              :disabled="isLoading"
            >
              <span class="google-icon">G</span>
              Зарегистрироваться через Google
            </button>
            
            <div class="login-link">
              Уже есть аккаунт?
              <router-link :to="{ name: 'login', query: { redirect: $route.query.redirect } }">
                Войти
              </router-link>
            </div>
          </div>
        </form>
      </div>
      
      <div class="register-info">
        <h3>Почему стоит зарегистрироваться?</h3>
        <ul>
          <li>📦 <strong>Для покупателей:</strong> создавайте заказы на выкуп товаров из других стран</li>
          <li>🛍️ <strong>Для выкупщиков:</strong> находите заказы и зарабатывайте на услугах выкупа</li>
          <li>⭐ <strong>Система рейтингов:</strong> получайте оценки за выполненные услуги</li>
          <li>🔒 <strong>Безопасность:</strong> защищенные транзакции и гарантии</li>
          <li>📱 <strong>Удобство:</strong> отслеживайте статусы заказов в реальном времени</li>
          <li>👥 <strong>Поддержка:</strong> помощь менеджеров 24/7</li>
        </ul>
        
        <div class="info-note">
          <p><strong>Важно:</strong> Пользователь (user) может стать выкупщиком (buyer) после обращения в поддержку.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import type { UserRole } from '@/entities/user/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Доступные роли для регистрации
const availableRoles = computed(() => [
  {
    value: 'user' as UserRole,
    title: 'Покупатель',
    description: 'Создавайте заказы на выкуп товаров',
    icon: '🛒'
  },
  {
    value: 'buyer' as UserRole,
    title: 'Выкупщик',
    description: 'Выполняйте заказы по выкупу товаров',
    icon: '🛍️'
  }
])

// Форма
const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user' as UserRole,
  agreeTerms: false,
  subscribeNews: true
})

// Ошибки валидации
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

// Валидация формы
const validateForm = () => {
  let isValid = true
  
  // Очищаем ошибки
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // Имя
  if (!form.name.trim()) {
    errors.name = 'Введите имя'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа'
    isValid = false
  }
  
  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Введите email'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Введите корректный email'
    isValid = false
  }
  
  // Телефон (необязательный, но если введен - проверяем)
  if (form.phone && !/^\+?[\d\s\-\(\)]+$/.test(form.phone)) {
    errors.phone = 'Введите корректный номер телефона'
    isValid = false
  }
  
  // Пароль
  if (!form.password) {
    errors.password = 'Введите пароль'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Пароль должен содержать минимум 8 символов'
    isValid = false
  }
  
  // Подтверждение пароля
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Подтвердите пароль'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
    isValid = false
  }
  
  // Соглашение
  if (!form.agreeTerms) {
    errors.agreeTerms = 'Необходимо принять условия использования'
    isValid = false
  }
  
  return isValid
}

const validateEmail = async (email: string) => {
  // TODO: Заменить на реальную проверку через API
  const takenEmails = ['admin@example.com', 'test@example.com']
  return !takenEmails.includes(email)
}

// Обработка отправки формы
const handleSubmit = async () => {
  if (!validateForm()) {
    uiStore.addNotification({
      type: 'error',
      title: 'Ошибка валидации',
      message: 'Проверьте правильность заполнения полей',
      duration: 3000
    })
    return
  }

  isLoading.value = true

  const isEmailAvailable = await validateEmail(form.email)
  if (!isEmailAvailable) {
    errors.email = 'Этот email уже используется'
    uiStore.addNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Этот email уже зарегистрирован',
      duration: 3000
    })
    isLoading.value = false
    return
  }
  
  try {
    const registerData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim() || undefined,
      role: form.role
    }
    
    const result = await authStore.register(registerData)
    
    if (result.success) {
      uiStore.addNotification({
        type: 'success',
        title: 'Регистрация успешна!',
        message: `Добро пожаловать в SOLDY, ${form.name}! На ваш email отправлено письмо с подтверждением.`,
        duration: 5000
      })
      
      // Перенаправляем на запрошенную страницу или на главную
      const redirect = route.query.redirect as string
      if (redirect) {
        router.push(redirect)
      } else {
        router.push('/')
      }
      
    } else {
      uiStore.addNotification({
        type: 'error',
        title: 'Ошибка регистрации',
        message: result.error || 'Произошла ошибка при регистрации',
        duration: 3000
      })
    }
    
  } catch (error) {
    uiStore.addNotification({
      type: 'error',
      title: 'Ошибка регистрации',
      message: 'Произошла ошибка при регистрации. Попробуйте еще раз.',
      duration: 3000
    })
  } finally {
    isLoading.value = false
  }
}

// Показать условия использования
const showTerms = () => {
  uiStore.addNotification({
    type: 'info',
    title: 'Условия использования',
    message: 'Страница с условиями использования будет доступна позже',
    duration: 3000
  })
}
</script>

<style scoped>
.register-page {
  min-height: 70vh;
  padding: 2rem 0;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.register-card {
  background: var(--background-secondary);
  padding: 3rem;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
}

.register-title {
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-primary);
  font-size: 1.875rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.form-label.required::after {
  content: ' *';
  color: var(--accent-red);
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

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 2.125rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  color: var(--text-secondary);
  padding: 0.25rem;
}

.error-message {
  color: var(--accent-red);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Выбор роли */
.role-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.role-option {
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 1.25rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--background-primary);
}

.role-option:hover {
  border-color: var(--primary-color-light);
  transform: translateY(-2px);
}

.role-selected {
  border-color: var(--primary-color);
  background: var(--primary-color-light);
  opacity: 0.1;
}

.role-input {
  display: none;
}

.role-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.role-icon {
  font-size: 1.5rem;
}

.role-info {
  flex: 1;
}

.role-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.role-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Соглашения */
.agreement-group {
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.4;
}

.checkbox-label.required::after {
  content: ' *';
  color: var(--accent-red);
}

.checkbox-label a {
  color: var(--primary-color);
  text-decoration: none;
}

/* Кнопки */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.google-btn:hover:not(:disabled) {
  background: #f8fafc;
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.login-link {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 1rem;
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
}

/* Информационный блок */
.register-info {
  padding: 1rem 0;
}

.register-info h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.register-info ul {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.register-info li {
  padding: 0.75rem 0;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  line-height: 1.5;
}

.register-info li:last-child {
  border-bottom: none;
}

.register-info li strong {
  color: var(--text-primary);
}

.info-note {
  background: var(--primary-color-light);
  opacity: 0.1;
  border-left: 4px solid var(--primary-color);
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2rem;
}

.info-note p {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 992px) {
  .register-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .register-card {
    padding: 2rem;
  }
  
  .role-selection {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .register-container {
    padding: 0 0.5rem;
  }
}
</style>