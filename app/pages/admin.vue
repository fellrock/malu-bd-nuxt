<template>
  <div class="admin-container">
    <div class="header">
      <h1 class="title">Admin - Lista de Convidados</h1>
      <p class="subtitle">Maria Luiza 4 Anos</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ stats.totalGuests }}</div>
        <div class="stat-label">Total de Convidados</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.totalPeople }}</div>
        <div class="stat-label">Total de Pessoas</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.withDietary }}</div>
        <div class="stat-label">Com Restrições</div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header">
        <h2>Lista de Confirmações</h2>
        <button @click="refreshData" class="refresh-btn" :disabled="loading">
          {{ loading ? 'Atualizando...' : '🔄 Atualizar' }}
        </button>
      </div>
      
      <div v-if="loading" class="loading">
        Carregando dados...
      </div>

      <div v-else-if="guests.length === 0" class="empty-state">
        Nenhuma confirmação ainda.
      </div>

      <div v-else class="table-wrapper">
        <table class="guests-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Código</th>
              <th>Pessoas</th>
              <th>Restrições</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in guests" :key="guest.id" class="guest-row">
              <td class="name-cell">{{ guest.name }}</td>
              <td class="email-cell">{{ guest.email }}</td>
              <td class="code-cell">
                <span class="invite-code">{{ guest.inviteCode }}</span>
              </td>
              <td class="guests-cell">{{ guest.plusOnes + 1 }}</td>
              <td class="dietary-cell">
                <span v-if="guest.dietary" class="dietary-tag">{{ guest.dietary }}</span>
                <span v-else class="no-dietary">-</span>
              </td>
              <td class="date-cell">{{ formatDate(guest.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Data
const guests = ref([])
const loading = ref(true)

// Computed stats
const stats = computed(() => {
  const totalGuests = guests.value.length
  const totalPeople = guests.value.reduce((sum, guest) => sum + guest.plusOnes + 1, 0)
  const withDietary = guests.value.filter(guest => guest.dietary).length
  
  return {
    totalGuests,
    totalPeople,
    withDietary
  }
})

// Methods
const fetchGuests = async () => {
  try {
    loading.value = true
    const data = await $fetch('/api/guests')
    guests.value = data.guests || []
  } catch (error) {
    console.error('Error fetching guests:', error)
    alert('Erro ao carregar dados dos convidados')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchGuests()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  fetchGuests()
})

// Page meta
useHead({
  title: 'Admin - Maria Luiza 4 Anos'
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #2d3748 100%);
  padding: 2rem 1rem;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  opacity: 0.8;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
}

.stat-value {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #81e6d9, #90cdf4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}

.stat-label {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.guests-section {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background: linear-gradient(45deg, #a78bfa, #f093fb);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.guests-list {
  display: grid;
  gap: 1rem;
}

.guest-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.guest-card:hover {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
  transform: translateX(5px);
}

.guest-name {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.guest-details {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.25rem 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.invite-code {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  background: linear-gradient(145deg, rgba(129, 230, 217, 0.2), rgba(144, 205, 244, 0.2));
  color: #81e6d9;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(129, 230, 217, 0.3);
  display: inline-block;
  margin-top: 0.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.loading-spinner {
  font-size: 2rem;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  display: block;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(145deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1));
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 107, 0.3);
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: #ff6b6b;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
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
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  margin: 2rem auto 0;
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
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.95));
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .container {
    padding: 1rem 0.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .guests-section {
    padding: 2rem;
  }
  
  .guest-card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .guests-section {
    padding: 1.5rem;
  }
  
  .nav-button {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
}
</style>
