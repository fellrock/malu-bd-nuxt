<template>
  <div class="event-summary glass-card animate-fadeInScale">
    <h2 class="event-title mb-2xl">{{ title }}</h2>
    
    <div class="event-grid">
      <div class="event-item animate-slideInRight stagger-1">
        <div class="event-icon">
          <CalendarDaysIcon class="icon animate-sparkle" />
        </div>
        <div class="event-details">
          <div class="event-label">Data</div>
          <div class="event-value">{{ eventDate }}</div>
          <div class="event-extra">{{ eventTime }}</div>
        </div>
      </div>
      
      <div class="event-item animate-slideInRight stagger-2">
        <div class="event-icon">
          <MapPinIcon class="icon animate-sparkle" />
        </div>
        <div class="event-details">
          <div class="event-label">Local</div>
          <div class="event-value">{{ eventLocation }}</div>
          <div class="event-extra">{{ eventLocationSubtitle }}</div>
        </div>
      </div>
      
      <div class="event-item animate-slideInRight stagger-3">
        <div class="event-icon">
          <TruckIcon class="icon animate-sparkle" />
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
  eventLocationSubtitle: 'Av. Genaro de Carvalho 3555, Recreio dos Bandeirantes - Rio de Janeiro, RJ',
  parkingInfo: 'Gratuito no local',
  parkingDetails: 'Vagas disponíveis nas ruas adjacentes'
})
</script>

<style scoped>
.event-summary {
  margin-bottom: var(--space-2xl);
}

.event-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.event-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: var(--border-glass);
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.event-item:hover {
  background: var(--color-surface-elevated);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.event-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  box-shadow: var(--shadow-md);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.event-icon .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-inverse);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.event-details {
  flex: 1;
  min-width: 0;
}

.event-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}

.event-value {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
  line-height: 1.3;
}

.event-extra {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
  font-weight: 500;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .event-item {
    padding: var(--space-lg);
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
    font-size: var(--text-base);
  }

  .event-title {
    font-size: var(--text-xl);
  }
}

@media (max-width: 480px) {
  .event-title {
    font-size: var(--text-lg);
  }
  
  .event-item {
    padding: var(--space-md);
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

  .event-value {
    font-size: var(--text-sm);
  }

  .event-extra {
    font-size: var(--text-xs);
  }
}
</style>
