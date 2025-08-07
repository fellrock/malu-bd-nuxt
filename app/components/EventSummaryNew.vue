<template>
  <div class="event-summary glass-card fade-in">
    <h2 class="event-title">{{ title }}</h2>
    
    <div class="event-grid">
      <div class="event-item slide-up" style="animation-delay: 0.1s">
        <div class="event-icon">
          <CalendarDaysIcon class="icon" />
        </div>
        <div class="event-details">
          <div class="event-label">Data</div>
          <div class="event-value">{{ eventDate }}</div>
          <div class="event-extra">{{ eventTime }}</div>
        </div>
      </div>
      
      <div class="event-item slide-up" style="animation-delay: 0.2s">
        <div class="event-icon">
          <MapPinIcon class="icon" />
        </div>
        <div class="event-details">
          <div class="event-label">Local</div>
          <div class="event-value">{{ eventLocation }}</div>
          <div class="event-extra">{{ eventLocationSubtitle }}</div>
        </div>
      </div>
      
      <div class="event-item slide-up" style="animation-delay: 0.3s">
        <div class="event-icon">
          <TruckIcon class="icon" />
        </div>
        <div class="event-details">
          <div class="event-label">Estacionamento</div>
          <div class="event-value">{{ parkingInfo }}</div>
          <div class="event-extra">{{ parkingDetails }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarDaysIcon, MapPinIcon, TruckIcon } from '@heroicons/vue/24/outline'

// Props with default values for Maria Luiza's party
interface Props {
  title?: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  eventLocationSubtitle?: string
  parkingInfo?: string
  parkingDetails?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Informações do Evento',
  eventDate: '30 de Agosto de 2025',
  eventTime: '10h às 14h',
  eventLocation: 'Quintal Cores',
  eventLocationSubtitle: 'Recreio - Rio de Janeiro, RJ',
  parkingInfo: 'Gratuito no local',
  parkingDetails: 'Entrada pela Rua das Palmeiras'
})
</script>

<style scoped>
.event-summary {
  margin-bottom: var(--space-3xl);
}

.event-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-50);
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.event-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-base);
}

.event-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.event-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-lg);
  background: var(--gradient-secondary);
  box-shadow: var(--shadow-md);
}

.event-icon .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-white);
}

.event-details {
  flex: 1;
  min-width: 0;
}

.event-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-400);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-100);
  margin-bottom: var(--space-xs);
  line-height: var(--line-height-tight);
}

.event-extra {
  font-size: var(--font-size-sm);
  color: var(--color-gray-300);
  line-height: var(--line-height-normal);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .event-item {
    padding: var(--space-md);
    gap: var(--space-md);
  }
  
  .event-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .event-icon .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .event-value {
    font-size: var(--font-size-base);
  }
}

@media (max-width: 480px) {
  .event-title {
    font-size: var(--font-size-lg);
  }
  
  .event-item {
    padding: var(--space-sm);
    gap: var(--space-sm);
  }
  
  .event-icon {
    width: 2rem;
    height: 2rem;
  }
  
  .event-icon .icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
