<template>
  <div class="cancelled-container">
    
    <!-- Header -->
    <div class="header mb-4xl animate-fadeInUp">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">
            <span class="mobile-title">💙 Obrigada, você é especial!</span>
            <span class="desktop-title">💙 Obrigada por fazer parte da nossa vida!</span>
          </h1>
          <p class="subtitle">Uma mensagem especial da família da Maria Luiza</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="message-content animate-fadeInUp">
      
      <!-- Heart Message Card -->
      <div class="heart-card glass-card animate-fadeInScale stagger-1">
        <div class="heart-icon">
          💖
        </div>
        <h2 class="heart-title">Você fará muita falta!</h2>
        <div class="heart-message">
          <p>
            Sabemos que às vezes a vida nos leva por caminhos diferentes, e entendemos completamente sua decisão. 
            Mesmo não podendo estar presente na festa da <strong>Maria Luiza</strong>, você sempre terá um lugar especial em nossos corações.
          </p>
          
          <p>
            Sua amizade e carinho significam muito para nossa família. A MaLu sempre se lembrará de você com um sorriso no rosto, 
            e nós também guardaremos com muito amor todas as memórias que construímos juntos.
          </p>
          
          <p class="highlight-message">
            ✨ <strong>Você é parte da nossa história e sempre será bem-vindo(a) em nossa casa!</strong> ✨
          </p>
        </div>
      </div>

      <!-- Maria Luiza's Card -->
      <div class="malu-card glass-card animate-fadeInScale stagger-2">
        <div class="malu-photo">
          🎂
        </div>
        <h3 class="malu-title">Da Maria Luiza para você:</h3>
        <div class="malu-message">
          <p class="child-message">
            "Titio/Titia, mesmo você não vindo na minha festa, eu te amo muito! 
            Obrigada por sempre me fazer sorrir e por todos os momentos divertidos que passamos juntos. 
            Você é muito especial para mim!" 💕
          </p>
        </div>
      </div>

      <!-- Family Message Card -->
      <div class="family-card glass-card animate-fadeInScale stagger-3">
        <div class="family-icon">
          👨‍👩‍👧
        </div>
        <h3 class="family-title">Da nossa família:</h3>
        <div class="family-message">
          <p>
            Obrigada por ter sido parte da vida da Maria Luiza até aqui. Cada sorriso, cada brincadeira, 
            cada momento compartilhado contribuiu para fazer dela a criança feliz e carinhosa que ela é hoje.
          </p>
          
          <p>
            Esperamos que a vida lhe traga muitas alegrias e que nossos caminhos se cruzem novamente em breve. 
            As portas da nossa casa estarão sempre abertas para você!
          </p>
          
          <div class="blessing">
            <p class="blessing-text">
              🙏 <em>Que Deus abençoe você e sua família sempre!</em> 🙏
            </p>
          </div>
        </div>
      </div>

      <!-- Future Memories Card -->
      <div class="future-card glass-card animate-fadeInScale stagger-4">
        <div class="future-icon">
          🌟
        </div>
        <h3 class="future-title">Até breve!</h3>
        <div class="future-message">
          <p>
            Mesmo não estando presente fisicamente na festa, você estará em nossos pensamentos e orações. 
            Esperamos que em futuras comemorações possamos estar todos juntos novamente.
          </p>
          
          <div class="contact-info">
            <p>
              Se quiser acompanhar as fotos da festa ou mandar uma mensagem para a Maria Luiza, 
              nossa família estará sempre disponível. Você faz parte da nossa história! 📸💌
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- Creator Reference Component -->
    <div class="mt-4xl animate-fadeInUp stagger-5">
      <CreatorReference containerClass="on-colored-bg" />
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Obrigada - Maria Luiza 4 Anos',
  description: 'Uma mensagem especial de agradecimento da família da Maria Luiza'
})

// Page meta - no middleware needed for this page
definePageMeta({
  layout: false
})
</script>

<style scoped>
.cancelled-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--space-lg);
  padding-bottom: var(--space-6xl);
  box-sizing: border-box;
}

/* Dark theme support */
[data-theme="dark"] .cancelled-container {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

/* Theme Toggle */
.theme-toggle-container {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  z-index: 10;
}

@media (min-width: 640px) {
  .cancelled-container {
    padding: var(--space-xl);
    padding-bottom: var(--space-6xl);
  }
  
  .theme-toggle-container {
    top: var(--space-xl);
    right: var(--space-xl);
  }
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: var(--space-4xl);
  position: relative;
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.title-section {
  text-align: center;
}

.title {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 0;
  line-height: 1.2;
}

.subtitle {
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.9);
  margin: var(--space-md) 0 0 0;
  font-weight: 600;
}

/* Dark theme title and subtitle adjustments */
[data-theme="dark"] .title {
  color: #f8fafc;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

[data-theme="dark"] .subtitle {
  color: rgba(248, 250, 252, 0.8);
}

/* Responsive Titles */
.mobile-title {
  display: block;
}

.desktop-title {
  display: none;
}

@media (min-width: 768px) {
  .mobile-title {
    display: none;
  }
  
  .desktop-title {
    display: block;
  }
}

/* Message Content Layout */
.message-content {
  display: grid;
  gap: var(--space-2xl);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  grid-template-columns: 1fr;
  align-items: start;
}

/* Glass Cards */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  transition: var(--transition-base);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Dark theme glass cards */
[data-theme="dark"] .glass-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .glass-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(148, 163, 184, 0.4);
}

/* Heart Card */
.heart-card {
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(255, 105, 180, 0.3));
  border: 2px solid rgba(255, 105, 180, 0.4);
}

