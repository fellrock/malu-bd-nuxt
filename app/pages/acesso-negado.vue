<template>
  <div class="access-denied-container">
    <div class="error-content">
      <div class="error-icon">🚫</div>
      <h1 class="error-title">Acesso Negado</h1>
      <h2 class="error-subtitle">Código de Convite Inválido</h2>
      
      <div class="error-message">
        <p>Desculpe, mas você não tem acesso às informações desta aplicação.</p>
        <p>Isso pode acontecer por alguns motivos:</p>
        
        <ul class="error-reasons">
          <li>O código de convite está incorreto ou não existe</li>
          <li>O link pode ter sido digitado incorretamente</li>
          <li>O convite pode ter expirado ou sido cancelado</li>
        </ul>
        
        <div class="help-section">
          <h3>O que fazer?</h3>
          <p>Entre em contato com quem enviou o convite para verificar:</p>
          <ul>
            <li>Se o código está correto</li>
            <li>Se o link foi copiado completamente</li>
            <li>Se o convite ainda está válido</li>
          </ul>
        </div>
      </div>
            
      <CreatorReference containerClass="on-colored-bg" />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

function goHome() {
  router.push('/')
}

useHead({
  title: 'Acesso Negado - Convite Inválido',
})
</script>

<style scoped>
.access-denied-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1E293B, #334155, #475569);
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000020;
  max-width: 600px;
  width: 100%;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: #F87171;
  text-shadow: 0 4px 20px #00000040;
  letter-spacing: -1px;
}

.error-subtitle {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 2rem 0;
  color: #F8FAFC;
  text-shadow: 0 2px 10px #00000040;
}

.error-message {
  text-align: left;
  color: #E2E8F0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.error-message p {
  margin-bottom: 1rem;
}

.error-reasons {
  background: #64748B15;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  border-left: 4px solid #F87171;
}

.error-reasons li {
  margin-bottom: 0.5rem;
}

.help-section {
  background: #64748B15;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-left: 4px solid #3B82F6;
}

.help-section h3 {
  color: #F8FAFC;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.help-section ul {
  margin: 0.5rem 0 0 0;
}

.help-section li {
  margin-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.home-btn {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: #FFFFFF;
  border: 1px solid #60A5FA40;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.home-btn:hover {
  background: linear-gradient(135deg, #2563EB, #1E40AF);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #3B82F640;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .access-denied-container {
    padding: 1rem 0.5rem;
  }
  
  .error-content {
    padding: 2rem 1.5rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-subtitle {
    font-size: 1.3rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .home-btn {
    width: 100%;
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .error-title {
    font-size: 1.8rem;
  }
  
  .error-subtitle {
    font-size: 1.2rem;
  }
  
  .error-content {
    padding: 1.5rem 1rem;
  }
}
</style>
