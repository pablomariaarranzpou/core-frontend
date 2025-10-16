<template>
  <button
    @click="themeStore.toggleTheme()"
    class="theme-toggle"
    :class="{ 'theme-toggle--dark': themeStore.effectiveTheme === 'dark' }"
    :title="themeStore.effectiveTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    :aria-label="themeStore.effectiveTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
  >
    <!-- Icono de Sol (modo claro) -->
    <svg
      v-if="themeStore.effectiveTheme === 'light'"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>

    <!-- Icono de Luna (modo oscuro) -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.theme-toggle::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-background-mute);
  opacity: 0;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.theme-toggle:hover::before {
  opacity: 1;
}

.theme-toggle:active {
  transform: translateY(-1px);
}

.theme-toggle svg {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

/* Animación de rotación para el sol */
.theme-toggle:not(.theme-toggle--dark):hover svg {
  transform: rotate(180deg);
}

/* Animación de escala para la luna */
.theme-toggle.theme-toggle--dark:hover svg {
  transform: scale(1.15) rotate(-15deg);
}

/* Efecto de pulso en el cambio */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.theme-toggle:active svg {
  animation: pulse 0.3s ease;
}

/* Accesibilidad: efecto focus visible */
.theme-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
