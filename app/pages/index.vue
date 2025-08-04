
<template>
  <div class="landing-container">
    <div class="landing-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-header">
          <IdentificationIcon class="hero-icon" style="width: 3rem; height: 3rem;" />
          <h1 class="hero-title">Sistema de Gestão de Eventos</h1>
          <p class="hero-subtitle">
            Uma solução completa para gerenciar convites, confirmações e celebrações especiais
          </p>
        </div>
        <div class="hero-demo ui-card">
          <div class="demo-card">
            <HeartIcon class="demo-icon" style="width: 2rem; height: 2rem;" />
            <h3>Inspirado pelo Amor</h3>
            <p>Este projeto nasceu da necessidade de organizar a festa de 4 anos da minha filha, Maria Luiza</p>
            <div class="demo-info">
              <p>Uma solução desenvolvida com carinho para momentos especiais</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Features Section -->
      <div class="features-section">
        <h2 class="features-title">Funcionalidades Principais</h2>
        <div class="features-grid">
          <div class="feature-card ui-card">
            <QrCodeIcon class="feature-icon" style="width: 2rem; height: 2rem;" />
            <h3>Códigos de Convite</h3>
            <p>Sistema único de códigos de 6 dígitos para controle de acesso e confirmações personalizadas</p>
          </div>
          <div class="feature-card ui-card">
            <ClipboardDocumentCheckIcon class="feature-icon" style="width: 2rem; height: 2rem;" />
            <h3>RSVP Inteligente</h3>
            <p>Formulários de confirmação com validação, informações sobre crianças e restrições alimentares</p>
          </div>
          <div class="feature-card ui-card">
            <ChartBarIcon class="feature-icon" style="width: 2rem; height: 2rem;" />
            <h3>Dashboard Admin</h3>
            <p>Visão completa das confirmações, estatísticas em tempo real e gestão de convidados</p>
          </div>
          <div class="feature-card ui-card">
            <PhotoIcon class="feature-icon" style="width: 2rem; height: 2rem;" />
            <h3>Compartilhamento</h3>
            <p>Sistema de álbum de fotos protegido por código de convite e informações do evento</p>
          </div>
        </div>
      </div>
      <!-- Tech Stack Section -->
      <div class="tech-section">
        <h2 class="tech-title">Tecnologias Utilizadas</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <CodeBracketIcon style="width: 1.5rem; height: 1.5rem;" />
            <span>Nuxt 3.0</span>
          </div>
          <div class="tech-item">
            <CircleStackIcon style="width: 1.5rem; height: 1.5rem;" />
            <span>PostgreSQL</span>
          </div>
          <div class="tech-item">
            <CubeIcon style="width: 1.5rem; height: 1.5rem;" />
            <span>Prisma ORM</span>
          </div>
          <div class="tech-item">
            <PaintBrushIcon style="width: 1.5rem; height: 1.5rem;" />
            <span>Nuxt UI</span>
          </div>
        </div>
      </div>
      <!-- Project & Company Links -->
      <div class="project-section">
        <h2 class="project-title">Sobre o Projeto</h2>
        <div class="project-links">
          <a href="https://github.com/fellrock/malu-bd-nuxt" target="_blank" class="project-link">
            <CodeBracketSquareIcon style="margin-right: 0.5rem; width: 1.2rem; height: 1.2rem;" />
            <span>Código Fonte no GitHub</span>
            <ArrowTopRightOnSquareIcon style="margin-left: 0.5rem; width: 0.8rem; height: 0.8rem;" />
          </a>
          <a href="https://kravela.cloud" target="_blank" class="project-link">
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.landing-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-header {
  margin-bottom: 2rem;
}

.hero-icon {
  color: #ffffff;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #e0e7ff;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.hero-demo {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.demo-card {
  text-align: center;
}

.demo-icon {
  color: #fbbf24;
  margin-bottom: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.demo-card h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.demo-card p {
  color: #e0e7ff;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.demo-info p {
  color: #c7d2fe;
  font-style: italic;
}

.features-section {
  margin-bottom: 4rem;
}

.features-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  color: #fbbf24;
  margin-bottom: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.feature-card h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature-card p {
  color: #e0e7ff;
  line-height: 1.6;
}

.tech-section {
  margin-bottom: 4rem;
}

.tech-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.tech-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: #ffffff;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.tech-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.project-section {
  margin-bottom: 4rem;
}

.project-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.project-links {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.project-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  text-decoration: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .landing-container {
    padding: 1rem 0.5rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .features-title,
  .tech-title,
  .project-title {
    font-size: 2rem;
  }

  .project-links {
    flex-direction: column;
    align-items: center;
  }

  .hero-demo,
  .feature-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .features-title,
  .tech-title,
  .project-title {
    font-size: 1.75rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
