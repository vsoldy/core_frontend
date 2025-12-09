<template>
  <div class="notifications-container">
    <transition-group name="notification">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-content">
          <strong>{{ notification.title }}</strong>
          <p>{{ notification.message }}</p>
        </div>
        <button @click.stop="removeNotification(notification.id)" class="notification-close">
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores'

const uiStore = useUiStore()
const { notifications } = storeToRefs(uiStore)

const removeNotification = (id: string) => {
  uiStore.removeNotification(id)
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: calc(var(--header-offset) + 0.5rem);
  right: 1rem;
  z-index: 1000;
  max-width: 400px;
  width: 100%;
  pointer-events: none;
}

.notification {
  background-color: var(--background-secondary);
  border-left: 4px solid;
  border-radius: var(--border-radius-md);
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: transform var(--transition-fast);
  animation: slideIn 0.3s ease;
  pointer-events: auto;
}

.notification:hover {
  transform: translateX(-4px);
}

.notification-info {
  border-left-color: #3b82f6;
}

.notification-success {
  border-left-color: var(--accent-green);
}

.notification-warning {
  border-left-color: var(--accent-yellow);
}

.notification-error {
  border-left-color: var(--accent-red);
}

.notification-content {
  flex: 1;
}

.notification-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0 0.25rem;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.notification-close:hover {
  opacity: 1;
}

/* Transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>
