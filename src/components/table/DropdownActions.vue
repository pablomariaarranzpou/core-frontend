<template>
  <div class="dropdown-container" :class="{ 'active': isOpen }" @click.stop>
    <button 
      class="dropdown-trigger"
      :class="{ 'active': isOpen }"
      :title="title"
      @click.stop="toggle"
    >
      <slot name="trigger">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </slot>
    </button>
    <Teleport to="body">
      <div 
        v-if="isOpen" 
        ref="menuRef"
        class="dropdown-menu" 
        :style="menuPosition"
        @click.stop
      >
        <slot></slot>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Acciones'
})

const emit = defineEmits<{
  'open': []
  'close': []
}>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const menuPosition = ref({ top: '0px', left: '0px' })

async function toggle(event: Event) {
  if (isOpen.value) {
    close()
  } else {
    open(event)
  }
}

async function open(event: Event) {
  isOpen.value = true
  emit('open')
  
  await nextTick()
  
  const button = event.target as HTMLElement
  const trigger = button.closest('.dropdown-trigger') as HTMLElement
  
  if (trigger && menuRef.value) {
    const rect = trigger.getBoundingClientRect()
    const menuRect = menuRef.value.getBoundingClientRect()
    
    // Posición inicial: debajo del botón, alineado a la derecha
    let top = rect.bottom + 8
    let left = rect.right - menuRect.width
    
    // Ajustar si se sale por la izquierda
    if (left < 8) {
      left = rect.left
    }
    
    // Ajustar si se sale por la derecha
    if (left + menuRect.width > window.innerWidth - 8) {
      left = window.innerWidth - menuRect.width - 8
    }
    
    // Ajustar si se sale por abajo
    if (top + menuRect.height > window.innerHeight - 8) {
      top = rect.top - menuRect.height - 8
    }
    
    menuPosition.value = {
      top: `${top}px`,
      left: `${left}px`
    }
  }
}

function close() {
  isOpen.value = false
  emit('close')
}

function handleClickOutside(event: MouseEvent) {
  if (isOpen.value && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    const trigger = (event.target as HTMLElement).closest('.dropdown-trigger')
    if (!trigger) {
      close()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({
  close
})
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-flex;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: var(--shadow-xs);
}

:global(.dark) .dropdown-trigger {
  background: var(--color-background-soft);
}

.dropdown-trigger:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.dropdown-trigger.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.dropdown-menu {
  position: fixed;
  z-index: 10000;
  min-width: 200px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: 0.5rem;
  animation: dropdownFadeIn 0.15s ease-out;
}

:global(.dark) .dropdown-menu {
  background: var(--color-background-soft);
  border-color: var(--color-border);
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
