<template>
  <div class="container">
    <div class="content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">
          Maria Luiza faz 4 aninhos!
        </h1>
        <div class="emoji-decoration">🎉 🎂 ✨</div>
        <p class="date">
          30 de Agosto de 2025 • 10h às 14h
        </p>
      </div>

      <!-- Countdown -->
      <div class="countdown-card">
        <h2 class="countdown-title">
          ⏰ Contagem Regressiva
        </h2>
        <div class="countdown-display">
          <div class="countdown-time">
            {{ timeLeft }}
          </div>
        </div>
      </div>

      <!-- Party Details -->
      <div class="party-details">
        <h3 class="details-title">📍 Informações da Festa</h3>
        
        <div class="details-grid">
          <div class="detail-card location-card">
            <div class="detail-header">
              <span class="detail-icon">🏠</span>
              <strong>Local da Festa</strong>
            </div>
            <div class="detail-content">
              <div class="venue-name">Quintal Cores</div>
              <div class="address">
                Av. Genaro de Carvalho, 3555<br>
                Recreio - Rio de Janeiro, RJ
              </div>
            </div>
          </div>

          <div class="detail-card dress-card">
            <div class="detail-header">
              <span class="detail-icon">👕</span>
              <strong>Roupa & Diversão</strong>
            </div>
            <div class="detail-content">
              <div class="dress-info">Roupa casual e confortável</div>
              <div class="activity-info">
                🏖️ Haverá brincadeiras com <strong>água e areia</strong><br>
                💡 Traga roupas extras para as crianças!
              </div>
            </div>
          </div>

          <div class="detail-card parking-card">
            <div class="detail-header">
              <span class="detail-icon">🚗</span>
              <strong>Estacionamento</strong>
            </div>
            <div class="detail-content">
              <div class="parking-info">
                ✅ Muitas vagas disponíveis na rua<br>
                🎯 Estacionamento fácil e gratuito
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="cta-section">
        <button @click="goToRsvp" class="cta-button">
          <span class="button-icon">✨</span>
          Confirmar Presença
          <span class="button-icon">✨</span>
        </button>
        
        <!-- Secondary Actions -->
        <div class="secondary-actions">
          <button @click="goToGifts" class="secondary-btn">
            <span class="button-icon">🎁</span>
            Ideias de Presentes
          </button>
          <button @click="goToPhotos" class="secondary-btn">
            <span class="button-icon">📸</span>
            Galeria de Fotos
          </button>
        </div>
        
        <!-- Discrete admin link -->
        <div class="admin-link">
          <a href="/admin" class="admin-text">Admin</a>
        </div>
        
        <!-- Creator Reference -->
        <div class="creator-reference">
          <p>Desenvolvido por <a href="https://www.kravela.cloud" target="_blank" rel="noopener noreferrer">Kravela Cloud LTDA</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

// Simple countdown logic
const timeLeft = ref('')

const updateCountdown = () => {
  const eventDate = new Date('2025-08-30T10:00:00-03:00')
  const now = new Date()
  const diff = eventDate.getTime() - now.getTime()
  
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    timeLeft.value = `${days} dias, ${hours} horas, ${minutes} minutos`
  } else {
    timeLeft.value = "🎉 É hoje! 🎉"
  }
}

// Navigation function
const goToRsvp = () => {
  navigateTo('/rsvp')
}

const goToGifts = () => {
  navigateTo('/gifts')
}

const goToPhotos = () => {
  navigateTo('/photos')
}

// Update countdown
onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 60000) // Update every minute
})

// Page meta
useHead({
  title: 'Maria Luiza - 4 Anos',
  meta: [
    { name: 'description', content: 'Venha comemorar os 4 aninhos da Maria Luiza!' }
  ]
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  max-width: 600px;
  width: 100%;
  text-align: center;
  color: white;
}

.header {
  margin-bottom: 3rem;
}

.title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  line-height: 1.1;
}

.emoji-decoration {
  font-size: 2rem;
  margin: 1rem 0;
  animation: bounce 2s infinite;
  display: block;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.date {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  opacity: 0.95;
}

.countdown-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.countdown-title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.countdown-display {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.15));
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.countdown-time {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.party-details {
  margin-bottom: 3rem;
}

.details-title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.detail-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.detail-content {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: white;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.venue-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff3cd;
  margin-bottom: 0.5rem;
}

.address {
  font-size: 1.1rem;
  line-height: 1.4;
  opacity: 0.9;
}

.dress-info {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.activity-info {
  font-size: 1rem;
  line-height: 1.6;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #feca57;
}

.parking-info {
  font-size: 1.1rem;
  line-height: 1.6;
}

.cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.cta-button {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  color: #667eea;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.95));
}

.secondary-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.secondary-btn {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.875rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
}

.button-icon {
  font-size: 1.1em;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2));
}

.admin-link {
  margin-top: 2rem;
}

.admin-text {
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.admin-text:hover {
  opacity: 1;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.creator-reference {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.creator-reference p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.creator-reference a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.creator-reference a:hover {
  color: #ffffff;
  text-decoration: underline;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

/* Responsive styles */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .emoji-decoration {
    font-size: 1.5rem;
  }
  
  .date {
    font-size: 1.2rem;
  }
  
  .countdown-card {
    padding: 2rem;
  }
  
  .countdown-title {
    font-size: 1.5rem;
  }
  
  .countdown-time {
    font-size: 1.4rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .detail-card {
    padding: 1.5rem;
  }
  
  .detail-header {
    font-size: 1.1rem;
  }
  
  .venue-name {
    font-size: 1.2rem;
  }
  
  .cta-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
  
  .secondary-btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
  
  .date {
    font-size: 1rem;
  }
  
  .countdown-card {
    padding: 1.5rem;
  }
  
  .countdown-time {
    font-size: 1.2rem;
  }
  
  .cta-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
