<template>
  <div class="container">
    <div class="content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">
          Confirme sua Presença
        </h1>
        <p class="subtitle">
          Para os 4 aninhos da Maria Luiza
        </p>
        <div class="decoration">✨ 🎂 ✨</div>
      </div>

      <!-- Form -->
      <div class="form-card">
        <form @submit.prevent="submitForm" class="form">
          <!-- Name Field -->
          <div class="field">
            <label class="label">
              Nome Completo *
            </label>
            <input 
              v-model="form.name"
              type="text"
              required
              placeholder="Seu nome completo"
              class="input"
            />
            <span v-if="errors.name" class="error">{{ errors.name }}</span>
          </div>

          <!-- Email Field -->
          <div class="field">
            <label class="label">
              E-mail
            </label>
            <input 
              v-model="form.email"
              type="email"
              placeholder="seu@email.com"
              class="input"
            />
          </div>

          <!-- Phone Field -->
          <div class="field">
            <label class="label">
              Telefone/WhatsApp
            </label>
            <input 
              v-model="form.phone"
              type="tel"
              placeholder="(11) 99999-9999"
              class="input"
            />
          </div>

          <!-- Number of Guests -->
          <div class="field">
            <label class="label">
              Quantas pessoas virão? *
            </label>
            <select 
              v-model="form.guests"
              required
              class="input select"
            >
              <option value="">Selecione</option>
              <option value="1">1 pessoa (só eu)</option>
              <option value="2">2 pessoas</option>
              <option value="3">3 pessoas</option>
              <option value="4">4 pessoas</option>
              <option value="5">5 pessoas</option>
            </select>
          </div>

          <!-- Dietary Restrictions -->
          <div class="field">
            <label class="label">
              Restrições Alimentares
            </label>
            <textarea 
              v-model="form.dietary"
              placeholder="Alergias, intolerâncias ou restrições alimentares..."
              rows="3"
              class="input textarea"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="buttons">
            <button 
              type="submit"
              :disabled="loading"
              class="submit-btn"
            >
              <span v-if="loading" class="loading-spinner">⏳</span>
              {{ loading ? 'Enviando...' : '💜 Confirmar Presença' }}
            </button>
            
            <button 
              type="button"
              @click="goHome"
              class="back-btn"
            >
              ← Voltar
            </button>
          </div>
        </form>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="modal-overlay">
        <div class="modal">
          <div class="modal-content">
            <div class="success-icon">🎉</div>
            <h3 class="modal-title">Presença Confirmada!</h3>
            <p class="modal-text">
              Obrigado por confirmar! Estamos muito felizes em saber que você estará conosco.
            </p>
            <div v-if="successData" class="invite-code-section">
              <p class="invite-label">Seu código de convite:</p>
              <div class="invite-code">{{ successData.inviteCode }}</div>
              <p class="invite-note">Guarde este código! Ele será útil para acessar informações especiais da festa.</p>
            </div>
            <button 
              @click="goHome"
              class="modal-btn"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  guests: '',
  dietary: ''
})

// UI state
const loading = ref(false)
const showSuccess = ref(false)
const successData = ref(null)
const errors = reactive({
  name: ''
})

// Form submission
const submitForm = async () => {
  // Clear errors
  errors.name = ''
  
  // Basic validation
  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório'
    return
  }
  
  if (!form.guests) {
    alert('Por favor, selecione quantas pessoas virão')
    return
  }
  
  loading.value = true
  
  try {
    // Submit to API
    const { data } = await $fetch('/api/rsvp', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        guests: parseInt(form.guests),
        dietary: form.dietary
      }
    })
    
    // Show success with invite code
    showSuccess.value = true
    successData.value = data
    
    // Reset form
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    
  } catch (error) {
    console.error('RSVP submission error:', error)
    if (error.data) {
      alert(`Erro: ${error.data.statusMessage || 'Dados inválidos'}`)
    } else {
      alert('Erro ao enviar. Tente novamente.')
    }
  } finally {
    loading.value = false
  }
}

// Navigation
const goHome = () => {
  showSuccess.value = false
  successData.value = null
  navigateTo('/')
}

// Page meta
useHead({
  title: 'RSVP - Maria Luiza 4 Anos'
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  font-weight: 300;
  margin: 0;
  opacity: 0.9;
}

.decoration {
  font-size: 1.5rem;
  margin-top: 0.5rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.form-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.input {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
  transform: translateY(-1px);
}

.select {
  cursor: pointer;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.error {
  color: #e53e3e;
  font-size: 0.875rem;
  font-weight: 500;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.back-btn {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.modal {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: modalIn 0.4s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-content {
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out;
}

.modal-title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.modal-text {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: #4a5568;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.invite-code-section {
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border: 1px solid #e2e8f0;
}

.invite-label {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.9rem;
  color: #4a5568;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.invite-code {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #667eea;
  letter-spacing: 0.1em;
  margin: 0.5rem 0;
}

.invite-note {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.85rem;
  color: #718096;
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.modal-btn {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .container {
    padding: 0.5rem;
  }
  
  .form-card {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .buttons {
    gap: 0.75rem;
  }
  
  .submit-btn,
  .back-btn {
    padding: 0.75rem 1.5rem;
  }
  
  .modal {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>
