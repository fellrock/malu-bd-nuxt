<template>
  <Teleport to="body">
    <div v-if="visible" class="toast-container" :class="positionClass">
      <div 
        class="toast"
        :class="[typeClass, { 'toast-dismissible': dismissible }]"
        @click="handleToastClick"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <component :is="iconComponent" class="icon" />
          </div>
          <div class="toast-text">
            <div v-if="title" class="toast-title">{{ title }}</div>
            <div class="toast-message">{{ message }}</div>
          </div>
          <button 
            v-if="dismissible" 
            @click.stop="dismiss"
            class="toast-close"
            aria-label="Fechar notificação"
          >
            <XMarkIcon class="icon-sm" />
          </button>
        </div>
        
        <!-- Progress bar for auto-dismiss -->
        <div 
          v-if="autoClose && duration > 0" 
          class="toast-progress"
          :style="{ animationDuration: `${duration}ms` }"
        ></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  duration?: number
  autoClose?: boolean
  dismissible?: boolean
  persistent?: boolean
}

interface Emits {
  dismiss: []
  click: []
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  position: 'top-right',
  duration: 5000,
  autoClose: true,
  dismissible: true,
  persistent: false
})

const emit = defineEmits<Emits>()

const visible = ref(true)
let autoCloseTimer: NodeJS.Timeout | null = null

// Computed properties
const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'info':
    default:
      return InformationCircleIcon
  }
})

const typeClass = computed(() => `toast-${props.type}`)

const positionClass = computed(() => `toast-${props.position}`)

// Methods
const dismiss = () => {
  visible.value = false
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  emit('dismiss')
}

const handleToastClick = () => {
  emit('click')
  if (!props.persistent) {
    dismiss()
  }
}

// Auto-close functionality
onMounted(() => {
  if (props.autoClose && props.duration > 0 && !props.persistent) {
    autoCloseTimer = setTimeout(() => {
      dismiss()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: var(--z-toast);
  pointer-events: none;
}

.toast-container.toast-top-right {
  top: var(--space-lg);
  right: var(--space-lg);
}

.toast-container.toast-top-left {
  top: var(--space-lg);
  left: var(--space-lg);
}

.toast-container.toast-bottom-right {
  bottom: var(--space-lg);
  right: var(--space-lg);
}

.toast-container.toast-bottom-left {
  bottom: var(--space-lg);
  left: var(--space-lg);
}

.toast-container.toast-top-center {
  top: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
}

.toast-container.toast-bottom-center {
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
}

.toast {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  min-width: 300px;
  max-width: 500px;
  overflow: hidden;
  pointer-events: auto;
  position: relative;
  animation: slideInToast 0.3s ease-out;
}

.toast.toast-dismissible {
  cursor: pointer;
}

.toast.toast-dismissible:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2xl);
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.toast-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.toast-success .toast-icon {
  background: var(--color-success);
}

.toast-error .toast-icon {
  background: var(--color-danger);
}

.toast-warning .toast-icon {
  background: var(--color-warning);
}

.toast-info .toast-icon {
  background: var(--color-secondary);
}

.toast-icon .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-white);
}

.toast-text {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-100);
  margin-bottom: var(--space-xs);
  line-height: var(--line-height-tight);
}

.toast-message {
  font-size: var(--font-size-sm);
  color: var(--color-gray-200);
  line-height: var(--line-height-normal);
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-gray-200);
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-secondary), var(--color-secondary-light));
  width: 100%;
  transform-origin: left;
  animation: toastProgress linear forwards;
}

/* Toast type specific styles */
.toast-success {
  border-left: 4px solid var(--color-success);
}

.toast-error {
  border-left: 4px solid var(--color-danger);
}

.toast-warning {
  border-left: 4px solid var(--color-warning);
}

.toast-info {
  border-left: 4px solid var(--color-secondary);
}

/* Animations */
@keyframes slideInToast {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toastProgress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .toast-container {
    left: var(--space-lg) !important;
    right: var(--space-lg) !important;
    transform: none !important;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
  }
  
  @keyframes slideInToast {
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

@media (max-width: 480px) {
  .toast-content {
    padding: var(--space-md);
    gap: var(--space-sm);
  }
  
  .toast-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .toast-icon .icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
