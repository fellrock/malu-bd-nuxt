<template>
  <button
    @click="toggleTheme"
    class="theme-toggle glass-card"
    :aria-label="isDark ? 'Trocar para tema dia mágico' : 'Trocar para tema noite estrelada'"
    title="Alternar tema"
  >
    <!-- Custom icons for Gabby's Dollhouse theme -->
    <!-- Rainbow for light theme, Falling star for dark theme -->
    <svg v-if="isDark" class="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Rainbow icon -->
      <path d="M12 2C6.477 2 2 6.477 2 12h2c0-4.418 3.582-8 8-8s8 3.582 8 8h2c0-5.523-4.477-10-10-10z" fill="url(#rainbow-gradient1)"/>
      <path d="M12 4C7.582 4 4 7.582 4 12h2c0-3.314 2.686-6 6-6s6 2.686 6 6h2c0-4.418-3.582-8-8-8z" fill="url(#rainbow-gradient2)"/>
      <path d="M12 6C8.686 6 6 8.686 6 12h2c0-2.209 1.791-4 4-4s4 1.791 4 4h2c0-3.314-2.686-6-6-6z" fill="url(#rainbow-gradient3)"/>
      <defs>
        <linearGradient id="rainbow-gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff0000"/>
          <stop offset="16.66%" style="stop-color:#ff8000"/>
          <stop offset="33.33%" style="stop-color:#ffff00"/>
          <stop offset="50%" style="stop-color:#00ff00"/>
          <stop offset="66.66%" style="stop-color:#0080ff"/>
          <stop offset="83.33%" style="stop-color:#8000ff"/>
          <stop offset="100%" style="stop-color:#ff0080"/>
        </linearGradient>
        <linearGradient id="rainbow-gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff4444"/>
          <stop offset="33.33%" style="stop-color:#ffff44"/>
          <stop offset="66.66%" style="stop-color:#44ff44"/>
          <stop offset="100%" style="stop-color:#4444ff"/>
        </linearGradient>
        <linearGradient id="rainbow-gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff6666"/>
          <stop offset="50%" style="stop-color:#ffff66"/>
          <stop offset="100%" style="stop-color:#66ff66"/>
        </linearGradient>
      </defs>
    </svg>
    <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Falling star icon -->
      <path d="M9.5 2L11.5 6L16 6.5L12.5 10L13.5 14.5L9.5 12L5.5 14.5L6.5 10L3 6.5L7.5 6L9.5 2Z" fill="#FFD700"/>
      <path d="M17 7L19 8L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M20 4L22 5L21 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M4 18L6 19L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M2 15L4 16L3 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Removed Heroicons import since we're using custom icons now

const isDark = ref(false) // Default to light theme (magical dollhouse)

const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  
  // Update HTML attribute
  document.documentElement.setAttribute('data-theme', theme)
  
  // Save preference
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  // Check saved preference or default to light theme
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // Default to light theme (magical dollhouse theme)
    isDark.value = false
  }
  
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  
  // Listen for system theme changes but still default to light
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // Even if system prefers dark, we default to light theme
      isDark.value = false
      document.documentElement.setAttribute('data-theme', 'light')
    }
  })
})
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: var(--space-xl);
  right: var(--space-xl);
  z-index: 1000;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-surface-elevated);
  backdrop-filter: var(--glass-backdrop);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-xl);
}

.theme-toggle:active {
  transform: translateY(0) scale(0.95);
}

.theme-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-base);
  color: var(--color-primary);
  filter: drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3));
}

.theme-toggle:hover .theme-icon {
  transform: rotate(15deg) scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(255, 105, 180, 0.6));
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .theme-toggle {
    top: var(--space-lg);
    right: var(--space-lg);
    width: 44px;
    height: 44px;
  }
  
  .theme-icon {
    width: 28px;
    height: 28px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle:hover {
    transform: none;
  }
  
  .theme-toggle:hover .theme-icon {
    transform: none;
  }
}
</style>
