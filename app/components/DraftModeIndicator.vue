<template>
  <div class="status-indicator" :class="statusClass">
    <div class="status-icon">
      <component :is="statusIcon" class="icon" />
    </div>
    <div class="status-content">
      <div class="status-title">{{ statusTitle }}</div>
      <div class="status-description">{{ statusDescription }}</div>
    </div>
    <div v-if="showProgress" class="status-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">{{ progressText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ClockIcon,
  CheckCircleIcon, 
  XCircleIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

type GuestStatus = 'REGISTERED' | 'PENDING' | 'CONFIRMED' | 'ATTENDED' | 'CANCELLED'

interface Props {
  status: GuestStatus
  showProgress?: boolean
  guestCount?: number
  confirmedCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: false,
  guestCount: 0,
  confirmedCount: 0
})

// Status configurations
const statusConfig = computed(() => {
  switch (props.status) {
    case 'REGISTERED':
      return {
        title: 'Aguardando Resposta',
        description: 'O convite foi enviado e está aguardando sua resposta',
        icon: ClockIcon,
        class: 'registered',
        progress: 25
      }
    case 'PENDING':
      return {
        title: 'Convite Aceito',
        description: 'Agora complete os dados dos convidados para confirmar presença',
        icon: UserGroupIcon,
        class: 'pending',
        progress: 50
      }
    case 'CONFIRMED':
      return {
        title: 'Presença Confirmada',
        description: 'Todos os dados foram preenchidos e a presença está confirmada!',
        icon: CheckCircleIcon,
        class: 'confirmed',
        progress: 100
      }
    case 'ATTENDED':
      return {
        title: 'Presença Registrada',
        description: 'Os convidados compareceram ao evento',
        icon: CheckCircleIcon,
        class: 'attended',
        progress: 100
      }
    case 'CANCELLED':
      return {
        title: 'Convite Recusado',
        description: 'O convite foi recusado e não há presença confirmada',
        icon: XCircleIcon,
        class: 'cancelled',
        progress: 0
      }
    default:
      return {
        title: 'Status Desconhecido',
        description: 'Status não reconhecido',
        icon: ExclamationTriangleIcon,
        class: 'unknown',
        progress: 0
      }
  }
})

const statusTitle = computed(() => statusConfig.value.title)
const statusDescription = computed(() => statusConfig.value.description)
const statusIcon = computed(() => statusConfig.value.icon)
const statusClass = computed(() => statusConfig.value.class)

const progressPercentage = computed(() => {
  if (!props.showProgress) return statusConfig.value.progress
  
  if (props.guestCount === 0) return 0
  return (props.confirmedCount / props.guestCount) * 100
})

const progressText = computed(() => {
  if (!props.showProgress) return `${statusConfig.value.progress}% concluído`
  
  return `${props.confirmedCount} de ${props.guestCount} convidados confirmados`
})
</script>

<style scoped>
.status-indicator {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.status-indicator:hover {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.status-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.status-content {
  flex: 1;
  min-width: 0;
}

.status-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #F8FAFC;
  margin-bottom: 0.25rem;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.status-description {
  font-size: 0.9rem;
  color: #CBD5E1;
  line-height: 1.4;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.status-progress {
  flex-shrink: 0;
  width: 120px;
  text-align: right;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #94A3B8;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Status-specific styles */
.status-indicator.registered .status-icon {
  background: linear-gradient(145deg, #F59E0B20, #F59E0B10);
  border: 1px solid #F59E0B40;
}

.status-indicator.registered .icon {
  color: #F59E0B;
}

.status-indicator.registered .progress-fill {
  background: linear-gradient(90deg, #F59E0B, #D97706);
}

.status-indicator.pending .status-icon {
  background: linear-gradient(145deg, #3B82F620, #3B82F610);
  border: 1px solid #3B82F640;
}

.status-indicator.pending .icon {
  color: #3B82F6;
}

.status-indicator.pending .progress-fill {
  background: linear-gradient(90deg, #3B82F6, #2563EB);
}

.status-indicator.confirmed .status-icon {
  background: linear-gradient(145deg, #10B98120, #10B98110);
  border: 1px solid #10B98140;
}

.status-indicator.confirmed .icon {
  color: #10B981;
}

.status-indicator.confirmed .progress-fill {
  background: linear-gradient(90deg, #10B981, #059669);
}

.status-indicator.attended .status-icon {
  background: linear-gradient(145deg, #10B98120, #10B98110);
  border: 1px solid #10B98140;
}

.status-indicator.attended .icon {
  color: #10B981;
}

.status-indicator.attended .progress-fill {
  background: linear-gradient(90deg, #10B981, #059669);
}

.status-indicator.cancelled .status-icon {
  background: linear-gradient(145deg, #EF444420, #EF444410);
  border: 1px solid #EF444440;
}

.status-indicator.cancelled .icon {
  color: #EF4444;
}

.status-indicator.cancelled .progress-fill {
  background: linear-gradient(90deg, #EF4444, #DC2626);
}

.status-indicator.unknown .status-icon {
  background: linear-gradient(145deg, #6B728020, #6B728010);
  border: 1px solid #6B728040;
}

.status-indicator.unknown .icon {
  color: #6B7280;
}

.status-indicator.unknown .progress-fill {
  background: linear-gradient(90deg, #6B7280, #4B5563);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .status-indicator {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
  }
  
  .status-progress {
    width: 100%;
    text-align: left;
  }
  
  .status-title {
    font-size: 1rem;
  }
  
  .status-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .status-indicator {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .status-icon {
    width: 40px;
    height: 40px;
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
  
  .status-title {
    font-size: 0.95rem;
  }
  
  .status-description {
    font-size: 0.8rem;
  }
}
</style>
