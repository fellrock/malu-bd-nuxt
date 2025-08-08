<template>
  <div class="landing-container">
    <!-- Header -->
    <div class="header mb-4xl animate-fadeInUp">
      <h1 class="title">Você foi convidado! 🎉</h1>
      <p class="subtitle mt-lg">Maria Luiza faz 4 aninhos</p>
    </div>

    <!-- Event Summary -->
    <div class="mb-5xl animate-fadeInScale stagger-1">
      <EventSummary />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state glass-card animate-fadeInScale">
      <div class="loading-spinner animate-spin"></div>
      <p>Carregando informações do convite...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state glass-card animate-fadeInUp">
      <Icon name="exclamation-triangle" size="48" class="error-icon mb-lg" />
      <h3 class="mb-md">Ops! Algo deu errado</h3>
      <p class="mb-lg">{{ error }}</p>
      <button @click="loadGuestData" class="btn-primary">
        <Icon name="arrow-path" size="16" />
        Tentar novamente
      </button>
    </div>

    <!-- Main Landing Content -->
    <div v-else-if="guestData" class="content-area">
      
      <!-- For REGISTERED guests: Clean landing with decision buttons -->
      <div v-if="currentStatus === 'REGISTERED'" class="glass-card invitation-card mb-3xl animate-fadeInUp stagger-2">
        <div class="invitation-content">
          <h2 class="invitation-title mb-xl">Confirme sua presença!</h2>
          <p class="invitation-description mb-3xl">
            Será uma alegria ter você conosco neste dia especial! 
            A festa promete ser inesquecível.
          </p>
          
          <div class="guest-preview mb-4xl">
            <h3 class="guest-preview-title mb-xl">Convidados:</h3>
            <ul class="guest-list">
              <li v-for="guest in guestData.guests" :key="guest.id" class="guest-item animate-slideInRight" :class="`stagger-${guest.id % 6 + 1}`">
                <Icon name="user" size="16" class="guest-icon" />
                <span class="guest-name">{{ guest.name }}</span>
              </li>
            </ul>
          </div>
          
          <div class="decision-buttons">
            <button 
              @click="acceptInvitation" 
              class="btn-success btn-responsive animate-magicFloat"
              :disabled="Boolean(submitting)"
            >
              <div v-if="submitting === 'accept'" class="loading-spinner animate-spin"></div>
              <Icon v-else name="check" size="20" />
              <span>Sim, Eu Vou!</span>
            </button>
            
            <button 
              @click="showRejectModal = true" 
              class="btn-danger btn-responsive stagger-1"
              :disabled="Boolean(submitting)"
            >
              <div v-if="submitting === 'reject'" class="loading-spinner animate-spin"></div>
              <Icon v-else name="x-mark" size="20" />
              <span>Não Posso Ir</span>
            </button>
          </div>
        </div>
      </div>

      <!-- For CANCELLED status: Show cancellation message -->
      <div v-else-if="currentStatus === 'CANCELLED'" class="glass-card status-card animate-fadeInUp">
        <div class="cancelled-message">
          <Icon name="x-circle" size="64" class="status-icon danger mb-lg animate-sparkle" />
          <h2 class="mb-md">Convite Recusado</h2>
          <p class="mb-lg">Agradecemos pela resposta. Sentiremos sua falta na festa da Maria Luiza!</p>
          <div class="info-card danger">
            <p>Caso mude de ideia, entre em contato conosco.</p>
          </div>
        </div>
      </div>

      <!-- Fallback for unknown status -->
      <div v-else class="glass-card status-card animate-fadeInUp">
        <div class="error-message">
          <Icon name="exclamation-triangle" size="64" class="status-icon warning mb-lg animate-sparkle" />
          <h2 class="mb-md">Status Inesperado</h2>
          <p class="mb-lg">Redirecionando para a página apropriada...</p>
          <div class="loading-spinner animate-spin"></div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showRejectModal"
      title="Recusar Convite"
      message="Tem certeza de que não poderá comparecer à festa? Sentiremos sua falta!"
      confirm-text="Sim, não posso ir"
      cancel-text="Voltar"
      type="danger"
      :loading="submitting === 'reject'"
      :show-reason-input="true"
      :reason="rejectionReason"
      @confirm="rejectInvitation"
      @cancel="showRejectModal = false"
      @close="showRejectModal = false"
    />

    <!-- Creator Reference -->
    <CreatorReference />
  </div>
</template>

