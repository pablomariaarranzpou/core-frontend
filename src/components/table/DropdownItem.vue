<template>
  <button 
    class="dropdown-item"
    :class="{ 'dropdown-item-danger': variant === 'danger' }"
    @click="handleClick"
  >
    <slot name="icon">
      <svg v-if="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="getIcon()"></svg>
    </slot>
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  icon?: string
  variant?: 'default' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  icon: '',
  variant: 'default'
})

const emit = defineEmits<{
  'click': []
}>()

function handleClick(event: Event) {
  emit('click')
  
  // Cerrar el dropdown padre - propagando el evento al documento
  // para que el listener del DropdownActions lo capture
  setTimeout(() => {
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    })
    document.body.dispatchEvent(clickEvent)
  }, 10)
}

function getIcon() {
  const icons: Record<string, string> = {
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
    view: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>',
    delete: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',
    settings: '<circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m6.36 6.36l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m6.36-6.36l4.24-4.24"></path>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
  }
  
  return icons[props.icon] || ''
}
</script>

<style scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
  text-align: left;
}

.dropdown-item:hover {
  background: var(--color-background-soft);
}

:global(.dark) .dropdown-item:hover {
  background: var(--color-background-mute);
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: var(--transition-fast);
  flex-shrink: 0;
}

.dropdown-item:hover svg {
  opacity: 1;
}

.dropdown-item-danger {
  color: #ef4444;
}

.dropdown-item-danger:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
}

:global(.dark) .dropdown-item-danger:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
}

.dropdown-item-danger svg {
  color: #ef4444;
}
</style>
