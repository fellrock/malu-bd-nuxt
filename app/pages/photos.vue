<template>
  <div class="photos-container">
    <div class="header">
      <h1 class="title">📸 Galeria de Fotos</h1>
      <p class="subtitle">Maria Luiza 4 Anos - Compartilhe suas memórias!</p>
    </div>

    <!-- Invite Code Gate -->
    <div v-if="!hasAccess" class="access-gate">
      <div class="access-card">
        <h2>🔐 Acesso Restrito</h2>
        <p>Digite seu código de convite para acessar a galeria de fotos:</p>
        
        <form @submit.prevent="checkAccess" class="access-form">
          <input 
            v-model="inviteCode" 
            type="text" 
            placeholder="Digite seu código de 6 dígitos"
            class="code-input"
            maxlength="6"
            :disabled="loading"
          />
          <button type="submit" class="access-btn" :disabled="loading || inviteCode.length !== 6">
            {{ loading ? 'Verificando...' : 'Acessar Galeria' }}
          </button>
        </form>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>

    <!-- Photo Gallery Content -->
    <div v-else class="gallery-content">
      <div class="info-section">
        <div class="info-card">
          <h2>📷 Como Compartilhar suas Fotos</h2>
          <div class="instructions">
            <div class="step">
              <span class="step-number">1</span>
              <div class="step-content">
                <h3>Acesse o Álbum Compartilhado</h3>
                <p>Clique no link abaixo para acessar nosso álbum do Google Photos:</p>
                <a href="https://photos.app.goo.gl/maria-luiza-4anos" target="_blank" class="album-link">
                  🔗 Álbum: Maria Luiza 4 Anos
                </a>
              </div>
            </div>

            <div class="step">
              <span class="step-number">2</span>
              <div class="step-content">
                <h3>Adicione suas Fotos</h3>
                <p>Você pode adicionar suas fotos diretamente ao álbum compartilhado. Todas as fotos serão visíveis para outros convidados.</p>
              </div>
            </div>

            <div class="step">
              <span class="step-number">3</span>
              <div class="step-content">
                <h3>Respeite a Privacidade</h3>
                <p>Por favor, apenas adicione fotos do evento e respeite a privacidade de todos os participantes.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h2>📱 Alternativas para Compartilhar</h2>
          <div class="alternatives">
            <div class="alternative">
              <h3>WhatsApp</h3>
              <p>Envie suas fotos no grupo da festa:</p>
              <a href="https://chat.whatsapp.com/maria-luiza-festa" target="_blank" class="whatsapp-link">
                💬 Grupo WhatsApp
              </a>
            </div>
            
            <div class="alternative">
              <h3>Email</h3>
              <p>Envie por email para:</p>
              <a href="mailto:fotos@marialuiza4anos.com" class="email-link">
                📧 fotos@marialuiza4anos.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="privacy-notice">
        <h3>🔒 Aviso de Privacidade</h3>
        <p>As fotos compartilhadas serão visíveis apenas para convidados com código de acesso. Respeitamos sua privacidade e seguimos as diretrizes da LGPD.</p>
      </div>

      <div class="navigation">
        <a href="/" class="nav-button">
          🏠 Voltar ao Início
        </a>
        <a href="/gifts" class="nav-button">
          🎁 Ver Lista de Presentes
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Reactive state
const hasAccess = ref(false)
const inviteCode = ref('')
const loading = ref(false)
const error = ref('')

// Check access with invite code
async function checkAccess() {
  if (inviteCode.value.length !== 6) {
    error.value = 'O código deve ter 6 dígitos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response: any = await $fetch(`/api/guest-code/${inviteCode.value}`)
    if (response.success) {
      hasAccess.value = true
      // Store access in session/localStorage for persistence
      if (process.client) {
        sessionStorage.setItem('photoAccess', 'true')
        sessionStorage.setItem('guestCode', inviteCode.value)
      }
    } else {
      error.value = 'Código inválido. Verifique seu convite.'
    }
  } catch (err) {
    error.value = 'Erro ao verificar código. Tente novamente.'
    console.error('Access check error:', err)
  } finally {
    loading.value = false
  }
}

// Check if user already has access from session
onMounted(() => {
  if (process.client) {
    const hasSessionAccess = sessionStorage.getItem('photoAccess')
    if (hasSessionAccess === 'true') {
      hasAccess.value = true
    }
  }
})

// SEO and page title
useHead({
  title: 'Galeria de Fotos - Maria Luiza 4 Anos',
  meta: [
    { name: 'description', content: 'Compartilhe suas fotos da festa de 4 anos da Maria Luiza' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
/* Main Container */
.photos-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667EEA, #764BA2, #F093FB, #F5576C);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #FFFFFF, #F0F8FF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: -1px;
}

.subtitle {
  font-weight: 600;
  margin: 0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Access Gate */
.access-gate {
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
}

.access-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 100%;
}

.access-card h2 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.access-card p {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.access-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.code-input {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
  letter-spacing: 0.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.code-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: normal;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  font-weight: normal;
}

.code-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
}

.access-btn {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

.access-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
}

.access-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #FCA5A5;
  font-weight: 600;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Gallery Content */
.gallery-content {
  width: 100%;
  max-width: 1200px;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.info-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.info-card h2 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.instructions {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.step-content h3 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: white;
}

.step-content p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.album-link, .whatsapp-link, .email-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.album-link:hover, .whatsapp-link:hover, .email-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
}

.whatsapp-link {
  background: linear-gradient(135deg, #25D366, #128C7E);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
}

.whatsapp-link:hover {
  box-shadow: 0 12px 30px rgba(37, 211, 102, 0.4);
}

.email-link {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.email-link:hover {
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.4);
}

.alternatives {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.alternative h3 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: white;
}

.alternative p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.privacy-notice {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 3rem;
  text-align: center;
}

.privacy-notice h3 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: white;
}

.privacy-notice p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-button {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  color: #4a5568;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s;
}

.nav-button:hover::before {
  left: 100%;
}

.nav-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.95));
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .photos-container {
    padding: 1rem 0.5rem;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .access-card {
    padding: 2rem;
  }
  
  .info-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .info-card {
    padding: 2rem;
  }
  
  .step {
    flex-direction: column;
    text-align: center;
  }
  
  .navigation {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
  
  .access-card {
    padding: 1.5rem;
  }
  
  .access-card h2 {
    font-size: 1.5rem;
  }
  
  .info-card {
    padding: 1.5rem;
  }
  
  .nav-button {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
}
</style>
