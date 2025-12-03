<template>
  <div class="profile-page">
    <h1>Личный кабинет</h1>
    <p>Страница находится в разработке</p>
    <div class="profile-info">
      <p><strong>Имя:</strong> {{ user?.name }}</p>
      <p><strong>Email:</strong> {{ user?.email }}</p>
      <p><strong>Роль:</strong> {{ user?.role }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/shared/composables/useAuth'

const { user } = useAuth()
</script>

<style scoped>
.profile-page {
  padding: 2rem;
}

.profile-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--background-secondary);
  border-radius: var(--border-radius-md);
  max-width: 400px;
}
</style>