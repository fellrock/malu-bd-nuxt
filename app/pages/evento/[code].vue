<template>
  <div class="event-container">
    <div class="header">
      <h1 class="title">Maria Luiza faz 4 aninhos! 🎉</h1>
      <p class="subtitle">Informações do Evento</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Carregando informações do evento...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Event Content -->
    <div v-else class="event-content">
      <!-- Guest Information -->
      <div v-if="referenceInfo" class="guest-info-card">
        <div class="card-header">
          <h2>👥 Convidados</h2>
          <div class="reference-info">
            <strong>{{ referenceInfo.referenceCode }}</strong>
            <span v-if="hasConfirmedGuests" class="confirmed-badge">Confirmado</span>
          </div>
        </div>
        
        <div class="guests-list">
          <div v-for="guest in guests" :key="guest.id" class="guest-item">
            <div class="guest-info">
              <span class="guest-name">{{ guest.name }}</span>
              <div class="guest-details">
                <span v-if="guest.email" class="guest-email">{{ guest.email }}</span>
                <span v-if="guest.kidAge" class="kid-info">
                  Criança: {{ guest.kidAge }} anos ({{ guest.maleKid ? 'Menino' : 'Menina' }})
                </span>
                <span v-if="guest.dietary" class="dietary">Restrições: {{ guest.dietary }}</span>
              </div>
            </div>
            <div class="guest-actions">
              <button @click="editGuest(guest)" class="edit-btn" title="Editar">✏️</button>
              <button @click="cancelGuest(guest)" class="cancel-btn" title="Cancelar">❌</button>
            </div>
          </div>
        </div>
        
        <!-- Family Actions -->
        <div class="family-actions">
          <button @click="rejectFamily" class="reject-family-btn">
            ❌ Cancelar Participação de Todos
          </button>
        </div>
      </div>

      <!-- Countdown Card -->
      <div class="countdown-card">
        <h2 class="card-title">⏰ Contagem Regressiva</h2>
        <div class="countdown-display">
          <div class="countdown-time">{{ timeLeft }}</div>
        </div>
      </div>

      <!-- Event Timeline -->
      <div class="timeline-card">
        <h2 class="card-title">📅 Cronograma do Evento</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-time">10h00</div>
            <div class="timeline-content">
              <strong>Recepção</strong><br>
              Chegada dos convidados e boas-vindas
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">10h30</div>
            <div class="timeline-content">
              <strong>Brincadeiras</strong><br>
              Atividades e diversão para as crianças
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">11h30</div>
            <div class="timeline-content">
              <strong>Parabéns</strong><br>
              Cantamos parabéns e cortamos o bolo
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">12h00</div>
            <div class="timeline-content">
              <strong>Almoço</strong><br>
              Servimos o almoço para todos
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">13h00</div>
            <div class="timeline-content">
              <strong>Fotos</strong><br>
              Sessão de fotos com a aniversariante
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">14h00</div>
            <div class="timeline-content">
              <strong>Encerramento</strong><br>
              Despedida e lembrancinhas
            </div>
          </div>
        </div>
      </div>

      <!-- Photo Album -->
      <div class="photos-card">
        <h2 class="card-title">📸 Album de Fotos</h2>
        <div class="photo-sharing">
          <p class="photo-description">
            Compartilhe suas fotos da festa conosco! Clique na imagem do QR Code abaixo para acessar o álbum compartilhado do Google Photos.
          </p>
          <div class="qr-section">
            <a href="https://photos.google.com/share/album-link" target="_blank" class="qr-link">
              <div class="qr-code-image">
                <div class="qr-placeholder">
                  📱<br>
                  <strong>QR Code</strong><br>
                  <small>Clique para acessar<br>o álbum de fotos</small>
                </div>
              </div>
            </a>
            <p class="qr-instruction">👆 Clique na imagem para abrir o álbum</p>
          </div>
        </div>
      </div>

      <!-- Gift Suggestions -->
      <div class="gifts-card">
        <h2 class="card-title">🎁 Ideias de Presentes</h2>
        <div class="gifts-info">
          <p>Sua presença já é o melhor presente! Mas se quiser dar algo especial para Maria Luiza, temos algumas sugestões.</p>
          <button @click="goToGifts" class="gifts-link">
            🎁 Ver Sugestões de Presentes
          </button>
        </div>
      </div>

      <!-- Location Card -->
      <div class="location-card">
        <h2 class="card-title">📍 Local da Festa</h2>
        <div class="location-info">
          <div class="venue-details">
            <strong>Quintal Cores</strong><br>
            Av. Genaro de Carvalho, 3555<br>
            Recreio - Rio de Janeiro, RJ
          </div>
          <a href="https://maps.google.com/?q=Quintal+Cores+Recreio+RJ" target="_blank" class="map-link">
            🗺️ Ver no Mapa
          </a>
        </div>
      </div>

      <!-- Dress Code -->
      <div class="dress-card">
        <h2 class="card-title">👕 Roupa & Diversão</h2>
        <div class="dress-info">
          <div class="dress-item">
            <span class="dress-icon">🌈</span>
            <span>Roupa colorida e confortável</span>
          </div>
          <div class="dress-item">
            <span class="dress-icon">👟</span>
            <span>Sapatos fechados para brincar</span>
          </div>
          <div class="dress-item">
            <span class="dress-icon">🏊‍♀️</span>
            <span>Traga roupa de banho (tem piscina!)</span>
          </div>
          <div class="dress-item">
            <span class="dress-icon">🧴</span>
            <span>Protetor solar e toalha</span>
          </div>
        </div>
      </div>

      <!-- Parking Info -->
      <div class="parking-card">
        <h2 class="card-title">🚗 Estacionamento</h2>
        <div class="parking-info">
          <div class="parking-item">
            <span class="parking-icon">🆓</span>
            <span><strong>Gratuito</strong> - Estacionamento no local</span>
          </div>
          <div class="parking-item">
            <span class="parking-icon">🚪</span>
            <span>Entrada pela <strong>Rua das Palmeiras</strong></span>
          </div>
          <div class="parking-item">
            <span class="parking-icon">🚗</span>
            <span>Vagas limitadas - chegue cedo!</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Guest Modal -->
    <div v-if="editingGuest" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar Convidado</h3>
          <button @click="closeEditModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveGuestEdit">
            <div class="form-group">
              <label>Nome:</label>
              <input v-model="editForm.name" type="text" required class="form-input" />
            </div>
            <div class="form-group">
              <label>E-mail:</label>
              <input v-model="editForm.email" type="email" class="form-input" />
            </div>
            <div class="form-group">
              <label>Restrições alimentares:</label>
              <textarea v-model="editForm.dietary" class="form-textarea" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" :checked="!!editForm.kidAge" @change="toggleKidEdit" />
                É criança
              </label>
            </div>
            <div v-if="editForm.kidAge !== null" class="kid-fields">
              <div class="form-group">
                <label>Idade:</label>
                <input v-model.number="editForm.kidAge" type="number" min="0" max="18" class="form-input" />
              </div>
              <div class="form-group">
                <label>Sexo:</label>
                <select v-model="editForm.maleKid" class="form-select">
                  <option value="">Selecione</option>
                  <option :value="true">Menino</option>
                  <option :value="false">Menina</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Observações:</label>
              <textarea v-model="editForm.notes" class="form-textarea" rows="2"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-actions">
          <button @click="closeEditModal" class="cancel-btn">Cancelar</button>
          <button @click="saveGuestEdit" :disabled="saving" class="save-btn">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Guest Modal -->
    <div v-if="cancellingGuest" class="modal-overlay" @click="closeCancelModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Cancelar Convidado</h3>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja cancelar a presença de <strong>{{ cancellingGuest.name }}</strong>?</p>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
        <div class="modal-actions">
          <button @click="closeCancelModal" class="cancel-btn">Não, Manter</button>
          <button @click="confirmCancelGuest" :disabled="cancelling" class="delete-btn">
            {{ cancelling ? 'Cancelando...' : 'Sim, Cancelar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Family Modal -->
    <div v-if="showRejectFamilyDialog" class="modal-overlay" @click="closeRejectFamilyDialog">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Cancelar Participação de Todos</h3>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja cancelar a participação de <strong>todos os convidados</strong>?</p>
          <p>Esta ação cancelará a presença de todos os convidados do grupo:</p>
          <ul>
            <li v-for="guest in guests" :key="guest.id">
              <strong>{{ guest.name }}</strong>
            </li>
          </ul>
          <p><strong>Esta ação não pode ser desfeita.</strong></p>
        </div>
        <div class="modal-actions">
          <button @click="closeRejectFamilyDialog" class="cancel-btn">Não, Manter</button>
          <button @click="confirmRejectFamily" :disabled="rejectingFamily" class="delete-btn">
            {{ rejectingFamily ? 'Cancelando...' : 'Sim, Cancelar Todos' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Creator Reference -->
    <div class="creator-reference">
      <p>Desenvolvido por <a href="https://www.kravela.cloud" target="_blank" rel="noopener noreferrer">Kravela Cloud LTDA</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Define page meta for middleware
definePageMeta({
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    if (inviteCode) {
      try {
        const res: any = await $fetch(`/api/guest-code/${inviteCode}`)
        if (res.success && res.guests.length > 0) {
          const hasConfirmedGuests = res.guests.some((guest: any) => guest.status === 'CONFIRMED')
          const hasRegisteredGuests = res.guests.some((guest: any) => guest.status === 'REGISTERED')
          
          // Only redirect to invitation page if NO guests are confirmed (all are registered)
          if (hasRegisteredGuests && !hasConfirmedGuests) {
            return navigateTo(`/convite/${inviteCode}`, { replace: true })
          }
          
          // If there are confirmed guests, stay on event page (even if some are still registered)
        } else {
          // If no guests found, redirect to access denied page
          return navigateTo('/acesso-negado', { replace: true })
        }
      } catch (err: any) {
        console.error('Error in middleware:', err)
        // On API error (404, etc.), redirect to access denied page
        if (err.statusCode === 404) {
          return navigateTo('/acesso-negado', { replace: true })
        } else {
          // For other server errors, redirect to access denied page
          return navigateTo('/acesso-negado', { replace: true })
        }
      }
    } else {
      // If no invite code, redirect to access denied page
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

// Computed properties
const hasConfirmedGuests = computed(() => {
  return guests.value.some(guest => guest.status === 'CONFIRMED')
})

// Edit guest modal
const editingGuest = ref<any>(null)
const editForm = ref<any>({})
const saving = ref(false)

// Cancel guest modal
const cancellingGuest = ref<any>(null)
const cancelling = ref(false)

// Reject family modal
const showRejectFamilyDialog = ref(false)
const rejectingFamily = ref(false)

// Countdown timer
let countdownInterval: NodeJS.Timeout

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
      guests.value = res.guests
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

  if (difference <= 0) {
    timeLeft.value = 'A festa já começou! 🎉'
    return
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  timeLeft.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
}

function editGuest(guest: any) {
  editingGuest.value = guest
  editForm.value = {
    name: guest.name,
    email: guest.email || '',
    dietary: guest.dietary || '',
    kidAge: guest.kidAge,
    maleKid: guest.maleKid,
    notes: guest.notes || ''
  }
}

function closeEditModal() {
  editingGuest.value = null
  editForm.value = {}
}

function toggleKidEdit(event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked
  if (isChecked) {
    editForm.value.kidAge = 0
    editForm.value.maleKid = null
  } else {
    editForm.value.kidAge = null
    editForm.value.maleKid = null
  }
}

async function saveGuestEdit() {
  if (!editingGuest.value || !editForm.value.name.trim()) return
  
  saving.value = true
  
  try {
    const res: any = await $fetch('/api/group-guests', {
      method: 'PUT',
      body: {
        inviteCode: inviteCode.value,
        referenceCode: referenceInfo.value.referenceCode,
        category: referenceInfo.value.category,
        guests: [{
          id: editingGuest.value.id,
          name: editForm.value.name.trim(),
          email: editForm.value.email.trim() || null,
          dietary: editForm.value.dietary.trim() || null,
          kidAge: editForm.value.kidAge || null,
          maleKid: editForm.value.maleKid,
          notes: editForm.value.notes.trim() || null,
          status: editingGuest.value.status
        }]
      }
    })

    if (res.success) {
      closeEditModal()
      await fetchEventData() // Refresh data
    }
  } catch (err: any) {
    console.error('Error saving guest:', err)
    alert('Erro ao salvar alterações. Tente novamente.')
  } finally {
    saving.value = false
  }
}

function cancelGuest(guest: any) {
  cancellingGuest.value = guest
}

function closeCancelModal() {
  cancellingGuest.value = null
}

async function confirmCancelGuest() {
  if (!cancellingGuest.value) return
  
  cancelling.value = true
  
  try {
    const res: any = await $fetch('/api/cancel-guests', {
      method: 'POST',
      body: {
        guestIds: [cancellingGuest.value.id],
        reason: 'Cancelado pelo usuário na página do evento'
      }
    })

    if (res.success) {
      closeCancelModal()
      await fetchEventData() // Refresh data
    }
  } catch (err: any) {
    console.error('Error cancelling guest:', err)
    alert('Erro ao cancelar convidado. Tente novamente.')
  } finally {
    cancelling.value = false
  }
}

function rejectFamily() {
  showRejectFamilyDialog.value = true
}

function closeRejectFamilyDialog() {
  showRejectFamilyDialog.value = false
}

async function confirmRejectFamily() {
  rejectingFamily.value = true
  
  try {
    const guestIds = guests.value.map(guest => guest.id).filter(Boolean)
    
    if (guestIds.length > 0) {
      await $fetch('/api/cancel-guests', {
        method: 'POST',
        body: {
          guestIds,
          reason: 'Convite recusado pela família na página do evento'
        }
      })
    }

    closeRejectFamilyDialog()
    alert('Participação de todos os convidados cancelada com sucesso.')
    router.push('/')
  } catch (err: any) {
    console.error('Error rejecting family invitation:', err)
    alert('Erro ao recusar convite da família. Tente novamente.')
  } finally {
    rejectingFamily.value = false
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

useHead({
  title: `Evento - Maria Luiza 4 Anos`
})
</script>

<style scoped>
/* Event Container */
.event-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: #F8FAFC;
  text-shadow: 0 4px 20px #00000040;
  letter-spacing: -1px;
}

.subtitle {
  font-weight: 700;
  margin: 0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  color: #CBD5E1;
  text-shadow: 0 2px 10px #00000040;
}

.event-content {
  display: grid;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

/* Card Styles */
.guest-info-card,
.countdown-card,
.timeline-card,
.photos-card,
.location-card,
.dress-card,
.parking-card {
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000020;
  transition: all 0.3s ease;
}

.guest-info-card {
  grid-column: 1 / -1; /* Full width */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #F8FAFC;
  text-shadow: 0 2px 10px #00000040;
}

.card-title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #F8FAFC;
  text-shadow: 0 2px 10px #00000040;
}

.reference-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #F8FAFC;
  font-weight: 600;
}

.confirmed-badge {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px #10B98130;
}

.category-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-badge.Amigos { background: #3B82F6; color: #FFFFFF; }
.category-badge.Creche { background: #F59E0B; color: #FFFFFF; }
.category-badge.Familia { background: #10B981; color: #FFFFFF; }
.category-badge.Padrinhos { background: #8B5CF6; color: #FFFFFF; }

/* Guest List */
.guests-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #64748B15;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #64748B20;
}

.guest-info {
  flex: 1;
}

.guest-name {
  font-weight: 600;
  color: #F8FAFC;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.5rem;
}

.guest-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.guest-email {
  color: #94A3B8;
  font-size: 0.9rem;
}

.kid-info {
  background: #F59E0B;
  color: #FFFFFF;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.dietary {
  background: #EF4444;
  color: #FFFFFF;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.registered { background: #64748B; color: #FFFFFF; }
.status-badge.confirmed { background: #10B981; color: #FFFFFF; }
.status-badge.attended { background: #3B82F6; color: #FFFFFF; }

.guest-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.cancel-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #3B82F6;
}

.cancel-btn:hover {
  background: #EF4444;
}

/* Family Actions */
.family-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #64748B30;
  text-align: center;
}

.reject-family-btn {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: #FFFFFF;
  border: 1px solid #F8717140;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.reject-family-btn:hover {
  background: linear-gradient(135deg, #DC2626, #B91C1C);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #EF444440;
}

/* Countdown */
.countdown-display {
  text-align: center;
}

.countdown-time {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: 800;
  color: #F8FAFC;
  text-shadow: 0 4px 20px #00000040;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #64748B10;
  border-radius: 12px;
  border-left: 4px solid #10B981;
}

.timeline-time {
  font-weight: 700;
  color: #10B981;
  min-width: 60px;
  font-family: 'Courier New', monospace;
}

.timeline-content {
  color: #E2E8F0;
  line-height: 1.5;
}

.timeline-content strong {
  color: #F8FAFC;
}

/* Photo Sharing */
.photo-sharing {
  text-align: center;
  color: #E2E8F0;
}

.sharing-options {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
}

.photo-link {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #FFFFFF;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.photo-link:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #10B98140;
}

.photo-description {
  color: #E2E8F0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-link {
  text-decoration: none;
  transition: all 0.3s ease;
}

.qr-link:hover .qr-code-image {
  transform: scale(1.05);
  box-shadow: 0 10px 25px #3B82F640;
}

.qr-code-image {
  width: 120px;
  height: 120px;
  background: linear-gradient(145deg, #64748B20, #64748B15);
  border: 2px solid #64748B40;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.qr-placeholder {
  text-align: center;
  color: #94A3B8;
  font-size: 0.8rem;
  line-height: 1.3;
}

.qr-placeholder strong {
  color: #F8FAFC;
  font-size: 0.9rem;
}

.qr-instruction {
  color: #94A3B8;
  font-size: 0.8rem;
  text-align: center;
  margin: 0;
}

/* Gifts Section */
.gifts-card {
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000020;
  margin-bottom: 2rem;
}

.gifts-info {
  text-align: center;
}

.gifts-info p {
  color: #E2E8F0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.gifts-link {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: #FFFFFF;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  text-decoration: none;
}

.gifts-link:hover {
  background: linear-gradient(135deg, #D97706, #B45309);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #F59E0B40;
}

/* Location */
.location-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.venue-details {
  color: #E2E8F0;
  line-height: 1.6;
}

.venue-details strong {
  color: #F8FAFC;
  font-size: 1.1rem;
}

.map-link {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: #FFFFFF;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.map-link:hover {
  background: linear-gradient(135deg, #2563EB, #1E40AF);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #3B82F640;
}

/* Dress Code */
.dress-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dress-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #E2E8F0;
  line-height: 1.5;
}

.dress-icon {
  font-size: 1.5rem;
  min-width: 2rem;
}

/* Parking */
.parking-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.parking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #E2E8F0;
  line-height: 1.5;
}

.parking-icon {
  font-size: 1.5rem;
  min-width: 2rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(145deg, #1E293B, #334155);
  border-radius: 20px;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000040;
  width: 95%;
  max-width: 600px;
  max-height: 85vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #64748B30;
}

.modal-header h3 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #F8FAFC;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #94A3B8;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #64748B30;
  color: #F8FAFC;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #E2E8F0;
  font-weight: 600;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  box-sizing: border-box;
  background: #64748B15;
  border: 1px solid #64748B40;
  border-radius: 8px;
  padding: 0.75rem;
  color: #F8FAFC;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px #3B82F620;
}

.kid-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.kid-fields .form-group {
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .kid-fields {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .modal-content {
    width: 98%;
    margin: 1rem auto;
  }
  
  .modal-header,
  .modal-body,
  .modal-actions {
    padding: 1rem;
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #64748B30;
  justify-content: flex-end;
}

.cancel-btn {
  background: linear-gradient(135deg, #64748B, #475569);
  color: #FFFFFF;
  border: 1px solid #64748B40;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #475569, #334155);
}

.save-btn {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #FFFFFF;
  border: 1px solid #34D39940;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-btn {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: #FFFFFF;
  border: 1px solid #F8717140;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #DC2626, #B91C1C);
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading and Error States */
.loading,
.error {
  text-align: center;
  padding: 3rem;
  color: #94A3B8;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.1rem;
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000020;
  width: 100%;
  max-width: 800px;
}

.error {
  color: #F87171;
  border-color: #EF444460;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .event-container {
    padding: 1rem 0.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .event-content {
    grid-template-columns: 1fr;
  }
  
  .guest-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .guest-actions {
    justify-content: center;
  }
  
  .sharing-options {
    flex-direction: column;
    gap: 1rem;
  }
  
  .location-info {
    flex-direction: column;
    text-align: center;
  }
  
  .countdown-time {
    font-size: 1.8rem;
  }
  
  .kid-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }
  
  .guest-info-card,
  .countdown-card,
  .timeline-card,
  .photos-card,
  .location-card,
  .dress-card,
  .parking-card {
    padding: 1rem;
  }
  
  .timeline-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .timeline-time {
    min-width: auto;
  }
}

.creator-reference {
  margin-top: 2rem;
  padding: 1.5rem;
  border-top: 1px solid #64748B30;
  text-align: center;
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid #64748B30;
}

.creator-reference p {
  font-size: 0.8rem;
  color: #94A3B8;
  margin: 0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.creator-reference a {
  color: #60A5FA;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.creator-reference a:hover {
  color: #3B82F6;
  text-decoration: underline;
}
</style>
