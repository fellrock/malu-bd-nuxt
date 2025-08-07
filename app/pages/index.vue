
<template>
  <div class="landing-container">
    <div class="landing-content">
      <!-- Hero Section -->
      <div class="hero-section mb-6xl animate-fadeInUp">
        <div class="hero-header mb-3xl">
          <IdentificationIcon class="hero-icon animate-sparkle" style="width: 3rem; height: 3rem;" />
          <h1 class="hero-title mt-lg mb-md">Sistema de Gestão de Eventos</h1>
          <p class="hero-subtitle mb-xl">
            Uma solução completa para gerenciar convites, confirmações e celebrações especiais
          </p>
        </div>
        <div class="hero-demo glass-card mb-3xl animate-fadeInScale stagger-2">
          <div class="demo-card">
            <HeartIcon class="demo-icon animate-magicFloat" style="width: 2rem; height: 2rem;" />
            <h3 class="mb-md">Inspirado pelo Amor</h3>
            <p class="mb-lg">Este projeto nasceu da necessidade de organizar a festa de 4 anos da minha filha, Maria Luiza</p>
            <div class="demo-info">
              <p>Uma solução desenvolvida com carinho para momentos especiais</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Features Section -->
      <div class="features-section mb-5xl animate-fadeInUp stagger-3">
        <h2 class="features-title mb-3xl">Funcionalidades Principais</h2>
        <div class="features-grid">
          <div class="feature-card glass-card animate-fadeInScale stagger-1">
            <QrCodeIcon class="feature-icon mb-md" style="width: 2rem; height: 2rem;" />
            <h3 class="mb-md">Códigos de Convite</h3>
            <p>Sistema único de códigos de 6 dígitos para controle de acesso e confirmações personalizadas</p>
          </div>
          <div class="feature-card glass-card animate-fadeInScale stagger-2">
            <ClipboardDocumentCheckIcon class="feature-icon mb-md" style="width: 2rem; height: 2rem;" />
            <h3 class="mb-md">RSVP Inteligente</h3>
            <p>Formulários de confirmação com validação, informações sobre crianças e restrições alimentares</p>
          </div>
          <div class="feature-card glass-card animate-fadeInScale stagger-3">
            <ChartBarIcon class="feature-icon mb-md" style="width: 2rem; height: 2rem;" />
            <h3 class="mb-md">Dashboard Admin</h3>
            <p>Visão completa das confirmações, estatísticas em tempo real e gestão de convidados</p>
          </div>
          <div class="feature-card glass-card animate-fadeInScale stagger-4">
            <PhotoIcon class="feature-icon mb-md" style="width: 2rem; height: 2rem;" />
            <h3 class="mb-md">Compartilhamento</h3>
            <p>Sistema de álbum de fotos protegido por código de convite e informações do evento</p>
          </div>
        </div>
      </div>
      
      <!-- Tech Stack Section -->
      <div class="tech-section mb-5xl animate-fadeInUp stagger-4">
        <h2 class="tech-title mb-3xl">Tecnologias Utilizadas</h2>
        <div class="tech-grid">
          <div class="tech-item animate-slideInRight stagger-1">
            <CodeBracketIcon style="width: 1.5rem; height: 1.5rem;" />
            <span>Nuxt 4.0</span>
          </div>
          <div class="tech-item animate-slideInRight stagger-2">
            <CircleStackIcon style="width: 1.5rem; height: 1.5rem;" />
            <span>PostgreSQL</span>
          </div>
          <div class="tech-item animate-slideInRight stagger-3">
            <CubeIcon style="width: 1.5rem; height: 1.5rem;" />
            <span>Prisma ORM</span>
          </div>
          <div class="tech-item animate-slideInRight stagger-4">
            <PaintBrushIcon style="width: 1.5rem; height: 1.5rem;" />
            <span>Nuxt UI</span>
          </div>
        </div>
      </div>
      
      <!-- Project & Company Links -->
      <div class="project-section animate-fadeInUp stagger-5">
        <h2 class="project-title mb-3xl">Sobre o Projeto</h2>
        <div class="project-links">
          <a href="https://github.com/fellrock/malu-bd-nuxt" target="_blank" class="project-link glass-card">
            <CodeBracketSquareIcon style="margin-right: 0.5rem; width: 1.2rem; height: 1.2rem;" />
            <span>Código Fonte no GitHub</span>
            <ArrowTopRightOnSquareIcon style="margin-left: 0.5rem; width: 0.8rem; height: 0.8rem;" />
          </a>
          <a href="https://kravela.cloud" target="_blank" class="project-link glass-card">
            <GlobeAltIcon style="margin-right: 0.5rem; width: 1.2rem; height: 1.2rem;" />
            <span>Kravela Cloud</span>
            <ArrowTopRightOnSquareIcon style="margin-left: 0.5rem; width: 0.8rem; height: 0.8rem;" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IdentificationIcon,
  HeartIcon,
  QrCodeIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  PhotoIcon,
  CodeBracketIcon,
  CircleStackIcon,
  CubeIcon,
  PaintBrushIcon,
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
  CodeBracketSquareIcon
} from '@heroicons/vue/24/solid';
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: var(--gradient-background);
  padding: var(--space-3xl) var(--space-lg);
  position: relative;
  overflow: hidden;
}

