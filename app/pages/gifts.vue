<template>
  <div class="container">
    <div class="content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">
          🎁 Presentes para Maria Luiza
        </h1>
        <div class="emoji-decoration">🎁 💝 🎁</div>
      </div>

      <!-- Main Message -->
      <div class="intro-card">
        <p class="intro-text">
          Maria Luiza está muito animada para comemorar com todos os amigos e familiares queridos. 
          <span class="emphasis">Sua presença na festa é o presente mais valioso</span> que ela pode receber.
        </p>
      </div>

      <!-- Optional Gifts Section -->
      <div class="categories-grid">
        <div class="category-card">
          <div class="category-icon">📚</div>
          <h4 class="category-title">Livros Infantis</h4>
          <ul class="category-list">
            <li class="category-item">Livros de histórias</li>
            <li class="category-item">Contos de fada</li>
            <li class="category-item">Livros educativos</li>
          </ul>
        </div>

        <div class="category-card">
          <div class="category-icon">🧸</div>
          <h4 class="category-title">Brinquedos</h4>
          <ul class="category-list">
            <li class="category-item">Quebra-cabeças</li>
            <li class="category-item">Jogos educativos</li>
            <li class="category-item">Bonecas e bichinhos</li>
          </ul>
        </div>

        <div class="category-card">
          <div class="category-icon">🎨</div>
          <h4 class="category-title">Material de Arte</h4>
          <ul class="category-list">
            <li class="category-item">Lápis de cor</li>
            <li class="category-item">Tintas e pincéis</li>
            <li class="category-item">Cadernos de desenho</li>
          </ul>
        </div>

        <div class="category-card">
          <div class="category-icon">👗</div>
          <h4 class="category-title">Roupas</h4>
          <ul class="category-list">
            <li class="category-item">Vestidos infantis (tam. 4)</li>
            <li class="category-item">Conjuntinhos</li>
            <li class="category-item">Acessórios para cabelo</li>
          </ul>
        </div>
      </div>

      <!-- Closing Message -->
      <div class="closing-card">
        <p class="closing-text">
          Lembre-se: o mais importante é celebrarmos juntos esse momento especial! 
          <span class="heart-decoration">💕</span>
        </p>
      </div>

      <!-- Navigation -->
      <div class="navigation">
        <button @click="goHome" class="nav-button">
          <span class="button-icon">🏠</span>
          Voltar ao Início
        </button>
      </div>
      
      <!-- Creator Reference -->
      <div class="creator-reference">
        <p>Desenvolvido por <a href="https://www.kravela.cloud" target="_blank" rel="noopener noreferrer">Kravela Cloud LTDA</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define page meta for access control
definePageMeta({
  middleware: async (to) => {
    // Check if user has a confirmed invitation code in query params or cookies
    const route = useRoute()
    const inviteCode = route.query.code as string || useCookie('confirmedCode').value
    
    if (inviteCode) {
      try {
        const res: any = await $fetch(`/api/guest-code/${inviteCode}`)
        if (res.success && res.guests.length > 0) {
          const hasConfirmedGuests = res.guests.some((guest: any) => guest.status === 'CONFIRMED')
          
          if (hasConfirmedGuests) {
            // User has confirmed access, allow access to gifts page
            return
          }
        }
      } catch (err: any) {
        console.error('Error checking access:', err)
      }
    }
    
    // If no confirmed access, redirect to access denied page
    return navigateTo('/acesso-negado', { replace: true })
  }
})

// Navigation functions
const goHome = () => {
  navigateTo('/')
}

const goToRsvp = () => {
  navigateTo('/rsvp')
}

// Page meta
useHead({
  title: 'Presentes - Maria Luiza 4 Anos',
  meta: [
    { name: 'description', content: 'Informações sobre presentes para a festa de 4 anos da Maria Luiza' }
  ]
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem 1rem;
}

.content {
  max-width: 800px;
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
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.emoji-decoration {
  font-size: 2rem;
  margin: 1rem 0;
  display: block;
}

.intro-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.intro-text {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1.6;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 0;
}

.emphasis {
  font-weight: 700;
  color: #fff3cd;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.category-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 35px 70px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
  text-align: center;
}

.category-title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-item {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  color: white;
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.category-item:before {
  content: '•';
  color: #ff6b6b;
  font-weight: bold;
  position: absolute;
  left: 0;
  font-size: 1.2rem;
}

.closing-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.closing-text {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.6;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 0 0 1.5rem 0;
}

.heart-decoration {
  font-size: 1.5rem;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.nav-button {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  color: #ff6b6b;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.nav-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.95));
}

.button-icon {
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2));
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .container {
    padding: 1rem 0.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .navigation {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

.creator-reference {
  margin-top: 2rem;
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
</style>
