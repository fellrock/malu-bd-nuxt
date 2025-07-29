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
              class="input"
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
              {{ loading ? 'Enviando...' : '💜 Confirmar Presença' }}
            </button>
            
            <button 
              type="button"
              @click="goHome"
              class="back-btn"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="modal-overlay">
        <div class="modal">
          <div class="modal-content">
            <div class="success-icon">✅</div>
            <h3 class="modal-title">Presença Confirmada!</h3>
            <p class="modal-text">
              Obrigado por confirmar! Estamos muito felizes em saber que você estará conosco.
            </p>
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success
    showSuccess.value = true
    
    // Reset form
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    
  } catch (error) {
    alert('Erro ao enviar. Tente novamente.')
  } finally {
    loading.value = false
  }
}

// Navigation
const goHome = () => {
  showSuccess.value = false
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
  background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
  padding: 2rem;
}

.content {
  max-width: 48rem;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #5b21b6;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #7c3aed;
}

.form-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.textarea {
  resize: vertical;
  min-height: 5rem;
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}

.submit-btn {
  flex: 1;
  background: #7c3aed;
  color: white;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #6d28d9;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #f9fafb;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 28rem;
  width: 100%;
}

.modal-content {
  text-align: center;
}

.success-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.modal-text {
  color: #6b7280;
  margin-bottom: 1rem;
}

.modal-btn {
  background: #7c3aed;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-btn:hover {
  background: #6d28d9;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .buttons {
    flex-direction: column;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style>
