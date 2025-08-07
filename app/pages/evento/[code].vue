<template>
  <div class="event-container">
    <!-- Header with Theme Toggle -->
    <div class="header mb-4xl animate-fadeInUp">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">
            <span class="mobile-title">Festa da MaLu! 🎉</span>
            <span class="desktop-title">🎉 Festa da Maria Luiza!</span>
          </h1>
          <p class="subtitle">Informações do Evento - 4 Aninhos</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state glass-card animate-fadeInScale">
      <div class="loading-spinner animate-spin"></div>
      <p>Carregando informações do evento...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state glass-card animate-fadeInUp">
      <Icon name="exclamation-triangle" size="48" class="error-icon mb-lg" />
      <h3 class="mb-md">Ops! Algo deu errado</h3>
      <p class="mb-lg">{{ error }}</p>
      <button @click="fetchEventData" class="btn-primary">
        <Icon name="arrow-path" size="16" />
        Tentar novamente
      </button>
    </div>

    <!-- Event Content -->
    <div v-else-if="referenceInfo" class="event-content animate-fadeInUp">
      
      <!-- Countdown Card -->
      <div class="countdown-card glass-card animate-fadeInScale stagger-1">
        <h2 class="card-title">
          <Icon name="clock" size="20" />
          Contagem Regressiva
        </h2>
        <div class="countdown-display">
          <div class="countdown-time">{{ timeLeft }}</div>
          <p class="countdown-label">Para a festa da Maria Luiza!</p>
        </div>
      </div>

      <!-- Guest List Card -->
      <div class="guest-card glass-card animate-fadeInScale stagger-2">
        <div class="card-header">
          <h2 class="card-title">
            <Icon name="users" size="20" />
            <span class="mobile-title">Confirmados</span>
            <span class="desktop-title">Convidados Confirmados</span>
          </h2>
        </div>

        <div v-if="guests.length === 0" class="empty-state">
          <Icon name="user-group" size="48" class="empty-icon" />
          <p>Nenhum convidado encontrado.</p>
        </div>

        <div v-else class="guests-list">
          <div v-for="guest in guests" :key="guest.id" class="guest-item">
            <div class="guest-info">
              <h3 class="guest-name">{{ guest.name }}</h3>
              <div class="guest-details">
                <p v-if="guest.email"><strong>Email:</strong> {{ guest.email }}</p>
                <p v-if="guest.kidAge"><strong>Criança:</strong> {{ guest.kidAge }} anos ({{ guest.maleKid ? 'Menino' : 'Menina' }})</p>
                <p v-if="guest.dietary"><strong>Restrições:</strong> {{ guest.dietary }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Family Actions -->
        <div v-if="guests.length > 0" class="family-actions">
          <button @click="showEditAllModal = true" class="family-action-btn edit-btn">
            <Icon name="pencil-square" size="20" />
            Editar
          </button>          
          <button @click="showCancelAllModal = true" class="family-action-btn cancel-btn">
            <Icon name="x-mark" size="20" />
            Desistência
          </button>
        </div>
      </div>

      <!-- Event Timeline -->
      <div class="timeline-card glass-card animate-fadeInScale stagger-3">
        <h2 class="card-title timeline-title">
          <Icon name="calendar-days" size="20" />
          Cronograma do Evento
        </h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-time">10h00</div>
            <div class="timeline-content">
              <strong>🎊 Recepção</strong><br>
              Chegada dos convidados e boas-vindas
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">10h30</div>
            <div class="timeline-content">
              <strong>🎮 Brincadeiras</strong><br>
              Atividades e diversão para as crianças
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">11h30</div>
            <div class="timeline-content">
              <strong>🎂 Parabéns</strong><br>
              Cantamos parabéns e cortamos o bolo
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">12h00</div>
            <div class="timeline-content">
              <strong>🍽️ Almoço</strong><br>
              Servimos o almoço para todos
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">13h00</div>
            <div class="timeline-content">
              <strong>📸 Fotos</strong><br>
              Sessão de fotos com a aniversariante
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">14h00</div>
            <div class="timeline-content">
              <strong>🎁 Encerramento</strong><br>
              Despedida e lembrancinhas
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Info Cards -->
      <div class="info-cards">
        <!-- Location Card -->
        <div class="location-card glass-card animate-fadeInScale stagger-4">
          <h3 class="info-title">
            <Icon name="map-pin" size="20" />
            Local
          </h3>
          <div class="location-content">
            <div class="location-logo">
              <a 
                href="https://www.instagram.com/oquintal_oficial/" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="logo-instagram-link"
                title="Visite o Instagram do O Quintal Oficial"
              >
                <img src="/oquintal_logo.jpg" alt="O Quintal Oficial" class="quintal-logo" />
                <div class="instagram-overlay">
                  <Icon name="camera" size="20" />
                </div>
              </a>
            </div>
                        <div class="location-details">
              <h3>Quintal Cores</h3>
              <p class="address">Av. Genaro de Carvalho 3555, Recreio dos Bandeirantes - Rio de Janeiro, RJ</p>
              
              <div class="parking-info">
                <Icon name="truck" size="16" class="parking-icon" />
                <span>
                  Estacionamento livre nas ruas adjacentes a casa de festa
                </span>
              </div>
              
              <div class="map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58752.716730123095!2d-43.55529185136721!3d-23.0221274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bc3987187d51b%3A0xa57010c368101b00!2sO%20Quintal%20-%20CORES%20%7C%20Espa%C3%A7o%20de%20Festas*21!5e0!3m2!1spt-BR!2sbr!4v1754557772317!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="200" 
                  style="border:0; border-radius: var(--radius-md);" 
                  allowfullscreen
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Localização do Quintal Cores"
                ></iframe>
              </div>
              
              <div class="location-actions">
                <a 
                  href="https://maps.app.goo.gl/S7m79NeXWVEHS2eJ8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="directions-link"
                >
                  <Icon name="map-pin" size="16" class="directions-icon" />
                  <span>Ver direções no Google Maps</span>
                  <Icon name="arrow-top-right-on-square" size="16" class="external-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Dress Code Card -->
        <div class="dress-card glass-card animate-fadeInScale stagger-5">
          <h3 class="info-title">
            <Icon name="sparkles" size="20" />
            Traje
          </h3>
          <p class="info-content">
            Casual e Colorido!<br>
            Vista-se com cores alegres para celebrar com a Maria Luiza.
          </p>
        </div>

        <!-- Gifts Card -->
        <div class="gifts-card glass-card animate-fadeInScale stagger-6">
          <h3 class="info-title">
            <Icon name="gift" size="20" />
            Presentes
          </h3>
          <p class="info-content">
            Sua presença já é o melhor presente!<br>
            Mas se quiser saber nossas sugestões...
          </p>
          <button @click="goToGifts" class="gifts-btn">
            <Icon name="gift" size="16" />
            Ver Sugestões
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Guest Modal -->
    <div v-if="cancellingGuest" class="modal-overlay" @click="closeCancelModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Cancelar Participação</h3>
          <button @click="closeCancelModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja cancelar a participação de <strong>{{ cancellingGuest.name }}</strong>?</p>
        </div>
        <div class="modal-actions">
          <button @click="closeCancelModal" class="cancel-btn">Não</button>
          <button @click="confirmCancelGuest" :disabled="cancelling" class="confirm-btn">
            {{ cancelling ? 'Cancelando...' : 'Sim, Cancelar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit All Guests Confirmation Modal -->
    <div v-if="showEditAllModal" class="modal-overlay" @click="showEditAllModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar Confirmação</h3>
          <button @click="showEditAllModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p>Deseja editar as informações dos convidados?</p>
          <p class="text-sm text-secondary">Isso irá mudar o status para "Pendente" e você será redirecionado para a página de convite para fazer as alterações.</p>
        </div>
        <div class="modal-actions">
          <button @click="showEditAllModal = false" class="cancel-btn">Cancelar</button>
          <button @click="confirmEditAllGuests" :disabled="saving" class="save-btn">
            {{ saving ? 'Processando...' : 'Sim, Editar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel All Guests Confirmation Modal -->
    <div v-if="showCancelAllModal" class="modal-overlay" @click="showCancelAllModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Cancelar Participação</h3>
          <button @click="showCancelAllModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja cancelar a participação de <strong>todos os convidados</strong> desta família?</p>
          <p class="text-sm text-secondary">Esta ação não pode ser desfeita. Todos os convidados terão seu status alterado para "Cancelado".</p>
        </div>
        <div class="modal-actions">
          <button @click="showCancelAllModal = false" class="cancel-btn">Não</button>
          <button @click="confirmCancelAllGuests" :disabled="cancellingAll" class="confirm-btn">
            {{ cancellingAll ? 'Cancelando...' : 'Sim, Cancelar Todos' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ThemeToggle from '~/components/ThemeToggle.vue'

// Page meta for middleware - STRICT: Only CONFIRMED guests allowed
definePageMeta({
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    if (inviteCode) {
      try {
        const res: any = await $fetch(`/api/guest-code/${inviteCode}`)
        if (res.success && res.guests.length > 0) {
          const statuses = res.guests.map((guest: any) => guest.status)
          
          // If all guests are CANCELLED, redirect to main page
          if (statuses.every((s: string) => s === 'CANCELLED')) {
            return navigateTo(`/${inviteCode}`, { replace: true })
          }
          
          // If guests are still PENDING, redirect to invitation page
          if (statuses.some((s: string) => s === 'PENDING')) {
            return navigateTo(`/convite/${inviteCode}`, { replace: true })
          }
          
          // If guests are still REGISTERED, redirect to main page
          if (statuses.some((s: string) => s === 'REGISTERED')) {
            return navigateTo(`/${inviteCode}`, { replace: true })
          }
          
          // If any guest is CONFIRMED, allow access to this page
          if (statuses.some((s: string) => s === 'CONFIRMED')) {
            return
          }
          
          // Fallback: redirect to main page
          return navigateTo(`/${inviteCode}`, { replace: true })
        } else {
          return navigateTo('/acesso-negado', { replace: true })
        }
      } catch (err: any) {
        console.error('Error in middleware:', err)
        return navigateTo('/acesso-negado', { replace: true })
      }
    } else {
      return navigateTo('/acesso-negado', { replace: true })
    }
  }
})

const route = useRoute()
const router = useRouter()

const inviteCode = ref(route.params.code as string || '')
const loading = ref(false)
const error = ref('')
const timeLeft = ref('')

const referenceInfo = ref<any>(null)
const guests = ref<any[]>([])

// Edit modal state
const showEditAllModal = ref(false)
const showCancelAllModal = ref(false)
const saving = ref(false)

// Cancel modal state
const cancellingGuest = ref<any>(null)
const cancelling = ref(false)
const cancellingAll = ref(false)

// Countdown timer
let countdownInterval: NodeJS.Timeout

// Computed properties
const hasConfirmedGuests = computed(() => {
  return guests.value.some(guest => guest.status === 'CONFIRMED')
})

async function fetchEventData() {
  if (!inviteCode.value) {
    error.value = 'Código de convite não encontrado.'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const res: any = await $fetch(`/api/guest-code/${inviteCode.value}`)
    
    if (res.success) {
      referenceInfo.value = res.referenceInfo
      guests.value = res.guests.filter((guest: any) => guest.status === 'CONFIRMED')
      
      // Store invitation code in session for gift page access
      const invitationCookie = useCookie('invitationCode', {
        default: () => '',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax'
      })
      invitationCookie.value = inviteCode.value
    }
  } catch (err: any) {
    console.error('Error fetching event data:', err)
    if (err.statusCode === 404) {
      error.value = 'Convite não encontrado. Verifique se o código está correto.'
    } else {
      error.value = 'Erro ao carregar informações do evento. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}

function updateCountdown() {
  const eventDate = new Date('2025-08-30T10:00:00-03:00') // Event date: August 30, 2025, 10:00 AM
  const now = new Date()
  const difference = eventDate.getTime() - now.getTime()

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    timeLeft.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
  } else {
    timeLeft.value = "A festa começou! 🎉"
  }
}

function cancelGuest(guest: any) {
  cancellingGuest.value = guest
}

function closeCancelModal() {
  cancellingGuest.value = null
}

async function confirmCancelGuest() {
  cancelling.value = true
  
  try {
    await $fetch('/api/cancel-guests', {
      method: 'POST',
      body: {
        guestIds: [cancellingGuest.value.id],
        reason: 'Cancelado pelo convidado na página do evento'
      }
    })
    
    // Remove from local list
    guests.value = guests.value.filter(g => g.id !== cancellingGuest.value.id)
    
    closeCancelModal()
    alert('Participação cancelada com sucesso.')
  } catch (err: any) {
    console.error('Error cancelling guest:', err)
    alert('Erro ao cancelar participação. Tente novamente.')
  } finally {
    cancelling.value = false
  }
}

function editAllGuests() {
  // Navigate to invitation form to edit all guests
  navigateTo(`/convite/${inviteCode.value}`)
}

async function confirmEditAllGuests() {
  saving.value = true
  
  try {
    // Get all confirmed guest IDs
    const confirmedGuestIds = guests.value.map(guest => guest.id)
    
    // Update all guests status to PENDING using the change-to-pending endpoint
    await $fetch('/api/change-to-pending', {
      method: 'POST',
      body: {
        inviteCode: inviteCode.value,
        guestIds: confirmedGuestIds
      }
    })
    
    showEditAllModal.value = false
    
    // Navigate to invitation page for editing
    navigateTo(`/convite/${inviteCode.value}`)
  } catch (err: any) {
    console.error('Error updating guest status:', err)
    alert('Erro ao atualizar status dos convidados. Tente novamente.')
  } finally {
    saving.value = false
  }
}

async function confirmCancelAllGuests() {
  cancellingAll.value = true
  
  try {
    // Get all confirmed guest IDs
    const confirmedGuestIds = guests.value.map(guest => guest.id)
    
    // Cancel all guests
    await $fetch('/api/cancel-guests', {
      method: 'POST',
      body: {
        guestIds: confirmedGuestIds,
        reason: 'Cancelado em massa pelo convidado na página do evento'
      }
    })
    
    showCancelAllModal.value = false
    
    // Clear local guests list since all are cancelled
    guests.value = []
    
    alert('Participação de todos os convidados foi cancelada com sucesso.')
    
    // Redirect to main invitation page
    navigateTo(`/${inviteCode.value}`)
  } catch (err: any) {
    console.error('Error cancelling all guests:', err)
    alert('Erro ao cancelar participação. Tente novamente.')
  } finally {
    cancellingAll.value = false
  }
}

function goToGifts() {
  navigateTo(`/gifts?code=${inviteCode.value}`)
}

onMounted(() => {
  fetchEventData()
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// SEO
useSeoMeta({
  title: `Evento - Maria Luiza 4 Anos`
})
</script>

<style scoped>
.event-container {
  min-height: 100vh;
  background: var(--gradient-background);
  padding: var(--space-lg);
  padding-bottom: var(--space-6xl);
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .event-container {
    padding: var(--space-xl);
    padding-bottom: var(--space-6xl);
  }
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: var(--space-4xl);
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.title-section {
  flex: 1;
  text-align: center;
}

.title {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 800;
  color: var(--color-text-primary);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 0;
  line-height: 1.2;
}

.subtitle {
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: var(--color-text-secondary);
  margin: var(--space-md) 0 0 0;
  font-weight: 600;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
  }
  
  .title-section {
    text-align: center;
  }
}

/* Loading and Error States */
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

/* Event Content Layout */
.event-content {
  display: grid;
  gap: var(--space-2xl);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .event-content {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

/* Glass Cards */
.glass-card {
  background: var(--color-surface-elevated);
  border: var(--border-glass);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  transition: var(--transition-base);
  backdrop-filter: var(--glass-backdrop);
  box-shadow: var(--shadow-lg);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(255, 105, 180, 0.4);
}

/* Card Headers */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
  gap: var(--space-md);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* Responsive Titles */
.mobile-title {
  display: block;
}

.desktop-title {
  display: none;
}

@media (min-width: 768px) {
  .mobile-title {
    display: none;
  }
  
  .desktop-title {
    display: block;
  }
}

.reference-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.reference-code {
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  border: 1px solid rgba(147, 112, 219, 0.4);
}

.confirmed-badge {
  background: linear-gradient(135deg, var(--color-success), var(--color-success-light));
  color: var(--color-text-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-lg);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

/* Countdown */
.countdown-display {
  text-align: center;
  margin-top: var(--space-lg);
}

.countdown-time {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
}

.countdown-label {
  color: var(--color-text-secondary);
  margin-top: var(--space-sm);
  font-size: var(--text-lg);
}

/* Guest List */
.guests-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.guest-item {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: var(--border-glass);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: var(--transition-base);
  gap: var(--space-md);
}

@media (min-width: 640px) {
  .guest-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-lg);
  }
}

.guest-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(255, 105, 180, 0.3);
}

.guest-info {
  flex: 1;
}

.guest-name {
  font-weight: 700;
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  margin: 0 0 var(--space-sm) 0;
}

.guest-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.guest-details p {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin: 0;
}

.guest-actions {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

@media (min-width: 640px) {
  .guest-actions {
    justify-content: flex-end;
  }
}

/* Buttons */
.edit-btn,
.cancel-btn,
.family-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--text-sm);
  min-height: 36px;
  border: 1px solid transparent;
  text-align: center;
}

.family-action-btn {
  flex: 1;
  max-width: 150px;
  padding: var(--space-md) var(--space-lg);
  min-height: 44px;
}

.edit-btn,
.family-action-btn.edit-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-primary);
  border-color: rgba(255, 105, 180, 0.3);
  box-shadow: 0 2px 10px rgba(255, 105, 180, 0.2);
}

.edit-btn:hover,
.family-action-btn.edit-btn:hover {
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transform: translateY(-1px);
}

.cancel-btn,
.family-action-btn.cancel-btn {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: var(--color-text-primary);
  border-color: rgba(147, 112, 219, 0.4);
  box-shadow: 0 4px 20px rgba(147, 112, 219, 0.3);
}

.cancel-btn:hover,
.family-action-btn.cancel-btn:hover {
  box-shadow: 0 8px 25px rgba(147, 112, 219, 0.5);
  border-color: rgba(147, 112, 219, 0.6);
}

/* Dark theme button text colors */
[data-theme="dark"] .edit-btn,
[data-theme="dark"] .cancel-btn,
[data-theme="dark"] .family-action-btn {
  color: #1A237E;
}

.family-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

/* Timeline */
.timeline-title {
  margin-bottom: var(--space-2xl) !important;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.timeline-item {
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
}

.timeline-time {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-secondary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: var(--text-sm);
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;
}

.timeline-content {
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.timeline-content strong {
  color: var(--color-text-primary);
}

/* Info Cards */
.info-cards {
  display: grid;
  gap: var(--space-lg);
  grid-column: 1 / -1;
}

@media (min-width: 640px) {
  .info-cards {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.info-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-md) 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.info-content {
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* Location Card Styles */
.location-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  align-items: center;
}

.location-logo {
  display: flex;
  justify-content: center;
  position: relative;
}

.logo-instagram-link {
  position: relative;
  display: block;
  text-decoration: none;
  border-radius: 50%;
  overflow: hidden;
  transition: var(--transition-base);
}

.logo-instagram-link:hover {
  transform: scale(1.05);
}

.quintal-logo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: var(--transition-base);
  display: block;
}

.instagram-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: var(--transition-base);
  color: white;
}

.logo-instagram-link:hover .instagram-overlay {
  opacity: 1;
}

.logo-instagram-link:hover .quintal-logo {
  transform: scale(1.1);
}

.location-details {
  text-align: center;
  width: 100%;
}

.parking-info {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin: var(--space-md) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
}

.parking-icon {
  color: var(--color-secondary);
}

.instagram-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
  background: rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 105, 180, 0.2);
}

.instagram-link:hover {
  background: rgba(255, 105, 180, 0.2);
  border-color: rgba(255, 105, 180, 0.4);
  transform: translateY(-1px);
  color: var(--color-primary);
}

.parking-info {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin: var(--space-md) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
}

.parking-icon {
  color: var(--color-secondary);
}

.map-container {
  margin: var(--space-lg) 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.map-container iframe {
  width: 100%;
  display: block;
}

.location-actions {
  margin-top: var(--space-lg);
  display: flex;
  justify-content: center;
}

.directions-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
  background: rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 105, 180, 0.2);
}

.directions-link:hover {
  background: rgba(255, 105, 180, 0.2);
  border-color: rgba(255, 105, 180, 0.4);
  transform: translateY(-1px);
  color: var(--color-primary);
}

.directions-icon {
  color: var(--color-primary);
}

.external-icon {
  color: var(--color-text-secondary);
}

@media (min-width: 480px) {
  .location-content {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }
  
  .location-details {
    text-align: left;
    flex: 1;
  }
  
  .parking-info {
    justify-content: flex-start;
  }
  
  .location-actions {
    justify-content: flex-start;
  }
}

.gifts-btn {
  background: linear-gradient(135deg, rgba(252, 123, 3, 1 ), rgb(237, 162, 91));
  color: var(--color-text-primary);
  border: 1px solid rgba(252, 123, 3, 0.4);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-weight: 200;
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--text-ss);
  margin-top: var(--space-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.gifts-btn:hover {
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--color-text-secondary);
}

.empty-icon {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
  box-sizing: border-box;
}

.modal-content {
  background: var(--color-surface-elevated);
  border-radius: var(--radius-xl);
  border: var(--border-glass);
  backdrop-filter: var(--glass-backdrop);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: var(--border-glass);
}

.modal-header h3 {
  color: var(--color-text-primary);
  margin: 0;
  font-size: var(--text-xl);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--text-2xl);
  cursor: pointer;
  padding: var(--space-xs);
  line-height: 1;
}

.close-btn:hover {
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--space-xl);
}

.modal-body .text-sm {
  font-size: var(--text-sm);
}

.modal-body .text-secondary {
  color: var(--color-text-secondary);
  margin-top: var(--space-sm);
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-xl);
  border-top: var(--border-glass);
  justify-content: flex-end;
}

@media (max-width: 480px) {
  .modal-actions {
    flex-direction: column;
  }
}

.save-btn,
.confirm-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 105, 180, 0.4);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
}

.save-btn:hover,
.confirm-btn:hover {
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}

.save-btn:disabled,
.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: rgba(100, 116, 139, 0.3);
  color: var(--color-text-secondary);
  border: 1px solid rgba(100, 116, 139, 0.3);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
}

.cancel-btn:hover {
  background: rgba(100, 116, 139, 0.5);
  color: var(--color-text-primary);
}

/* Dark theme modal button text colors */
[data-theme="dark"] .save-btn,
[data-theme="dark"] .confirm-btn {
  color: #1A237E;
}

/* Animations */
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid transparent;
  border-top: 3px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Button Primary */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 105, 180, 0.4);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
}

.btn-primary:hover {
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transform: translateY(-1px);
}

[data-theme="dark"] .btn-primary {
  color: #1A237E;
}
</style>
