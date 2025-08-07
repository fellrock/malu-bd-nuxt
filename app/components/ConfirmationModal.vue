<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay fade-in" @click="handleOverlayClick">
      <div class="modal-content slide-up" @click.stop>
        <div class="modal-header">
          <div class="modal-icon" :class="iconClass">
            <component :is="iconComponent" class="icon" />
          </div>
          <h3 class="modal-title">{{ title }}</h3>
          <button 
            @click="$emit('close')" 
            class="modal-close btn-ghost btn-sm"
            aria-label="Fechar"
          >
            <XMarkIcon class="btn-icon" />
          </button>
        </div>
        
        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
          
          <!-- Slot for custom content -->
          <slot />
          
          <!-- Rejection reason input for reject actions -->
          <div v-if="showReasonInput" class="reason-input-container">
            <label for="rejection-reason" class="form-label">
              Motivo (opcional):
            </label>
            <textarea
              id="rejection-reason"
              v-model="localReason"
              placeholder="Ex: Conflito de agenda, viagem marcada..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-actions">
          <button 
            @click="$emit('cancel')" 
            class="btn btn-ghost"
            :disabled="loading"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="handleConfirm" 
            class="btn"
            :class="confirmButtonClass"
            :disabled="loading"
          >
            <div v-if="loading" class="loading-spinner loading-spinner-sm"></div>
            <component v-else-if="confirmIcon" :is="confirmIcon" class="btn-icon" />
            <span>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  CheckIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'success' | 'danger' | 'warning' | 'info'
  loading?: boolean
  showReasonInput?: boolean
  reason?: string
  confirmIcon?: any
  closeOnOverlayClick?: boolean
}

interface Emits {
  confirm: [reason?: string]
  cancel: []
  close: []
  'update:reason': [value: string]
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  type: 'info',
  loading: false,
  showReasonInput: false,
  reason: '',
  closeOnOverlayClick: true
})

const emit = defineEmits<Emits>()

// Local state for reason input
const localReason = ref(props.reason)

// Update local reason when prop changes
watch(() => props.reason, (newValue) => {
  localReason.value = newValue
})

// Emit reason updates
watch(localReason, (newValue) => {
  emit('update:reason', newValue)
})

// Computed properties for styling
const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'danger':
      return ExclamationTriangleIcon
    case 'warning':
      return ExclamationCircleIcon
    case 'info':
    default:
      return InformationCircleIcon
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'modal-icon-success'
    case 'danger':
      return 'modal-icon-danger'
    case 'warning':
      return 'modal-icon-warning'
    case 'info':
    default:
      return 'modal-icon-info'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'btn-success'
    case 'danger':
      return 'btn-danger'
    case 'warning':
      return 'btn-warning'
    case 'info':
    default:
      return 'btn-primary'
  }
})

// Event handlers
const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    emit('close')
  }
}

const handleConfirm = () => {
  emit('confirm', localReason.value)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.modal-content {
  background: linear-gradient(145deg, var(--color-gray-800), var(--color-gray-700));
  border-radius: var(--radius-2xl);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  position: relative;
}

.modal-header {
  padding: var(--space-3xl) var(--space-3xl) var(--space-2xl);
  text-align: center;
  border-bottom: 1px solid var(--color-gray-600);
  position: relative;
}

.modal-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-lg);
  box-shadow: var(--shadow-lg);
}

.modal-icon-success {
  background: var(--gradient-success);
}

.modal-icon-danger {
  background: var(--gradient-danger);
}

.modal-icon-warning {
  background: var(--gradient-accent);
}

.modal-icon-info {
  background: var(--gradient-secondary);
}

.modal-icon .icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-white);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--color-gray-50);
  line-height: var(--line-height-tight);
}

.modal-close {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
}

.modal-body {
  padding: var(--space-3xl);
  color: var(--color-gray-200);
  line-height: var(--line-height-relaxed);
}

.modal-message {
  font-size: var(--font-size-base);
  margin: 0 0 var(--space-lg) 0;
  text-align: center;
}

.reason-input-container {
  margin-top: var(--space-xl);
}

.modal-actions {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-2xl) var(--space-3xl) var(--space-3xl);
  justify-content: center;
  flex-wrap: wrap;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modal-content {
    margin: var(--space-lg);
    max-width: calc(100vw - var(--space-3xl));
  }
  
  .modal-header,
  .modal-body,
  .modal-actions {
    padding-left: var(--space-2xl);
    padding-right: var(--space-2xl);
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions .btn {
    width: 100%;
  }
  
  .modal-icon {
    width: 3rem;
    height: 3rem;
  }
  
  .modal-icon .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: var(--space-2xl) var(--space-2xl) var(--space-lg);
  }
  
  .modal-body {
    padding: var(--space-2xl);
  }
  
  .modal-actions {
    padding: var(--space-lg) var(--space-2xl) var(--space-2xl);
  }
  
  .modal-title {
    font-size: var(--font-size-lg);
  }
}

/* Warning button styles */
.btn-warning {
  background: var(--gradient-accent);
  color: var(--color-white);
  border-color: var(--color-accent);
  box-shadow: var(--shadow-button);
}

.btn-warning:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-accent-dark) 0%, #D97706 100%);
  transform: translateY(-2px) scale(var(--hover-scale));
  box-shadow: var(--shadow-button-hover);
}

.btn-warning:active:not(:disabled) {
  transform: translateY(0) scale(var(--active-scale));
  box-shadow: var(--shadow-md);
}
</style>