[data-theme="dark"] .heart-card {
  background: linear-gradient(135deg, rgba(219, 39, 119, 0.2), rgba(190, 24, 93, 0.2));
  border: 2px solid rgba(219, 39, 119, 0.4);
}

.heart-icon {
  font-size: 4rem;
  margin-bottom: var(--space-lg);
  animation: gentle-pulse 2s ease-in-out infinite;
}

.heart-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: var(--space-lg);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .heart-title {
  color: #f8fafc;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.heart-message p {
  font-size: var(--text-lg);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: var(--space-lg);
  text-align: left;
}

[data-theme="dark"] .heart-message p {
  color: rgba(248, 250, 252, 0.9);
}

.highlight-message {
  background: rgba(255, 255, 255, 0.2) !important;
  padding: var(--space-lg) !important;
  border-radius: var(--radius-lg) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  text-align: center !important;
  font-size: var(--text-xl) !important;
}

[data-theme="dark"] .highlight-message {
  background: rgba(30, 41, 59, 0.3) !important;
  border: 1px solid rgba(148, 163, 184, 0.4) !important;
}

/* Maria Luiza's Card */
.malu-card {
  background: linear-gradient(135deg, rgba(255, 218, 185, 0.3), rgba(255, 160, 122, 0.3));
  border: 2px solid rgba(255, 160, 122, 0.4);
}

[data-theme="dark"] .malu-card {
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(194, 65, 12, 0.2));
  border: 2px solid rgba(234, 88, 12, 0.4);
}

.malu-photo {
  font-size: 3rem;
  text-align: center;
  margin-bottom: var(--space-md);
}

.malu-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: var(--space-md);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .malu-title {
  color: #f8fafc;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.child-message {
  font-size: var(--text-lg);
  font-style: italic;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border-left: 4px solid rgba(255, 160, 122, 0.8);
}

[data-theme="dark"] .child-message {
  color: rgba(248, 250, 252, 0.9);
  background: rgba(30, 41, 59, 0.3);
  border-left: 4px solid rgba(234, 88, 12, 0.8);
}

/* Family Card */
.family-card {
  background: linear-gradient(135deg, rgba(147, 197, 253, 0.3), rgba(59, 130, 246, 0.3));
  border: 2px solid rgba(59, 130, 246, 0.4);
}

[data-theme="dark"] .family-card {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(29, 78, 216, 0.2));
  border: 2px solid rgba(37, 99, 235, 0.4);
}

.family-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: var(--space-md);
}

.family-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: var(--space-md);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .family-title {
  color: #f8fafc;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.family-message p {
  font-size: var(--text-lg);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: var(--space-lg);
}

[data-theme="dark"] .family-message p {
  color: rgba(248, 250, 252, 0.9);
}

.blessing {
  background: rgba(255, 255, 255, 0.15);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  margin-top: var(--space-lg);
}

[data-theme="dark"] .blessing {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.blessing-text {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  font-weight: 600;
}

[data-theme="dark"] .blessing-text {
  color: rgba(248, 250, 252, 0.9);
}

/* Future Card */
.future-card {
  background: linear-gradient(135deg, rgba(167, 243, 208, 0.3), rgba(34, 197, 94, 0.3));
  border: 2px solid rgba(34, 197, 94, 0.4);
}

[data-theme="dark"] .future-card {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2));
  border: 2px solid rgba(34, 197, 94, 0.4);
}

.future-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: var(--space-md);
  animation: gentle-twinkle 3s ease-in-out infinite;
}

.future-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: var(--space-md);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .future-title {
  color: #f8fafc;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.future-message p {
  font-size: var(--text-lg);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: var(--space-lg);
}

[data-theme="dark"] .future-message p {
  color: rgba(248, 250, 252, 0.9);
}

.contact-info {
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

[data-theme="dark"] .contact-info {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.contact-info p {
  margin: 0;
  font-size: var(--text-md);
  text-align: center;
}

/* Animations */
@keyframes gentle-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes gentle-twinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .glass-card {
    padding: var(--space-xl);
  }
  
  .heart-title,
  .malu-title,
  .family-title,
  .future-title {
    font-size: var(--text-xl);
  }
  
  .heart-message p,
  .child-message,
  .family-message p,
  .future-message p {
    font-size: var(--text-md);
  }
  
  .highlight-message {
    font-size: var(--text-lg) !important;
  }
}

@media (max-width: 480px) {
  .cancelled-container {
    padding: var(--space-md);
  }
  
  .glass-card {
    padding: var(--space-lg);
  }
  
  .heart-icon,
  .malu-photo,
  .family-icon,
  .future-icon {
    font-size: 2.5rem;
  }
}
</style>
