<template>
  <div class="gifts-container">
    <div class="gifts-content">
      <!-- Header -->
      <header class="gifts-header animate-fadeInUp">
        <h1 class="gifts-title">
          <span class="mobile-title">Sugestões de Presentes 🎁</span>
          <span class="desktop-title">Sugestões de Presentes para Maria Luiza 🎁</span>
        </h1>
        <p class="gifts-subtitle">Lembre-se: sua presença é o presente mais valioso! ✨</p>
      </header>

      <!-- Intro / Message -->
      <section class="glass-card intro-section animate-fadeInScale">
        <p class="intro-text">
          Maria Luiza está muito animada para comemorar com todos os amigos e familiares queridos.
          <strong class="highlight"> Sua presença na festa é o presente mais valioso</strong> que ela pode receber.
          <br />Ainda assim, deixamos algumas ideias caso deseje levar algo com carinho.
        </p>
      </section>

      <!-- Categories -->
      <section class="categories-grid animate-fadeInUp">
        <div class="gift-category glass-card" v-for="category in giftCategories" :key="category.title">
          <div class="category-icon" aria-hidden="true">{{ category.icon }}</div>
            <h3 class="category-title">{{ category.title }}</h3>
            <ul class="category-items">
              <li v-for="item in category.items" :key="item" class="category-item">{{ item }}</li>
            </ul>
        </div>
      </section>

      <!-- Closing Card -->
      <section class="glass-card closing-section animate-fadeInScale">
        <p class="closing-text">
          O mais importante é celebrarmos juntos esse momento especial! <span class="emoji">💕</span>
        </p>
        <div class="actions">
          <button class="btn btn-primary btn-sm single-return-btn" @click="goToEvent">Voltar ao Evento</button>
        </div>
      </section>

      <!-- Footer / Reference -->
      <CreatorReference containerClass="on-glass-bg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Gift categories (could be moved to a composable if reused elsewhere)
const giftCategories = ref([
  {
    title: 'Livros Infantis',
    icon: '📚',
    items: ['Livros de histórias', 'Contos de fada', 'Livros educativos']
  },
  {
    title: 'Brinquedos',
    icon: '🧸',
    items: ['Quebra-cabeças', 'Jogos educativos', 'Bonecas e bichinhos']
  },
  {
    title: 'Material de Arte',
    icon: '🎨',
    items: ['Lápis de cor', 'Tintas e pincéis', 'Cadernos de desenho']
  },
  {
    title: 'Roupas',
    icon: '👗',
    items: ['Vestidos infantis (tam. 4)', 'Conjuntinhos', 'Acessórios para cabelo']
  }
])

// Access control (reuse invitation cookie like event page stores)
onMounted(async () => {
  const invitationCookie = useCookie('invitationCode', {
    default: () => '',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })

  if (!invitationCookie.value) {
    await navigateTo('/acesso-negado', { replace: true })
    return
  }

  try {
    const res: any = await $fetch(`/api/guest-code/${invitationCookie.value}`)
    if (!res.success || !res.guests.length) {
      return navigateTo('/acesso-negado', { replace: true })
    }

    const confirmed = res.guests.some((g: any) => g.status === 'CONFIRMED')
    if (!confirmed) {
      return navigateTo('/acesso-negado', { replace: true })
    }
  } catch (e) {
    console.error('Gift page access validation failed', e)
    return navigateTo('/acesso-negado', { replace: true })
  }
})

const goToEvent = () => {
  const invitationCookie = useCookie('invitationCode', {
    default: () => '',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })
  if (invitationCookie.value) navigateTo(`/evento/${invitationCookie.value}`)
  else navigateTo('/')
}

const goHome = () => navigateTo('/')

useSeoMeta({
  title: 'Presentes - Maria Luiza 4 Anos',
  description: 'Sugestões de presentes para a festa de 4 anos da Maria Luiza'
})
</script>

<style scoped>
.gifts-container {
  min-height: 100vh;
  background: var(--gradient-background);
  padding: var(--space-xl) var(--space-lg) var(--space-6xl);
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .gifts-container {
    padding: var(--space-2xl) var(--space-2xl) var(--space-7xl);
  }
}

.gifts-content {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.gifts-header {
  text-align: center;
}

.gifts-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: var(--font-weight-extrabold);
  margin: 0;
  line-height: 1.15;
  background: linear-gradient(135deg, var(--color-white), var(--color-accent-light));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 4px 18px rgba(0,0,0,0.25);
}

.gifts-subtitle {
  margin: var(--space-md) 0 0 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  text-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

/* Responsive titles */
.mobile-title { display: block; }
.desktop-title { display: none; }
@media (min-width: 768px) {
  .mobile-title { display: none; }
  .desktop-title { display: inline; }
}

.intro-section {
  text-align: center;
  padding: var(--space-3xl) var(--space-2xl);
}

.intro-text {
  margin: 0;
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-white);
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.intro-text .highlight { color: var(--color-accent-light); font-weight: var(--font-weight-bold); }

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-2xl);
}

.gift-category {
  position: relative;
  padding: var(--space-2xl) var(--space-xl) var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  transition: var(--transition-base);
  overflow: hidden;
}

.gift-category:before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 15%, rgba(255,255,255,0.25), transparent 60%);
  pointer-events: none;
}

.gift-category:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }

.category-icon {
  font-size: 2.5rem;
  text-align: center;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));
}

.category-title {
  margin: 0;
  text-align: center;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary-light));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

.category-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.category-item {
  position: relative;
  padding-left: 1.25rem;
  color: var(--color-white);
  font-size: var(--font-size-base);
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.category-item:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
}

.closing-section {
  text-align: center;
  padding: var(--space-3xl) var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.closing-text {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  text-shadow: 0 2px 8px rgba(0,0,0,0.35);
}

.closing-text .emoji { font-size: 1.6rem; }

.actions { display: flex; flex-wrap: wrap; gap: var(--space-lg); justify-content: center; }
.single-return-btn { justify-content: center; text-align: center; padding-left: var(--space-3xl); padding-right: var(--space-3xl); }
</style>
