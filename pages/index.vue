<template>
  <div class="container">
    <div class="content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">
          🎉 Maria Luiza faz 4 aninhos! 🎂
        </h1>
        <p class="date">
          30 de Agosto de 2025 • 10h às 14h
        </p>
      </div>

      <!-- Countdown -->
      <div class="countdown-card">
        <h2 class="countdown-title">
          Contagem Regressiva
        </h2>
        <div class="countdown-display">
          <div class="countdown-time">
            {{ timeLeft }}
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="cta-section">
        <button @click="goToRsvp" class="cta-button">
          ✨ Confirmar Presença ✨
        </button>
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
  background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
  padding: 2rem;
}

.content {
  max-width: 64rem;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #5b21b6;
  margin-bottom: 1rem;
}

.date {
  font-size: 1.25rem;
  color: #7c3aed;
  margin-bottom: 1.5rem;
}

.countdown-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.countdown-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: #6d28d9;
  margin-bottom: 1rem;
}

.countdown-display {
  text-align: center;
}

.countdown-time {
  font-size: 1.875rem;
  font-weight: bold;
  color: #7c3aed;
}

.cta-section {
  text-align: center;
}

.cta-button {
  background: #7c3aed;
  color: white;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.cta-button:hover {
  background: #6d28d9;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .title {
    font-size: 1.875rem;
  }
  
  .date {
    font-size: 1rem;
  }
  
  .countdown-time {
    font-size: 1.5rem;
  }
}
</style>
