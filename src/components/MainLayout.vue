<template>
  <div class="main-layout">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
// Layout principal para las vistas de la aplicación
// Cada vista maneja su propio contenedor para mayor flexibilidad
</script>

<style scoped>
/* Layout principal - simple wrapper sin restricciones */
.main-layout {
  min-height: calc(100vh - 60px); /* 60px = altura del header */
  background: var(--color-background);
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .main-layout {
    min-height: calc(100vh - 56px); /* 56px = altura del header en mobile */
  }
}

@media (max-width: 480px) {
  .main-layout {
    min-height: calc(100vh - 52px); /* 52px = altura del header en mobile pequeño */
  }
}
</style>
