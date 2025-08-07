<template>
  <div class="invitation-container">

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
    </div>

    <!-- Invitation Form -->
    <div v-else-if="referenceInfo" class="form-container">
      <div class="form-header glass-card mb-3xl animate-fadeInUp stagger-3">
        <h2 class="form-title">Complete seus dados</h2>
        <p class="form-subtitle">Precisamos de algumas informações para confirmar sua presença</p>
      </div>

      <form class="guest-form">
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
                class="remove-btn desktop-remove"
                v-if="formGuests.length > 1"
                title="Remover convidado"
              >
                <TrashIcon class="icon-sm" />
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
            
            <!-- Mobile remove button at bottom -->
            <div v-if="formGuests.length > 1" class="mobile-remove-container">
              <button 
                type="button" 
                @click="removeGuest(index)" 
                class="remove-btn mobile-remove"
                title="Remover convidado"
              >
                <TrashIcon class="icon-xs" /> 
                <span class="mobile-btn-text">Remover</span>
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="addGuest" class="add-guest-btn">
            <PlusIcon class="icon-sm" /> 
            <span class="btn-text">Adicionar Convidado</span>
            <span class="btn-text-mobile">Adicionar</span>
          </button>
        </div>

        <div class="form-buttons">
          <button type="button" @click="showConfirmSubmitDialog = true" :disabled="!isFormValid" class="confirm-btn">
            <CheckIcon class="icon-sm" /> 
            <span class="btn-text">Enviar Dados</span>
            <span class="btn-text-mobile">Enviar</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Remove Guest Confirmation Dialog -->
    <div v-if="showRemoveGuestDialog" class="modal-overlay" @click="closeRemoveGuestDialog">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Remover Convidado</h3>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja remover <strong>{{ formGuests[removingGuestIndex]?.name || 'este convidado' }}</strong> da lista?</p>
          <p v-if="formGuests[removingGuestIndex]?.id"><strong>Esta ação não pode ser desfeita.</strong></p>
        </div>
        <div class="modal-actions">
          <button @click="closeRemoveGuestDialog" class="cancel-btn">
            Não, Manter
          </button>
          <button @click="confirmRemoveGuest" class="reject-confirm-btn">
            Sim, Remover
          </button>
        </div>
      </div>
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

    <!-- Confirm Submit Dialog -->
    <div v-if="showConfirmSubmitDialog" class="modal-overlay" @click="showConfirmSubmitDialog = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Envio dos Dados</h3>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja finalizar a confirmação de presença com os dados informados?</p>
          <div class="guest-summary">
            <p><strong>Convidados que serão confirmados:</strong></p>
            <ul>
              <li v-for="guest in formGuests" :key="guest.id || guest.name">
                <strong>{{ guest.name || 'Nome não informado' }}</strong>
                <span v-if="guest.kidAge !== null"> (Criança de {{ guest.kidAge }} anos)</span>
              </li>
            </ul>
          </div>
          <p><strong>Após confirmar, os dados serão salvos e a presença será oficializada.</strong></p>
        </div>
        <div class="modal-actions">
          <button @click="showConfirmSubmitDialog = false" class="cancel-btn">
            Revisar Dados
          </button>
          <button @click="submitFormData" :disabled="submitting" class="confirm-btn">
            {{ submitting ? 'Enviando...' : 'Confirmar Presença' }}
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
import {
  CalendarDaysIcon,
  MapPinIcon,
  TruckIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'

// Define page meta for middleware - STRICT: Only PENDING guests allowed
definePageMeta({
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    if (inviteCode) {
      try {
        const res: any = await $fetch(`/api/guest-code/${inviteCode}`)
        if (res.success && res.guests.length > 0) {
          // Determine overall status
          const statuses = res.guests.map((guest: any) => guest.status)
          
          // If all guests are CANCELLED, redirect to main page
          if (statuses.every((s: string) => s === 'CANCELLED')) {
            return navigateTo(`/${inviteCode}`, { replace: true })
          }
          
          // If any guest is CONFIRMED, redirect to event page
          if (statuses.some((s: string) => s === 'CONFIRMED')) {
            return navigateTo(`/evento/${inviteCode}`, { replace: true })
          }
          
          // If guests are still REGISTERED, redirect to main page
          if (statuses.some((s: string) => s === 'REGISTERED')) {
            return navigateTo(`/${inviteCode}`, { replace: true })
          }
          
          // If guests are PENDING, allow access to this page for data completion
          if (statuses.some((s: string) => s === 'PENDING')) {
            // Allow access - this is where they complete their data
            return
          }
          
          // Fallback: redirect to main page
          return navigateTo(`/${inviteCode}`, { replace: true })
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
const showRemoveGuestDialog = ref(false)
const showConfirmSubmitDialog = ref(false)
const removingGuestIndex = ref<number>(-1)

// Draft mode state management
const isDraftMode = ref(true)
const hasUnsavedChanges = ref(false)
const originalFormData = ref<string>('')

const referenceInfo = ref<any>(null)
const originalGuests = ref<any[]>([])
const formGuests = ref<any[]>([])

// Check if invite code is in URL parameter or needs to be entered
if (!inviteCode.value) {
  // Could redirect to a page asking for invite code
  // For now, we'll show an error
  error.value = 'Código de convite não encontrado. Verifique o link recebido.'
}

// Computed properties
const isFormValid = computed(() => {
  return formGuests.value.length > 0 && formGuests.value.every(guest => guest.name.trim() !== '')
})

// Watch for form changes to detect unsaved changes
watch(formGuests, () => {
  if (originalFormData.value) {
    const currentData = JSON.stringify(formGuests.value)
    hasUnsavedChanges.value = currentData !== originalFormData.value
    
    // Auto-save to localStorage
    if (hasUnsavedChanges.value) {
      saveToLocalStorage()
    }
  }
}, { deep: true })

// localStorage functions
function saveToLocalStorage() {
  if (inviteCode.value) {
    try {
      localStorage.setItem(`convite_draft_${inviteCode.value}`, JSON.stringify({
        guests: formGuests.value,
        timestamp: Date.now()
      }))
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
    }
  }
}

function loadFromLocalStorage() {
  if (inviteCode.value) {
    try {
      const saved = localStorage.getItem(`convite_draft_${inviteCode.value}`)
      if (saved) {
        const data = JSON.parse(saved)
        // Only load if saved within last 24 hours
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          return data.guests
        }
      }
    } catch (err) {
      console.warn('Failed to load from localStorage:', err)
    }
  }
  return null
}

function clearLocalStorage() {
  if (inviteCode.value) {
    try {
      localStorage.removeItem(`convite_draft_${inviteCode.value}`)
    } catch (err) {
      console.warn('Failed to clear localStorage:', err)
    }
  }
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
      
      // Store invitation code in session for gift page access
      const invitationCookie = useCookie('invitationCode', {
        default: () => '',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax'
      })
      invitationCookie.value = inviteCode.value
            
      // Initialize form with existing guests or create empty one
      if (res.guests.length > 0) {
        formGuests.value = res.guests.map((guest: any) => ({
          id: guest.id,
          name: guest.name || '',
          email: guest.email || '',
          dietary: guest.dietary || '',
          kidAge: guest.kidAge !== null && guest.kidAge !== undefined ? guest.kidAge : null,
          maleKid: guest.maleKid !== null && guest.maleKid !== undefined ? guest.maleKid : null,
          notes: guest.notes || '',
          status: guest.status
        }))
      } else {
        // Create one empty guest for new invitations
        formGuests.value = [createEmptyGuest()]
      }
      
      // Try to load from localStorage if available (for draft mode)
      const savedData = loadFromLocalStorage()
      if (savedData && savedData.length > 0) {
        // Only use saved data if we have guests with PENDING status
        const hasPendingGuests = res.guests.some((guest: any) => guest.status === 'PENDING')
        if (hasPendingGuests) {
          formGuests.value = savedData
        }
      }
      
      // Store original form data for change detection
      originalFormData.value = JSON.stringify(formGuests.value)
      hasUnsavedChanges.value = false
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
    status: 'PENDING'
  }
}

function addGuest() {
  formGuests.value.push(createEmptyGuest())
}

function removeGuest(index: number) {
  if (formGuests.value.length > 1) {
    removingGuestIndex.value = index
    showRemoveGuestDialog.value = true
  }
}

function confirmRemoveGuest() {
  const index = removingGuestIndex.value
  if (index >= 0 && formGuests.value.length > 1) {
    const guest = formGuests.value[index]
    if (guest.id) {
      // Mark existing guest for cancellation
      cancelGuest(guest.id)
    }
    formGuests.value.splice(index, 1)
  }
  closeRemoveGuestDialog()
}

function closeRemoveGuestDialog() {
  showRemoveGuestDialog.value = false
  removingGuestIndex.value = -1
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

async function submitFormData() {
  // Validate required fields
  const hasEmptyNames = formGuests.value.some(guest => !guest.name.trim())
  if (hasEmptyNames) {
    alert('Por favor, preencha o nome de todos os convidados.')
    return
  }

  submitting.value = true
  showConfirmSubmitDialog.value = false
  
  try {
    // Use the new complete-invitation API endpoint
    const res: any = await $fetch('/api/complete-invitation', {
      method: 'POST',
      body: {
        inviteCode: inviteCode.value,
        guests: formGuests.value.map(guest => ({
          id: guest.id, // Include the guest ID for proper identification
          name: guest.name.trim(),
          email: guest.email.trim() || undefined,
          dietary: guest.dietary.trim() || undefined,
          kidAge: guest.kidAge !== null && guest.kidAge !== undefined && guest.kidAge !== '' && !isNaN(Number(guest.kidAge)) ? Number(guest.kidAge) : undefined,
          maleKid: guest.maleKid !== null && guest.maleKid !== undefined && guest.maleKid !== '' ? Boolean(guest.maleKid) : undefined,
          notes: guest.notes.trim() || undefined
        }))
      }
    })

    if (res.success) {
      // Clear localStorage since data is now saved
      clearLocalStorage()
      
      // Update the original form data to reflect saved state
      originalFormData.value = JSON.stringify(formGuests.value)
      hasUnsavedChanges.value = false
      isDraftMode.value = false
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
.invitation-container {
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

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  padding: var(--space-3xl);
  border: 2px solid rgba(255, 105, 180, 0.3);
  background: var(--color-surface-elevated);
}

.form-title {
  color: var(--color-text-primary);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}

.form-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  line-height: 1.6;
  margin: var(--space-md) 0 0 0;
}

.guests-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.guest-item {
  background: var(--color-surface-elevated);
  border: var(--border-glass);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  transition: var(--transition-base);
  backdrop-filter: var(--glass-backdrop);
  box-shadow: var(--glass-shadow);
}

.guest-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(255, 105, 180, 0.4);
}

.guest-header {
  display: flex;
  gap: var(--space-lg);
  align-items: center;
  margin-bottom: var(--space-xl);
}

.guest-name-input {
  flex: 1;
  background: var(--color-surface);
  border: var(--border-glass);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  font-size: var(--text-lg);
  font-weight: 600;
  transition: var(--transition-base);
  backdrop-filter: var(--glass-backdrop);
}

.guest-name-input::placeholder {
  color: var(--color-text-tertiary);
}

.guest-name-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.3);
  background: var(--color-surface-elevated);
}

.guest-fields {
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: 1fr;
}

.field-input,
.field-textarea,
.kid-input,
.kid-select {
  background: var(--color-surface);
  border: var(--border-glass);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  font-size: var(--text-base);
  transition: var(--transition-base);
  backdrop-filter: var(--glass-backdrop);
}

.field-input::placeholder,
.field-textarea::placeholder,
.kid-input::placeholder {
  color: var(--color-text-tertiary);
}

.field-input:focus,
.field-textarea:focus,
.kid-input:focus,
.kid-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.3);
  background: var(--color-surface-elevated);
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.kid-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-primary);
  font-weight: 500;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
}

.kid-fields {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: 1fr 1fr;
}

.remove-btn {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: var(--color-text-primary);
  border: 2px solid rgba(147, 112, 219, 0.4);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
  transition: var(--transition-base);
  box-shadow: 0 4px 12px rgba(147, 112, 219, 0.3);
}

.remove-btn:hover {
  box-shadow: 0 8px 25px rgba(147, 112, 219, 0.5);
  border-color: rgba(147, 112, 219, 0.6);
  transform: translateY(-2px);
}

.mobile-remove-container {
  display: none;
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: var(--border-subtle);
}

.mobile-remove {
  gap: var(--space-sm);
  width: 100%;
  justify-content: center;
  font-size: var(--text-sm);
}

.mobile-btn-text {
  display: block;
}

.form-actions {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.add-guest-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-primary);
  border: 2px solid rgba(255, 105, 180, 0.4);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-base);
  font-weight: 600;
  transition: var(--transition-base);
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
}

