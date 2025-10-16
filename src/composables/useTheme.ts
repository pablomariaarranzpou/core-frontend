/**
 * Composable para gestionar el tema (claro/oscuro)
 */

import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

export function useTheme() {
  const themeStore = useThemeStore()
  const { effectiveTheme } = storeToRefs(themeStore)
  
  const isDark = computed(() => effectiveTheme.value === 'dark')

  return {
    isDark,
    effectiveTheme,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme
  }
}
