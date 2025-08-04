<template>
  <div class="error-container">
    <div class="error-content">
      <!-- Error Icon -->
      <div class="error-icon">
        <UIcon v-if="error.statusCode === 404" name="i-heroicons-exclamation-triangle" class="w-24 h-24" />
        <UIcon v-else name="i-heroicons-x-circle" class="w-24 h-24" />
      </div>
      
      <!-- Error Message -->
      <div class="error-message">
        <h1 class="error-title">
          {{ error.statusCode === 404 ? '404 - Página não encontrada' : 'Erro no Sistema' }}
        </h1>
        <p class="error-description">
          {{ errorMessage }}
        </p>
      </div>
      
      <!-- Error Details (only in development) -->
      <div v-if="isDev && error.stack" class="error-details">
        <details>
          <summary>Detalhes do erro (desenvolvimento)</summary>
          <pre>{{ error.stack }}</pre>
        </details>
      </div>
      
      <!-- Action Buttons -->
      <div class="error-actions">
        <button @click="handleError" class="action-button primary">
          <UIcon name="i-heroicons-home" class="w-5 h-5" />
          Página Inicial
        </button>
        <button @click="goBack" class="action-button secondary">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          Voltar
        </button>
      </div>
      
      <!-- Project Reference -->
      <div class="project-reference">
        <p>
          <UIcon name="i-heroicons-heart" class="w-4 h-4 inline mr-1" />
          Sistema de Gestão de Eventos - 
          <a href="https://github.com/fellrock/malu-bd-nuxt" target="_blank">
            Ver projeto no GitHub
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}

const props = defineProps<Props>()

// Environment check
const isDev = process.dev

// Computed error message
const errorMessage = computed(() => {
  if (props.error.statusCode === 404) {
    return 'Ops! A página que você está procurando não foi encontrada. Ela pode ter sido movida, removida ou você digitou o endereço incorretamente.'
  }
  
  if (props.error.statusMessage) {
    return props.error.statusMessage
  }
  
  if (props.error.message) {
    return props.error.message
  }
  
  return 'Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.'
})

// Navigation functions
const handleError = async () => {
  await clearError({ redirect: '/' })
}

const goBack = () => {
  if (typeof window !== 'undefined') {
    window.history.back()
  }
}

// Page meta
useHead({
  title: computed(() => 
    props.error.statusCode === 404 
      ? '404 - Página não encontrada' 
      : 'Erro no Sistema'
  ),
  meta: [
    { 
      name: 'description', 
      content: computed(() => 
        props.error.statusCode === 404 
          ? 'Página não encontrada - Sistema de Gestão de Eventos' 
          : 'Erro no sistema - Sistema de Gestão de Eventos'
      )
    },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.1) 0%,
    rgba(220, 38, 38, 0.1) 100%
  );
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  max-width: 600px;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  padding: 3rem 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Error Icon */
.error-icon {
  margin-bottom: 2rem;
}

.error-icon svg {
  color: #ef4444;
}

/* Error Message */
.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.error-description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

/* Error Details */
.error-details {
  text-align: left;
  margin-bottom: 2rem;
  background: rgba(239, 68, 68, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.error-details pre {
  background: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #374151;
  margin-top: 0.5rem;
}

/* Action Buttons */
.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
}

.action-button.primary {
  background: #ef4444;
  color: white;
}

.action-button.primary:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.action-button.secondary {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.action-button.secondary:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
}

/* Project Reference */
.project-reference {
  border-top: 1px solid rgba(239, 68, 68, 0.1);
  padding-top: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.project-reference a {
  color: #ef4444;
  text-decoration: none;
  font-weight: 500;
}

.project-reference a:hover {
  text-decoration: underline;
}

.project-reference svg {
  color: #ef4444;
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-content {
    padding: 2rem 1.5rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .error-container {
    padding: 1rem;
  }
  
  .error-content {
    padding: 2rem 1rem;
  }
  
  .error-title {
    font-size: 1.75rem;
  }
}
</style>