.add-guest-btn:hover {
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.5);
  border-color: rgba(255, 105, 180, 0.6);
  transform: translateY(-2px);
}

.form-buttons {
  display: flex;
  gap: var(--space-xl);
  justify-content: center;
  flex-wrap: wrap;
}

.reject-btn,
.confirm-btn {
  min-width: 160px;
  padding: var(--space-lg) var(--space-xl);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: var(--transition-base);
  border: 2px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  justify-content: center;
}

.reject-btn {
  background: linear-gradient(135deg, var(--color-danger), var(--color-danger-light));
  color: var(--color-text-primary);
  border-color: rgba(255, 99, 71, 0.4);
  box-shadow: 0 4px 20px rgba(255, 99, 71, 0.3);
}

.reject-btn:hover {
  box-shadow: 0 8px 25px rgba(255, 99, 71, 0.5);
  border-color: rgba(255, 99, 71, 0.6);
  transform: translateY(-2px);
}

.confirm-btn {
  background: linear-gradient(135deg, #FF69B4, #9370DB, #FFD700, #FF1493, #FF69B4);
  color: white !important;
  border: 2px solid rgba(255, 105, 180, 0.4);
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
}

.confirm-btn:hover:not(:disabled) {
  box-shadow: 0 8px 30px rgba(255, 105, 180, 0.6), 0 4px 15px rgba(147, 112, 219, 0.4), 0 2px 8px rgba(255, 215, 0, 0.3);
  border-color: rgba(255, 105, 180, 0.6);
  transform: translateY(-2px);
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Dark theme specific button text colors */
[data-theme="dark"] .reject-btn,
[data-theme="dark"] .add-guest-btn,
[data-theme="dark"] .remove-btn {
  color: #1A237E;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: var(--color-surface-elevated);
  border: var(--border-glass);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  backdrop-filter: var(--glass-backdrop);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  padding: var(--space-2xl) var(--space-2xl) var(--space-lg);
  text-align: center;
  border-bottom: var(--border-subtle);
}

.modal-header h3 {
  font-size: var(--text-xl);
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.modal-body {
  padding: var(--space-xl) var(--space-2xl);
}

.modal-body p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.modal-body ul {
  list-style: none;
  padding: 0;
  margin: var(--space-lg) 0;
}

.modal-body li {
  padding: var(--space-sm) 0;
  color: var(--color-text-primary);
}

.modal-actions {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  padding: var(--space-lg) var(--space-2xl) var(--space-2xl);
  border-top: var(--border-subtle);
}

.cancel-btn,
.reject-confirm-btn,
.event-btn {
  padding: var(--space-lg) var(--space-xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-base);
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  min-height: 44px;
}

.cancel-btn {
  background: rgba(100, 116, 139, 0.3);
  color: var(--color-text-secondary);
  border-color: rgba(100, 116, 139, 0.3);
}

.cancel-btn:hover {
  background: rgba(100, 116, 139, 0.5);
  color: var(--color-text-primary);
  transform: translateY(-1px);
}

.reject-confirm-btn {
  background: linear-gradient(135deg, var(--color-danger), var(--color-danger-dark));
  color: var(--color-text-primary);
  border-color: rgba(255, 99, 71, 0.4);
}

.reject-confirm-btn:hover:not(:disabled) {
  box-shadow: 0 8px 25px rgba(255, 99, 71, 0.5);
  transform: translateY(-1px);
}

.reject-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.event-btn {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  color: var(--color-text-primary);
  border-color: rgba(147, 112, 219, 0.4);
}

.event-btn:hover {
  box-shadow: 0 8px 25px rgba(147, 112, 219, 0.5);
  transform: translateY(-1px);
}

/* Dark theme specific modal button text colors */
[data-theme="dark"] .reject-confirm-btn,
[data-theme="dark"] .event-btn {
  color: #1A237E;
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

.btn-text-mobile {
  display: none;
}

/* Default desktop behavior */
.btn-text {
  display: inline !important;
}

.btn-text-mobile {
  display: none !important;
}

/* Desktop styles - ensure proper text display */
@media (min-width: 769px) {
  .btn-text {
    display: inline !important;
  }

  .btn-text-mobile {
    display: none !important;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .invitation-container {
    padding: var(--space-lg);
  }

  .form-header {
    padding: var(--space-2xl);
  }

  .guest-item {
    padding: var(--space-xl);
  }

  .guest-header {
    flex-direction: column;
    gap: var(--space-md);
  }

  .desktop-remove {
    display: none;
  }

  .mobile-remove-container {
    display: block;
  }

  .kid-fields {
    grid-template-columns: 1fr;
  }

  .form-buttons {
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
  }

  .reject-btn,
  .confirm-btn,
  .add-guest-btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .btn-text {
    display: none !important;
  }

  .btn-text-mobile {
    display: block !important;
  }

  .modal-content {
    margin: var(--space-lg);
  }

  .modal-actions {
    flex-direction: column;
    align-items: center;
  }

  .cancel-btn,
  .reject-confirm-btn,
  .event-btn {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .invitation-container {
    padding: var(--space-md);
  }

  .form-header {
    padding: var(--space-xl);
  }

  .guest-item {
    padding: var(--space-lg);
  }

  .guest-fields {
    gap: var(--space-md);
  }
}

/* Responsive Icon System */
.icon-responsive {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-xs {
  width: 1rem;
  height: 1rem;
}

/* Responsive Text System */
.btn-text {
  display: inline;
}

/* Draft Mode Indicator */
.draft-indicator {
  margin: 1rem 0;
}

/* Modal guest summary */
.guest-summary {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.guest-summary ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.guest-summary li {
  margin-bottom: 0.25rem;
}

.location-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  font-weight: normal;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
