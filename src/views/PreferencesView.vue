<template>
  <div class="preferences-view">
    <div class="container py-lg">
      <!-- Header Section -->
      <div class="preferences-header">
        <div class="header-content">
          <h1 class="page-title">Preferencias</h1>
          <p class="page-subtitle">Personaliza tu experiencia en la plataforma</p>
        </div>
      </div>

      <!-- Preferences Sections -->
      <div class="preferences-container">
        <!-- Theme Section -->
        <div class="preference-section">
          <div class="section-header">
            <div class="section-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            </div>
            <div class="section-info">
              <h2 class="section-title">Tema de Apariencia</h2>
              <p class="section-description">Elige cómo quieres ver la aplicación</p>
            </div>
          </div>
          
          <div class="section-content">
            <div class="theme-options">
              <label class="theme-option">
                <input type="radio" name="theme" value="light" v-model="selectedTheme" @change="updateTheme">
                <div class="theme-card">
                  <div class="theme-preview theme-preview-light">
                    <div class="preview-header"></div>
                    <div class="preview-content">
                      <div class="preview-box"></div>
                      <div class="preview-box"></div>
                    </div>
                  </div>
                  <div class="theme-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="4"></circle>
                      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                    </svg>
                    <span>Claro</span>
                  </div>
                </div>
              </label>
              
              <label class="theme-option">
                <input type="radio" name="theme" value="dark" v-model="selectedTheme" @change="updateTheme">
                <div class="theme-card">
                  <div class="theme-preview theme-preview-dark">
                    <div class="preview-header"></div>
                    <div class="preview-content">
                      <div class="preview-box"></div>
                      <div class="preview-box"></div>
                    </div>
                  </div>
                  <div class="theme-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <span>Oscuro</span>
                  </div>
                </div>
              </label>
              
              <label class="theme-option">
                <input type="radio" name="theme" value="system" v-model="selectedTheme" @change="updateTheme">
                <div class="theme-card">
                  <div class="theme-preview theme-preview-auto">
                    <div class="preview-half preview-half-light">
                      <div class="preview-header"></div>
                      <div class="preview-box"></div>
                    </div>
                    <div class="preview-half preview-half-dark">
                      <div class="preview-header"></div>
                      <div class="preview-box"></div>
                    </div>
                  </div>
                  <div class="theme-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <span>Sistema</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="preference-section">
          <div class="section-header">
            <div class="section-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
            </div>
            <div class="section-info">
              <h2 class="section-title">Notificaciones</h2>
              <p class="section-description">Configura cómo quieres recibir las notificaciones</p>
            </div>
          </div>
          
          <div class="section-content">
            <div class="preference-items">
              <div class="preference-item">
                <div class="preference-item-info">
                  <h3 class="preference-item-title">Notificaciones por Email</h3>
                  <p class="preference-item-description">Recibe actualizaciones importantes por correo</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="emailNotifications">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-item-info">
                  <h3 class="preference-item-title">Notificaciones Push</h3>
                  <p class="preference-item-description">Recibe notificaciones en tiempo real</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="pushNotifications">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-item-info">
                  <h3 class="preference-item-title">Resumen Semanal</h3>
                  <p class="preference-item-description">Recibe un resumen de actividad cada semana</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="weeklyDigest">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Language Section -->
        <div class="preference-section">
          <div class="section-header">
            <div class="section-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div class="section-info">
              <h2 class="section-title">Idioma y Región</h2>
              <p class="section-description">Selecciona tu idioma y formato preferido</p>
            </div>
          </div>
          
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">Idioma</label>
              <select v-model="language" class="form-select">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Zona Horaria</label>
              <select v-model="timezone" class="form-select">
                <option value="Europe/Madrid">Madrid (GMT+1)</option>
                <option value="Europe/London">London (GMT+0)</option>
                <option value="America/New_York">New York (GMT-5)</option>
                <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="actions-bar">
          <button class="btn-secondary">Cancelar</button>
          <button class="btn-primary" @click="savePreferences">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useConfirm } from '@/composables/useConfirm'

const themeStore = useThemeStore()
const { confirm } = useConfirm()

const selectedTheme = ref(themeStore.theme)
const emailNotifications = ref(true)
const pushNotifications = ref(false)
const weeklyDigest = ref(true)
const language = ref('es')
const timezone = ref('Europe/Madrid')

const updateTheme = () => {
  themeStore.setTheme(selectedTheme.value)
}

const savePreferences = async () => {
  // Aquí guardarías las preferencias en el backend
  console.log('Guardando preferencias...', {
    theme: selectedTheme.value,
    emailNotifications: emailNotifications.value,
    pushNotifications: pushNotifications.value,
    weeklyDigest: weeklyDigest.value,
    language: language.value,
    timezone: timezone.value
  })
  
  await confirm({
    title: 'Preferencias Guardadas',
    message: 'Tus preferencias se han guardado correctamente.',
    type: 'success',
    confirmText: 'Entendido',
    showCancel: false,
  })
}
</script>

<style scoped>
.preferences-view {
  width: 100%;
  min-height: 100%;
  background: var(--color-background);
}

/* ============================================
   HEADER
   ============================================ */
.preferences-header {
  margin-bottom: 2.5rem;
}

.header-content {
  max-width: 100%;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--vt-c-text-2);
  line-height: 1.5;
}

/* ============================================
   PREFERENCE SECTIONS
   ============================================ */
.preferences-container {
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preference-section {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.75rem;
  border-bottom: 1px solid var(--color-border);
}

.section-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-info {
  flex: 1;
}

.section-title {
  margin: 0 0 0.375rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.section-description {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--vt-c-text-2);
}

.section-content {
  padding: 1.75rem;
}

/* ============================================
   THEME OPTIONS
   ============================================ */
.theme-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}

.theme-option {
  cursor: pointer;
}

.theme-option input[type="radio"] {
  display: none;
}

.theme-card {
  border: 2px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  background: var(--color-background);
}

.theme-option input[type="radio"]:checked + .theme-card {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.theme-card:hover {
  border-color: var(--color-primary);
}

.theme-preview {
  height: 120px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.theme-preview-light {
  background: #f9fafb;
}

.theme-preview-dark {
  background: #1f2937;
}

.theme-preview-auto {
  display: flex;
  flex-direction: row;
  padding: 0;
  gap: 0;
}

.preview-half {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-half-light {
  background: #f9fafb;
}

.preview-half-dark {
  background: #1f2937;
}

.preview-header {
  height: 8px;
  background: currentColor;
  opacity: 0.2;
  border-radius: 4px;
}

.preview-content {
  flex: 1;
  display: flex;
  gap: 0.5rem;
}

.preview-box {
  flex: 1;
  background: currentColor;
  opacity: 0.1;
  border-radius: 4px;
}

.theme-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-heading);
  border-top: 1px solid var(--color-border);
}

/* ============================================
   PREFERENCE ITEMS
   ============================================ */
.preference-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.preference-item-info {
  flex: 1;
}

.preference-item-title {
  margin: 0 0 0.375rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.preference-item-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vt-c-text-2);
  line-height: 1.5;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-border);
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background: var(--color-primary);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* ============================================
   FORM ELEMENTS
   ============================================ */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-heading);
}

.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-select:hover {
  border-color: var(--color-primary);
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* ============================================
   ACTIONS BAR
   ============================================ */
.actions-bar {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-background-mute);
  border-color: var(--color-primary);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 767px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .theme-options {
    grid-template-columns: 1fr;
  }
  
  .preference-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .actions-bar {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
