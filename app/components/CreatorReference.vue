<template>
  <div :class="['creator-reference', containerClass, spacingClass]">
    <p>Desenvolvido com ❤️ por <a href="https://www.kravela.cloud" target="_blank" rel="noopener noreferrer">Kravela Cloud LTDA</a></p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  containerClass?: 'on-colored-bg' | 'on-glass-bg' | 'on-light-bg'
  extraSpacing?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  containerClass: 'on-colored-bg',
  extraSpacing: undefined
})

const spacingClass = computed(() => {
  if (!props.extraSpacing) return ''
  return `spacing-${props.extraSpacing}`
})
</script>

<style scoped>
.creator-reference {
  padding: var(--space-xl) 0 var(--space-md) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  opacity: 0.9;
}

/* Dark theme support */
[data-theme="dark"] .creator-reference {
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

.creator-reference p {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

[data-theme="dark"] .creator-reference p {
  color: rgba(148, 163, 184, 0.8);
}

.creator-reference a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-base);
}

[data-theme="dark"] .creator-reference a {
  color: rgba(148, 163, 184, 0.9);
}

.creator-reference a:hover {
  color: #ffffff;
  text-decoration: underline;
}

[data-theme="dark"] .creator-reference a:hover {
  color: #f8fafc;
}

/* Theme variations for different backgrounds */
.creator-reference.on-colored-bg {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.creator-reference.on-colored-bg p {
  color: rgba(255, 255, 255, 0.9);
}

.creator-reference.on-colored-bg a {
  color: #ffffff;
}

/* For pages with glass background */
.creator-reference.on-glass-bg {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border-radius: var(--radius-lg);
  margin: var(--space-lg);
  padding: var(--space-lg);
}

[data-theme="dark"] .creator-reference.on-glass-bg {
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(30, 41, 59, 0.3);
}

/* For light theme pages */
.creator-reference.on-light-bg {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.creator-reference.on-light-bg p {
  color: rgba(0, 0, 0, 0.7);
}

.creator-reference.on-light-bg a {
  color: var(--color-primary);
}

[data-theme="dark"] .creator-reference.on-light-bg {
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

[data-theme="dark"] .creator-reference.on-light-bg p {
  color: rgba(148, 163, 184, 0.8);
}

[data-theme="dark"] .creator-reference.on-light-bg a {
  color: rgba(148, 163, 184, 0.9);
}

/* Extra spacing options */
.creator-reference.spacing-small {
  margin-top: var(--space-2xl);
}

.creator-reference.spacing-medium {
  margin-top: var(--space-3xl);
}

.creator-reference.spacing-large {
  margin-top: var(--space-4xl);
}
</style>
