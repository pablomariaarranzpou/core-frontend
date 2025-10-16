<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { useConfirm } from '@/composables/useConfirm'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const { confirmState, handleConfirm, handleCancel } = useConfirm()

onMounted(() => {
  // Solo inicializar tema aquí
  // El auth se inicializa en el router guard para evitar llamadas duplicadas
  themeStore.initTheme()
})
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main class="app-main">
      <RouterView />
    </main>
    
    <!-- Global Confirmation Dialog -->
    <ConfirmationDialog
      v-model="confirmState.isOpen"
      :title="confirmState.title"
      :message="confirmState.message"
      :details="confirmState.details"
      :type="confirmState.type"
      :confirm-text="confirmState.confirmText"
      :cancel-text="confirmState.cancelText"
      :show-cancel="confirmState.showCancel"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
/* ============================================
   APP CONTAINER
   ============================================ */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
}
/* ============================================
   APP MAIN (CONTENT)
   ============================================ */
.app-main {
  flex: 1;
  margin-top: 60px; /* Header height */
  background: var(--color-background);
}

/* Responsive top margin to match header height at breakpoints */
@media (max-width: 767px) {
  .app-main { margin-top: 56px; }
}

@media (max-width: 480px) {
  .app-main { margin-top: 52px; }
}
</style>
