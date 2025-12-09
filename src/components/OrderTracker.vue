<template>
  <div class="order-tracker">
    <div class="tracker-header">
      <div>
        <p class="tracker-label">Статус заказа</p>
        <p class="tracker-current">{{ activeStep?.label }}</p>
      </div>
      <div class="tracker-meta" aria-live="polite">
        {{ activeIndex + 1 }} / {{ steps.length }}
      </div>
    </div>

    <div class="tracker-rail" role="list" aria-label="Ход выполнения заказа">
      <div class="tracker-progress" :style="{ width: progressPercent + '%' }"></div>

      <div
        v-for="(step, index) in steps"
        :key="step.status"
        class="tracker-step"
        role="listitem"
        :aria-current="step.isCurrent ? 'step' : undefined"
      >
        <div
          :class="['step-node', { 'is-completed': step.isCompleted, 'is-current': step.isCurrent }]"
        >
          <span v-if="step.isCompleted" class="step-icon">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-text">
          <p class="step-title">{{ step.label }}</p>
          <p v-if="step.description" class="step-description">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  statuses: string[]
  currentStatus: string
  labels?: Partial<Record<string, string>>
  descriptions?: Partial<Record<string, string>>
}

const props = withDefaults(defineProps<Props>(), {
  labels: () => ({}),
  descriptions: () => ({})
})

const formatLabel = (value: string) => {
  const map: Record<string, string> = {
    created: 'Создан',
    in_progress: 'В работе',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен'
  }

  if (props.labels[value]) return props.labels[value] as string
  if (map[value]) return map[value]

  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

const activeIndex = computed(() => {
  if (!props.statuses.length) return 0
  const idx = props.statuses.indexOf(props.currentStatus)
  return idx === -1 ? props.statuses.length - 1 : idx
})

const steps = computed(() =>
  props.statuses.map((status, index) => ({
    status,
    label: formatLabel(status),
    description: props.descriptions[status],
    isCompleted: index < activeIndex.value,
    isCurrent: index === activeIndex.value
  }))
)

const activeStep = computed(() => steps.value[activeIndex.value])

const progressPercent = computed(() => {
  if (steps.value.length <= 1) return 100
  const percent = (activeIndex.value / (steps.value.length - 1)) * 100
  return Math.min(100, Math.max(0, percent))
})
</script>

<style scoped>
.order-tracker {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-md);
}

.tracker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.tracker-label {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.tracker-current {
  margin: 0.15rem 0 0;
  font-weight: 700;
  color: var(--text-primary);
}

.tracker-meta {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.tracker-rail {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  align-items: start;
}

.tracker-rail::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--border-color);
  border-radius: var(--radius-pill);
}

.tracker-progress {
  position: absolute;
  top: 16px;
  left: 0;
  height: 4px;
  background: var(--primary-color);
  border-radius: var(--radius-pill);
  transition: width var(--transition-normal) ease;
}

.tracker-step {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
}

.step-node {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--background-primary);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
}

.step-node.is-current {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb, 14, 165, 233), 0.15);
}

.step-node.is-completed {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.step-icon {
  font-size: 0.9rem;
}

.step-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-title {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.step-description {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .order-tracker {
    padding: 1rem;
  }

  .tracker-rail {
    grid-template-columns: 1fr;
  }

  .tracker-progress {
    display: none;
  }

  .tracker-step {
    background: var(--background-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    padding: 0.75rem;
  }

  .step-node {
    width: 28px;
    height: 28px;
  }
}
</style>