<script setup lang="ts">
// Page configuration with strict routing middleware
definePageMeta({
  layout: 'default',
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    if (!inviteCode) {
      return navigateTo('/acesso-negado', { replace: true })
    }

    try {
      const response = await $fetch(`/api/guest-code/${inviteCode}`)
      
      if (!response.success || !response.guests.length) {
        return navigateTo('/acesso-negado', { replace: true })
      }

      // Determine overall status
      const statuses = response.guests.map((g: any) => g.status)
      let currentStatus = 'REGISTERED'
      
      if (statuses.every((s: string) => s === 'CANCELLED')) {
        currentStatus = 'CANCELLED'
      } else if (statuses.some((s: string) => s === 'CONFIRMED')) {
        currentStatus = 'CONFIRMED'
      } else if (statuses.some((s: string) => s === 'PENDING')) {
        currentStatus = 'PENDING'
      }

      // Strict routing: Main page ONLY for REGISTERED
      if (currentStatus === 'PENDING') {
        return navigateTo(`/convite/${inviteCode}`, { replace: true })
      }
      
      if (currentStatus === 'CONFIRMED') {
        return navigateTo(`/evento/${inviteCode}`, { replace: true })
      }
      
      if (currentStatus === 'CANCELLED') {
        return navigateTo('/cancelado', { replace: true })
      }

      // Allow REGISTERED to stay on main page
      
    } catch (error: any) {
      console.error('Middleware error:', error)
      return navigateTo('/acesso-negado', { replace: true })
    }
  }
})

const route = useRoute()
const inviteCode = route.params.code as string

// Reactive data
const loading = ref(true)
const error = ref('')
const guestData = ref<any>(null)
const submitting = ref<string | false>(false)

// Modal states
const showRejectModal = ref(false)
const rejectionReason = ref('')

// Computed properties
const currentStatus = computed(() => {
  if (!guestData.value?.guests?.length) return 'REGISTERED'
  
  // Determine overall status based on guest statuses
  const statuses = guestData.value.guests.map((g: any) => g.status)
  
  if (statuses.every((s: string) => s === 'CANCELLED')) return 'CANCELLED'
  if (statuses.some((s: string) => s === 'CONFIRMED')) return 'CONFIRMED'
  if (statuses.some((s: string) => s === 'PENDING')) return 'PENDING'
  
  return 'REGISTERED'
})

// Data loading (simplified - no auto-redirect logic needed)
const loadGuestData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await $fetch(`/api/guest-code/${inviteCode}`)
    
    if (response.success && response.guests.length > 0) {
      guestData.value = response
    } else {
      await navigateTo('/acesso-negado', { replace: true })
    }
  } catch (err: any) {
    console.error('Error loading guest data:', err)
    if (err.statusCode === 404) {
      await navigateTo('/acesso-negado', { replace: true })
    } else {
      error.value = 'Erro ao carregar informações do convite. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}

// Invitation actions
const acceptInvitation = async () => {
  try {
    submitting.value = 'accept'
    
    const response = await $fetch('/api/invitation-response', {
      method: 'POST',
      body: {
        inviteCode,
        action: 'ACCEPT'
      }
    })
    
    if (response?.success) {
      // Redirect to invitation page to complete data
      await navigateTo(`/convite/${inviteCode}`)
    }
  } catch (err: any) {
    console.error('Error accepting invitation:', err)
    error.value = 'Erro ao aceitar convite. Tente novamente.'
  } finally {
    submitting.value = false
  }
}

const rejectInvitation = async (reason?: string) => {
  try {
    submitting.value = 'reject'
    
    const response = await $fetch('/api/invitation-response', {
      method: 'POST',
      body: {
        inviteCode,
        action: 'REJECT',
        rejectionReason: reason
      }
    })
    
    if (response?.success) {
      await loadGuestData() // Reload to get updated status
      showRejectModal.value = false
    }
  } catch (err: any) {
    console.error('Error rejecting invitation:', err)
    error.value = 'Erro ao recusar convite. Tente novamente.'
  } finally {
    submitting.value = false
  }
}

// Load data on mount
onMounted(async () => {
  if (!inviteCode) {
    await navigateTo('/acesso-negado', { replace: true })
    return
  }
  
  await loadGuestData()
})
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: var(--gradient-background);
  padding: var(--space-xl);
  padding-bottom: var(--space-6xl);
  position: relative;
}

.header {
  text-align: center;
}

.title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  color: var(--color-text-primary);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 0;
  line-height: 1.2;
}

.subtitle {
  font-size: clamp(1rem, 3vw, 1.25rem);
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: 500;
}

.loading-state,
.error-state {
  text-align: center;
  padding: var(--space-3xl);
  margin: var(--space-xl) auto;
  max-width: 500px;
}

