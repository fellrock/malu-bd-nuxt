<template>
  <div class="invitation-container">
    <div class="header">
      <h1 class="title">Convite</h1>
      <p class="subtitle">Maria Luiza 4 Anos</p>
    </div>

    <!-- Event Info Summary -->
    <div class="event-summary">
      <div class="event-item">
        <div class="event-icon">📅</div>
        <div class="event-details">
          <strong>Data:</strong> 30 de Agosto de 2025<br>
          <strong>Horário:</strong> 10h às 14h
        </div>
      </div>
      <div class="event-item">
        <div class="event-icon">📍</div>
        <div class="event-details">
          <strong>Local:</strong> Quintal Cores<br>
          Recreio - Rio de Janeiro, RJ
        </div>
      </div>
      <div class="event-item">
        <div class="event-icon">🚗</div>
        <div class="event-details">
          <strong>Estacionamento:</strong> Gratuito no local<br>
          Entrada pela Rua das Palmeiras
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Carregando informações do convite...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Invitation Form -->
    <div v-else-if="referenceInfo" class="form-container">
      <div class="reference-header">
        <h2>{{ referenceInfo.referenceCode }}</h2>
        <span class="reference-badge">{{ referenceInfo.referenceCode }}</span>
      </div>

      <form @submit.prevent="submitForm" class="guest-form">
        <div class="guests-list">
          <div v-for="(guest, index) in formGuests" :key="guest.id || `new-${index}`" class="guest-item">
            <div class="guest-header">
              <input 
                v-model="guest.name" 
                type="text" 
                placeholder="Nome completo *"
                required
                class="guest-name-input"
              />
              <button 
                type="button" 
                @click="removeGuest(index)" 
                class="remove-btn"
                v-if="formGuests.length > 1"
                title="Remover convidado"
              >
                🗑️
              </button>
            </div>

            <div class="guest-fields">
              <input 
                v-model="guest.email" 
                type="email" 
                placeholder="E-mail (opcional)"
                class="field-input"
              />
              
              <textarea 
                v-model="guest.dietary" 
                placeholder="Restrições alimentares (opcional)"
                class="field-textarea"
                rows="2"
              ></textarea>

              <div class="kid-section">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    :checked="!!guest.kidAge"
                    @change="toggleKidFields(guest, $event)"
                  />
                  Criança
                </label>

                <div v-if="guest.kidAge !== null && guest.kidAge !== undefined" class="kid-fields">
                  <input 
                    v-model.number="guest.kidAge" 
                    type="number" 
                    placeholder="Idade da criança"
                    min="0" 
                    max="18"
                    class="kid-input"
                  />
                  <select v-model="guest.maleKid" class="kid-select">
                    <option value="">Sexo da criança</option>
                    <option :value="true">Menino</option>
                    <option :value="false">Menina</option>
                  </select>
                </div>
              </div>

              <textarea 
                v-model="guest.notes" 
                placeholder="Observações (opcional)"
                class="field-textarea"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="addGuest" class="add-guest-btn">
            ➕ Adicionar Convidado
          </button>
        </div>

        <div class="form-buttons">
          <button type="button" @click="showRejectDialog = true" class="reject-btn">
            ❌ Recusar Convite
          </button>
          <button type="submit" :disabled="submitting" class="confirm-btn">
            {{ submitting ? 'Confirmando...' : '✅ Confirmar Presença' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Reject Confirmation Dialog -->
    <div v-if="showRejectDialog" class="modal-overlay" @click="showRejectDialog = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Tem certeza que deseja recusar o convite?</h3>
        </div>
        <div class="modal-body">
          <p>Esta ação cancelará a presença de todos os convidados do seu grupo:</p>
          <ul>
            <li v-for="guest in formGuests" :key="guest.id || guest.name">
              <strong>{{ guest.name || 'Nome não informado' }}</strong>
            </li>
          </ul>
          <p><strong>Esta ação não pode ser desfeita.</strong></p>
        </div>
        <div class="modal-actions">
          <button @click="showRejectDialog = false" class="cancel-btn">
            Não, Voltar
          </button>
          <button @click="rejectInvitation" :disabled="rejecting" class="reject-confirm-btn">
            {{ rejecting ? 'Cancelando...' : 'Sim, Cancelar para Todos' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>🎉 Presença Confirmada!</h3>
        </div>
        <div class="modal-body">
          <p>Obrigada pela confirmação! Estamos ansiosos para comemorar junto com vocês.</p>
          <p>Você pode acessar todas as informações do evento usando seu código: <strong>{{ inviteCode }}</strong></p>
        </div>
        <div class="modal-actions">
          <button @click="goToEvent" class="event-btn">
            🎊 Ver Informações do Evento
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
import { ref, onMounted } from 'vue'

// Define page meta for middleware
definePageMeta({
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    if (inviteCode) {
      try {
        const res: any = await $fetch(`/api/guest-code/${inviteCode}`)
        if (res.success && res.guests.length > 0) {
          const hasConfirmedGuests = res.guests.some((guest: any) => guest.status === 'CONFIRMED')
          
          // Redirect to event page if ANY guest is confirmed
          if (hasConfirmedGuests) {
            return navigateTo(`/evento/${inviteCode}`, { replace: true })
          }
          
          // If guests exist but none confirmed, stay on invitation page
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
const submitting = ref(false)
const rejecting = ref(false)
const showRejectDialog = ref(false)
const showSuccessModal = ref(false)

const referenceInfo = ref<any>(null)
const originalGuests = ref<any[]>([])
const formGuests = ref<any[]>([])

// Check if invite code is in URL parameter or needs to be entered
if (!inviteCode.value) {
  // Could redirect to a page asking for invite code
  // For now, we'll show an error
  error.value = 'Código de convite não encontrado. Verifique o link recebido.'
}

async function fetchGuestData() {
  if (!inviteCode.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const res: any = await $fetch(`/api/guest-code/${inviteCode.value}`)
    
    if (res.success) {
      referenceInfo.value = res.referenceInfo
      originalGuests.value = res.guests
      
      // Initialize form with existing guests or create empty one
      if (res.guests.length > 0) {
        formGuests.value = res.guests.map((guest: any) => ({
          id: guest.id,
          name: guest.name,
          email: guest.email || '',
          dietary: guest.dietary || '',
          kidAge: guest.kidAge,
          maleKid: guest.maleKid,
          notes: guest.notes || '',
          status: guest.status
        }))
      } else {
        // Create one empty guest for new invitations
        formGuests.value = [createEmptyGuest()]
      }
    }
  } catch (err: any) {
    console.error('Error fetching guest data:', err)
    // If this function is reached, middleware already validated the code exists
    // So this is likely a server error, but we'll redirect to access denied for security
    router.push('/acesso-negado')
  } finally {
    loading.value = false
  }
}

function createEmptyGuest() {
  return {
    id: null,
    name: '',
    email: '',
    dietary: '',
    kidAge: null,
    maleKid: null,
    notes: '',
    status: 'CONFIRMED'
  }
}

function addGuest() {
  formGuests.value.push(createEmptyGuest())
}

function removeGuest(index: number) {
  if (formGuests.value.length > 1) {
    const guest = formGuests.value[index]
    if (guest.id) {
      // Mark existing guest for cancellation
      cancelGuest(guest.id)
    }
    formGuests.value.splice(index, 1)
  }
}

function toggleKidFields(guest: any, event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked
  if (isChecked) {
    guest.kidAge = 0
    guest.maleKid = null
  } else {
    guest.kidAge = null
    guest.maleKid = null
  }
}

async function cancelGuest(guestId: string) {
  try {
    await $fetch('/api/cancel-guests', {
      method: 'POST',
      body: {
        guestIds: [guestId],
        reason: 'Removido pelo usuário no formulário'
      }
    })
  } catch (err) {
    console.error('Error cancelling guest:', err)
  }
}

async function submitForm() {
  // Validate required fields
  const hasEmptyNames = formGuests.value.some(guest => !guest.name.trim())
  if (hasEmptyNames) {
    alert('Por favor, preencha o nome de todos os convidados.')
    return
  }

  submitting.value = true
  
  try {
    const res: any = await $fetch('/api/group-guests', {
      method: 'PUT',
      body: {
        inviteCode: inviteCode.value,
        referenceCode: referenceInfo.value.referenceCode,
        category: referenceInfo.value.category,
        guests: formGuests.value.map(guest => ({
          id: guest.id,
          name: guest.name.trim(),
          email: guest.email.trim() || null,
          dietary: guest.dietary.trim() || null,
          kidAge: guest.kidAge || null,
          maleKid: guest.maleKid,
          notes: guest.notes.trim() || null,
          status: 'CONFIRMED'
        }))
      }
    })

    if (res.success) {
      showSuccessModal.value = true
    }
  } catch (err: any) {
    console.error('Error submitting form:', err)
    alert('Erro ao confirmar presença. Tente novamente.')
  } finally {
    submitting.value = false
  }
}

async function rejectInvitation() {
  rejecting.value = true
  
  try {
    const guestIds = originalGuests.value.map(guest => guest.id).filter(Boolean)
    
    if (guestIds.length > 0) {
      await $fetch('/api/cancel-guests', {
        method: 'POST',
        body: {
          guestIds,
          reason: 'Convite recusado pelo usuário'
        }
      })
    }

    showRejectDialog.value = false
    alert('Convite recusado com sucesso.')
    router.push('/')
  } catch (err: any) {
    console.error('Error rejecting invitation:', err)
    alert('Erro ao recusar convite. Tente novamente.')
  } finally {
    rejecting.value = false
  }
}

function goToEvent() {
  router.push(`/evento/${inviteCode.value}`)
}

onMounted(() => {
  fetchGuestData()
})

useHead({
  title: `Convite - Maria Luiza 4 Anos`
})
</script>

<style scoped>
/* Similar to admin styles but adapted for invitation form */
.invitation-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
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
  margin: 0 0 2rem 0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  color: #CBD5E1;
  text-shadow: 0 2px 10px #00000040;
}

/* Event Summary */
.event-summary {
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000020;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.event-item:last-child {
  margin-bottom: 0;
}

.event-icon {
  font-size: 1.5rem;
  min-width: 2rem;
}

.event-details {
  color: #E2E8F0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
}

/* Form Styles */
.form-container {
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000020;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
}

.reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #64748B30;
}

.reference-header h2 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #F8FAFC;
}

.reference-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #64748B40;
  color: #E2E8F0;
  border: 1px solid #64748B30;
}

.guests-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.guest-item {
  background: #64748B10;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #64748B20;
}

.guest-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.guest-name-input {
  flex: 1;
  background: #64748B15;
  border: 1px solid #64748B40;
  border-radius: 8px;
  padding: 0.75rem;
  color: #F8FAFC;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
}

.guest-name-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px #3B82F620;
}

.remove-btn {
  background: #EF4444;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.remove-btn:hover {
  background: #DC2626;
  transform: scale(1.1);
}

.guest-fields {
  display: grid;
  gap: 1rem;
}

.field-input,
.field-textarea {
  background: #64748B15;
  border: 1px solid #64748B40;
  border-radius: 8px;
  padding: 0.75rem;
  color: #F8FAFC;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  resize: vertical;
}

.field-input:focus,
.field-textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px #3B82F620;
}

.kid-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #E2E8F0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
}

.kid-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.kid-input,
.kid-select {
  background: #64748B15;
  border: 1px solid #64748B40;
  border-radius: 8px;
  padding: 0.75rem;
  color: #F8FAFC;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.form-actions {
  margin: 2rem 0;
  text-align: center;
}

.add-guest-btn {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #FFFFFF;
  border: 1px solid #34D39940;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-guest-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #10B98140;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.reject-btn {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: #FFFFFF;
  border: 1px solid #F8717140;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reject-btn:hover {
  background: linear-gradient(135deg, #DC2626, #B91C1C);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #EF444440;
}

.confirm-btn {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #FFFFFF;
  border: 1px solid #34D39940;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #10B98140;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
}

.modal-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.modal-header h3 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #F8FAFC;
}

.modal-body {
  padding: 1rem 2rem;
  color: #E2E8F0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
}

.modal-body ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  justify-content: center;
  flex-wrap: wrap;
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

.reject-confirm-btn {
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

.reject-confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #DC2626, #B91C1C);
}

.reject-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.event-btn {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: #FFFFFF;
  border: 1px solid #A78BFA40;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.event-btn:hover {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #8B5CF640;
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
  box-sizing: border-box;
}

.error {
  color: #F87171;
  border-color: #EF444460;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .invitation-container {
    padding: 1rem 0.5rem;
  }
  
  .title {
    font-size: 2rem;
  }

  .event-summary,
  .form-container {
    max-width: 100%;
    padding: 1.5rem;
    margin-left: 0;
    margin-right: 0;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .kid-fields {
    grid-template-columns: 1fr;
  }
  
  .guest-header {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }
  
  .event-summary,
  .form-container {
    max-width: 100%;
    padding: 1rem;
    margin-left: 0;
    margin-right: 0;
  }
  
  .modal-content {
    margin: 1rem;
    width: auto;
    max-width: calc(100vw - 2rem);
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