.landing-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-background);
  opacity: 0.9;
  z-index: -1;
}

.landing-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-section {
  text-align: center;
}

.hero-header {
  text-align: center;
}

.hero-icon {
  color: var(--color-primary);
  filter: drop-shadow(0 4px 12px rgba(255, 105, 180, 0.4));
  transition: var(--transition-base);
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--color-text-primary);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 500;
}

.hero-demo {
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-2xl);
}

.demo-card {
  text-align: center;
}

.demo-icon {
  color: var(--color-accent);
  filter: drop-shadow(0 2px 8px rgba(255, 215, 0, 0.4));
  transition: var(--transition-base);
}

.demo-card h3 {
  color: var(--color-text-primary);
  font-size: var(--text-xl);
  font-weight: 600;
}

.demo-card p {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.demo-info p {
  color: var(--color-text-tertiary);
  font-style: italic;
  font-size: var(--text-sm);
}

.features-section {
  text-align: center;
}

.features-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--color-text-primary);
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-2xl);
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  padding: var(--space-2xl);
  text-align: center;
  transition: var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  color: var(--color-accent);
  filter: drop-shadow(0 4px 12px rgba(255, 215, 0, 0.4));
  transition: var(--transition-base);
}

.feature-card h3 {
  color: var(--color-text-primary);
  font-size: var(--text-xl);
  font-weight: 600;
}

.feature-card p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: var(--text-base);
}

.tech-section {
  text-align: center;
}

.tech-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--color-text-primary);
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
  max-width: 800px;
  margin: 0 auto;
}

.tech-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-surface);
  backdrop-filter: var(--glass-backdrop);
  border: var(--border-glass);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-weight: 500;
  transition: var(--transition-base);
  box-shadow: var(--shadow-md);
}

.tech-item:hover {
  background: var(--color-surface-elevated);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.project-section {
  text-align: center;
}

.project-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--color-text-primary);
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.project-links {
  display: flex;
  gap: var(--space-xl);
  justify-content: center;
  flex-wrap: wrap;
}

.project-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-2xl);
  color: var(--color-text-primary);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: var(--transition-base);
  font-weight: 500;
  box-shadow: var(--shadow-md);
}

.project-link:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  color: var(--color-text-primary);
  text-decoration: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .landing-container {
    padding: var(--space-xl) var(--space-md);
  }

  .project-links {
    flex-direction: column;
    align-items: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .project-links {
    gap: var(--space-md);
  }
}

/* Accessibility and motion preferences */
@media (prefers-reduced-motion: reduce) {
  .feature-card:hover,
  .tech-item:hover,
  .project-link:hover {
    transform: none;
  }
  
  .animate-fadeInUp,
  .animate-fadeInScale,
  .animate-slideInRight,
  .animate-sparkle,
  .animate-magicFloat {
    animation: none;
  }
}
</style>