.loading-state p,
.error-state p {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.error-state h3 {
  color: var(--color-text-primary);
  font-size: var(--text-xl);
}

.error-icon {
  color: var(--color-danger);
  filter: drop-shadow(0 4px 12px rgba(255, 99, 71, 0.4));
}

.content-area {
  max-width: 700px;
  margin: 0 auto;
}

.invitation-card {
  padding: var(--space-3xl);
  border: 2px solid rgba(255, 105, 180, 0.3);
  background: var(--color-surface-elevated);
}

.invitation-title {
  color: var(--color-text-primary);
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}

.invitation-description {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  line-height: 1.6;
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.guest-preview {
  background: var(--color-surface);
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
}

.guest-preview-title {
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  font-weight: 600;
  text-align: center;
}

.guest-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guest-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-surface-elevated);
  border: var(--border-glass);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  transition: var(--transition-base);
}

.guest-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(255, 105, 180, 0.4);
}

.guest-item:last-child {
  margin-bottom: 0;
}

.guest-icon {
  color: var(--color-primary);
  filter: drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3));
}

.guest-name {
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: var(--text-base);
}

.decision-buttons {
  display: flex;
  gap: var(--space-xl);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-responsive {
  min-width: 160px;
  padding: var(--space-lg) var(--space-xl);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: var(--transition-base);
  border: 2px solid transparent;
}

.btn-responsive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-success.btn-responsive {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-primary);
  border-color: rgba(255, 105, 180, 0.4);
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
}

.btn-success.btn-responsive:hover {
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.5);
  border-color: rgba(255, 105, 180, 0.6);
}

.btn-danger.btn-responsive {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: var(--color-text-primary);
  border-color: rgba(147, 112, 219, 0.4);
  box-shadow: 0 4px 20px rgba(147, 112, 219, 0.3);
}

.btn-danger.btn-responsive:hover {
  box-shadow: 0 8px 25px rgba(147, 112, 219, 0.5);
  border-color: rgba(147, 112, 219, 0.6);
}

/* Dark theme specific button text colors */
[data-theme="dark"] .btn-success.btn-responsive,
[data-theme="dark"] .btn-danger.btn-responsive {
  color: #1A237E;
}

[data-theme="dark"] .btn-success.btn-responsive span,
[data-theme="dark"] .btn-danger.btn-responsive span {
  color: #1A237E;
}

.cancelled-message h2,
.error-message h2 {
  color: var(--color-text-primary);
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.3;
}

.status-card .status-icon {
  filter: drop-shadow(0 4px 12px rgba(255, 105, 180, 0.3));
}

.status-icon.danger {
  color: var(--color-danger);
  filter: drop-shadow(0 4px 12px rgba(255, 99, 71, 0.4));
}

.status-icon.warning {
  color: var(--color-warning);
  filter: drop-shadow(0 4px 12px rgba(255, 215, 0, 0.4));
}

.cancelled-message p,
.error-message p {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  line-height: 1.6;
}

.info-card {
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  border: var(--border-subtle);
  background: var(--color-surface);
}

.info-card.danger {
  background: rgba(255, 99, 71, 0.1);
  border-color: rgba(255, 99, 71, 0.2);
}

.info-card.danger p {
  color: var(--color-danger);
  margin: 0;
}

.creator-reference {
  padding: var(--space-xl) 0 var(--space-md) 0;
  border-top: var(--border-subtle);
  text-align: center;
  opacity: 0.8;
}

.creator-reference p {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

.creator-reference a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-base);
}

.creator-reference a:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .landing-container {
    padding: var(--space-lg);
  }

  .invitation-card {
    padding: var(--space-2xl);
  }

  .guest-preview {
    padding: var(--space-xl);
  }
  
  .decision-buttons {
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
  }
  
  .btn-responsive {
    width: 100%;
    max-width: 280px;
    min-width: auto;
    padding: var(--space-lg) var(--space-xl);
    font-size: var(--text-sm);
  }
}

@media (max-width: 480px) {
  .landing-container {
    padding: var(--space-md);
  }

  .invitation-card {
    padding: var(--space-xl);
  }

  .guest-preview {
    padding: var(--space-lg);
  }

  .guest-item {
    padding: var(--space-md);
    gap: var(--space-sm);
  }

  .btn-responsive {
    padding: var(--space-md) var(--space-lg);
    font-size: var(--text-sm);
  }
  
  .loading-state,
  .error-state {
    padding: var(--space-xl);
    margin: var(--space-lg) auto;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
</style>
