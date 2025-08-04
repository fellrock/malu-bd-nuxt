<template>
  <div class="redirect-container">
    <div class="loading-content">
      <div class="spinner"></div>
      <h2>Verificando convite...</h2>
      <p>Redirecionando para a página correta...</p>
    </div>
    
    <!-- Creator Reference -->
    <div class="creator-reference">
      <p>Desenvolvido por <a href="https://www.kravela.cloud" target="_blank" rel="noopener noreferrer">Kravela Cloud LTDA</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define page meta for automatic redirection
definePageMeta({
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    
    if (inviteCode) {
      try {
        const res: any = await $fetch(`/api/guest-code/${inviteCode}`)
        
        if (res.success && res.guests.length > 0) {
          const hasConfirmedGuests = res.guests.some((guest: any) => guest.status === 'CONFIRMED')
          
          if (hasConfirmedGuests) {
            // If any guest is confirmed, redirect to event page
            return navigateTo(`/evento/${inviteCode}`, { replace: true })
          } else {
            // If no guests are confirmed (all registered), redirect to invitation page
            return navigateTo(`/convite/${inviteCode}`, { replace: true })
          }
        } else {
          // If no guests found, redirect to access denied page
          return navigateTo('/acesso-negado', { replace: true })
        }
      } catch (err: any) {
        console.error('Error in redirect middleware:', err)
        // On API error (404, etc.), redirect to access denied page
        if (err.statusCode === 404) {
          return navigateTo('/acesso-negado', { replace: true })
        } else {
          // For other errors, redirect to invitation page to handle error state
          return navigateTo(`/convite/${inviteCode}`, { replace: true })
        }
      }
    }
    
    // If no invite code, redirect to home
    return navigateTo('/', { replace: true })
  }
})

// This component will rarely be seen since middleware redirects immediately
// But we include it for loading state during the redirect process
useHead({
  title: 'Redirecionando...'
})
</script>

<style scoped>
.redirect-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1E293B, #334155, #475569);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-content {
  text-align: center;
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000020;
  max-width: 400px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #64748B40;
  border-top: 4px solid #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #F8FAFC;
  text-shadow: 0 2px 10px #00000040;
}

p {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: #CBD5E1;
  margin: 0;
  line-height: 1.6;
}

.creator-reference {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
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
