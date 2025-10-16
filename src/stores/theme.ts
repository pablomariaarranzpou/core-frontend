import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
  // Estado: tema seleccionado por el usuario
  const theme = ref<Theme>('auto')
  
  // Estado: tema efectivo actual (calculado)
  const effectiveTheme = ref<'light' | 'dark'>('light')

  /**
   * Obtener el tema del sistema operativo
   */
  const getSystemTheme = (): 'light' | 'dark' => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }

  /**
   * Calcular el tema efectivo basado en la preferencia del usuario
   */
  const calculateEffectiveTheme = (): 'light' | 'dark' => {
    if (theme.value === 'auto') {
      return getSystemTheme()
    }
    return theme.value
  }

  /**
   * Aplicar el tema al DOM
   */
  const applyTheme = () => {
    effectiveTheme.value = calculateEffectiveTheme()
    
    const html = document.documentElement
    
    // Aplicar o quitar la clase 'dark' del documentElement
    if (effectiveTheme.value === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
    
    // También actualizar el atributo data-theme para mayor compatibilidad
    html.setAttribute('data-theme', effectiveTheme.value)
    
    // Actualizar el color del theme-color meta tag para PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        effectiveTheme.value === 'dark' ? '#181818' : '#ffffff'
      )
    }
    
    console.log('✅ Tema aplicado:', effectiveTheme.value, 'Clase dark:', html.classList.contains('dark'))
  }

  /**
   * Cambiar el tema
   */
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  /**
   * Toggle entre light y dark (sin auto)
   */
  const toggleTheme = () => {
    if (effectiveTheme.value === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  /**
   * Inicializar el tema desde localStorage o sistema
   */
  const initTheme = () => {
    // Intentar cargar desde localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      theme.value = savedTheme
    } else {
      // Si no hay tema guardado, usar 'auto'
      theme.value = 'auto'
    }

    // Aplicar el tema inicial
    applyTheme()

    // Escuchar cambios en las preferencias del sistema (solo si está en modo auto)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'auto') {
        applyTheme()
      }
    })
  }

  // Watch para aplicar cambios automáticamente
  watch(theme, () => {
    applyTheme()
  })

  return {
    // Estado
    theme,
    effectiveTheme,
    
    // Acciones
    setTheme,
    toggleTheme,
    initTheme,
  }
})
