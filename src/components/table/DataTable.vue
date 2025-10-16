<template>
  <div class="data-table-container" role="region" :aria-label="`Tabla: ${title}`">
    <!-- Table Header -->
    <header class="table-header">
      <div class="header-content">
        <h2 class="table-title">{{ title }}</h2>
        <p v-if="subtitle" class="table-subtitle">{{ subtitle }}</p>
      </div>
      <div class="table-actions">
        <slot name="header-actions">
          <!-- Search box -->
          <div v-if="searchable" class="search-box" role="search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              :value="modelValue" 
              @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
              type="text" 
              :placeholder="searchPlaceholder"
              :aria-label="searchPlaceholder || 'Buscar en la tabla'"
            />
          </div>
        </slot>
      </div>
    </header>

    <!-- Table Content -->
    <div class="table-content">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th v-if="selectable" class="checkbox-column">
                <input 
                  type="checkbox" 
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  :aria-label="allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'"
                />
              </th>
              <th 
                v-for="column in columns" 
                :key="column.key"
                :class="[
                  column.align ? `text-${column.align}` : '',
                  column.sortable ? 'sortable' : '',
                  { 'sorted': sortKey === column.key }
                ]"
                @click="column.sortable ? handleSort(column.key) : null"
                :aria-sort="getSortAria(column.key)"
                :tabindex="column.sortable ? 0 : undefined"
                @keydown.enter="column.sortable ? handleSort(column.key) : null"
                @keydown.space.prevent="column.sortable ? handleSort(column.key) : null"
              >
                <div class="th-content">
                  {{ column.label }}
                  <svg 
                    v-if="column.sortable" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    :class="{ 'rotate': sortKey === column.key && sortOrder === 'desc' }"
                    aria-hidden="true"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </div>
              </th>
              <th v-if="hasActions" class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading State -->
            <tr v-if="loading" class="state-row">
              <td :colspan="totalColumns">
                <div class="state-content loading">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  {{ loadingText }}
                </div>
              </td>
            </tr>

            <!-- Error State -->
            <tr v-else-if="error" class="state-row">
              <td :colspan="totalColumns">
                <div class="state-content error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  {{ error }}
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="data.length === 0" class="state-row">
              <td :colspan="totalColumns">
                <div class="state-content empty">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  {{ emptyText }}
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr 
              v-else
              v-for="(row, index) in data" 
              :key="getRowKey(row, index)"
              class="data-row"
              :class="{ 
                'selected': isSelected(row),
                'clickable': rowClickable
              }"
              @click="handleRowClick(row)"
              :tabindex="rowClickable ? 0 : undefined"
              @keydown.enter="rowClickable ? handleRowClick(row) : null"
              :role="rowClickable ? 'button' : undefined"
            >
              <td v-if="selectable" class="checkbox-column">
                <input 
                  type="checkbox"
                  :checked="isSelected(row)"
                  @change="toggleSelect(row)"
                  @click.stop
                  :aria-label="`Seleccionar fila ${index + 1}`"
                />
              </td>
              <td 
                v-for="column in columns" 
                :key="column.key"
                :class="column.align ? `text-${column.align}` : ''"
              >
                <slot 
                  :name="`cell-${column.key}`" 
                  :row="row" 
                  :value="getNestedValue(row, column.key)"
                  :column="column"
                >
                  {{ formatValue(row, column) }}
                </slot>
              </td>
              <td v-if="hasActions" class="actions-column">
                <slot name="actions" :row="row">
                  <button class="btn-icon" @click.stop="$emit('action', row)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table Footer with Pagination -->
    <footer v-if="pagination" class="table-footer">
      <span class="table-info" role="status" aria-live="polite">
        {{ paginationInfo }}
      </span>
      <nav class="pagination" aria-label="Navegación por páginas">
        <button 
          class="pagination-btn" 
          :disabled="currentPage <= 1"
          @click="handlePageChange(currentPage - 1)"
          aria-label="Página anterior"
          :title="currentPage > 1 ? 'Ir a página anterior' : 'No hay página anterior'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <template v-for="page in visiblePages" :key="page">
          <button 
            v-if="page !== -1"
            class="pagination-btn"
            :class="{ active: page === currentPage }"
            @click="handlePageChange(page)"
            :aria-label="`${page === currentPage ? 'Página actual, ' : ''}Página ${page}`"
            :aria-current="page === currentPage ? 'page' : undefined"
          >
            {{ page }}
          </button>
          <span
            v-else
            class="pagination-ellipsis"
            aria-hidden="true"
          >…</span>
        </template>
        
        <button 
          class="pagination-btn"
          :disabled="currentPage >= totalPages"
          @click="handlePageChange(currentPage + 1)"
          aria-label="Página siguiente"
          :title="currentPage < totalPages ? 'Ir a página siguiente' : 'No hay página siguiente'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  format?: (value: any, row: any) => string
}

interface Props {
  title: string
  subtitle?: string
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  error?: string
  searchable?: boolean
  searchPlaceholder?: string
  modelValue?: string
  selectable?: boolean
  rowKey?: string | ((row: any) => string | number)
  pagination?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  loadingText?: string
  emptyText?: string
  rowClickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
  searchable: true,
  searchPlaceholder: 'Buscar...',
  modelValue: '',
  selectable: false,
  rowKey: 'id',
  pagination: true,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  loadingText: 'Cargando datos...',
  emptyText: 'No hay datos disponibles',
  rowClickable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'sort': [key: string, order: 'asc' | 'desc']
  'page-change': [page: number]
  'select': [rows: any[]]
  'action': [row: any]
  'row-click': [row: any]
}>()

const slots = useSlots()

// State
const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedRows = ref<Set<string | number>>(new Set())

// Computed
const hasActions = computed(() => !!slots.actions)

const totalColumns = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  if (hasActions.value) count++
  return count
})

const allSelected = computed(() => {
  if (props.data.length === 0) return false
  return props.data.every(row => isSelected(row))
})

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const pages: number[] = []
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current > 3) {
      pages.push(-1) // Ellipsis
    }
    
    // Show pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push(-1) // Ellipsis
    }
    
    // Always show last page
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
})

const paginationInfo = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage + 1
  const end = Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
  return `Mostrando ${start}-${end} de ${props.totalItems}`
})

// Methods
function getRowKey(row: any, index: number): string | number {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return row[props.rowKey] ?? index
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

function formatValue(row: any, column: TableColumn): string {
  const value = getNestedValue(row, column.key)
  
  if (column.format) {
    return column.format(value, row)
  }
  
  if (value === null || value === undefined) {
    return '-'
  }
  
  return String(value)
}

function handleSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  
  emit('sort', key, sortOrder.value)
}

function getSortAria(columnKey: string): 'ascending' | 'descending' | 'none' {
  if (sortKey.value !== columnKey) return 'none'
  return sortOrder.value === 'asc' ? 'ascending' : 'descending'
}

function isSelected(row: any): boolean {
  const key = getRowKey(row, -1)
  return selectedRows.value.has(key)
}

function toggleSelect(row: any) {
  const key = getRowKey(row, -1)
  
  if (selectedRows.value.has(key)) {
    selectedRows.value.delete(key)
  } else {
    selectedRows.value.add(key)
  }
  
  emitSelection()
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedRows.value.clear()
  } else {
    props.data.forEach((row, index) => {
      const key = getRowKey(row, index)
      selectedRows.value.add(key)
    })
  }
  
  emitSelection()
}

function emitSelection() {
  const selected = props.data.filter(row => isSelected(row))
  emit('select', selected)
}

function handlePageChange(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

function handleRowClick(row: any) {
  if (props.rowClickable) {
    emit('row-click', row)
  }
}

// Expose methods for parent components
defineExpose({
  clearSelection: () => {
    selectedRows.value.clear()
    emitSelection()
  },
  selectAll: () => {
    props.data.forEach((row, index) => {
      const key = getRowKey(row, index)
      selectedRows.value.add(key)
    })
    emitSelection()
  }
})
</script>

<style scoped>
.data-table-container {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

:global(.dark) .data-table-container {
  background: var(--color-background-soft);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ============================================
   TABLE HEADER
   ============================================ */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  gap: 1.5rem;
  background: var(--color-background);
}

:global(.dark) .table-header {
  background: var(--color-background-mute);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.header-content {
  flex: 1;
  min-width: 0;
}

.table-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  letter-spacing: -0.01em;
}

.table-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.table-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.625rem 1rem;
  min-width: 240px;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xs);
}

:global(.dark) .search-box {
  background: var(--color-background-mute);
  border-color: rgba(255, 255, 255, 0.1);
}

.search-box:focus-within {
  border-color: var(--color-primary);
  background: var(--color-background);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:global(.dark) .search-box:focus-within {
  background: var(--color-background-mute);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.search-box svg {
  color: var(--color-text);
  opacity: 0.6;
  flex-shrink: 0;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  color: var(--color-text);
  font-size: 0.9375rem;
  width: 100%;
}

.search-box input::placeholder {
  color: var(--color-text);
  opacity: 0.5;
}

/* ============================================
   TABLE CONTENT
   ============================================ */
.table-content {
  position: relative;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: hidden;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  margin: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--color-background-mute);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

:global(.dark) thead {
  background: rgba(0, 0, 0, 0.2);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8125rem;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  opacity: 0.7;
  background: var(--color-background-mute);
  transition: all var(--transition-fast);
}

:global(.dark) th {
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

/* Headers ordenables - hover útil */
th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  opacity: 1;
  background: var(--color-background-soft);
}

:global(.dark) th.sortable:hover {
  background: var(--color-background-mute);
}

th.sorted {
  opacity: 1;
  background: rgba(59, 130, 246, 0.12);
  color: var(--color-primary);
}

:global(.dark) th.sorted {
  background: rgba(59, 130, 246, 0.2);
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.th-content svg {
  transition: transform 0.2s ease;
  opacity: 0.5;
}

th.sorted .th-content svg {
  opacity: 1;
  color: var(--color-primary);
}

.th-content svg.rotate {
  transform: rotate(180deg);
}

th.text-center,
td.text-center {
  text-align: center;
}

th.text-right,
td.text-right {
  text-align: right;
}

.checkbox-column {
  width: 48px;
  text-align: center !important;
}

.actions-column {
  width: 80px;
  text-align: center !important;
}

tbody {
  background: var(--color-background);
}

:global(.dark) tbody {
  background: var(--color-background);
}

/* Filas normales - SIN hover para evitar problemas de visibilidad */
.data-row {
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

:global(.dark) .data-row {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

/* Filas clickables solo tienen cursor pointer, SIN hover */
.data-row.clickable {
  cursor: pointer;
}

td {
  padding: 1.25rem 1.5rem;
  color: var(--color-text);
  font-size: 0.9375rem;
  transition: padding var(--transition-fast);
}

/* Checkbox styling - hover útil */
input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

/* Button icon - hover útil */
.btn-icon {
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
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xs);
  line-height: 1;
}

/* Alinear SVG en btn-icon */
.btn-icon svg {
  flex-shrink: 0;
  vertical-align: middle;
}

:global(.dark) .btn-icon {
  background: var(--color-background-soft);
  border-color: var(--color-border);
}

.btn-icon:hover {
  background: var(--color-background-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

:global(.dark) .btn-icon:hover {
  background: var(--color-background-mute);
  border-color: var(--color-primary);
}

.btn-icon:active {
  transform: scale(0.95);
}

/* ============================================
   STATE ROWS
   ============================================ */
.state-row {
  border-bottom: none;
}

.state-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
}

.state-content.loading {
  color: var(--color-text);
  opacity: 0.7;
}

.state-content.error {
  color: #ef4444;
}

.state-content.empty {
  color: var(--color-text);
  opacity: 0.6;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ============================================
   TABLE FOOTER
   ============================================ */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--color-border);
  gap: 1rem;
  background: var(--color-background);
}

.table-info {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.pagination {
  display: flex;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.75rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: var(--shadow-xs);
  line-height: 1;
}

/* Alinear SVG en botones de paginación */
.pagination-btn svg {
  flex-shrink: 0;
  vertical-align: middle;
  margin-top: -1px;
}

:global(.dark) .pagination-btn {
  background: var(--color-background-soft);
}

/* Hover útil solo en botones activos */
.pagination-btn:hover:not(:disabled):not(.active) {
  background: var(--color-background-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

:global(.dark) .pagination-btn:hover:not(:disabled):not(.active) {
  background: var(--color-background-mute);
  border-color: var(--color-primary);
}

.pagination-btn:active:not(:disabled):not(.active) {
  transform: scale(0.98);
}

/* Botón activo - sin hover */
.pagination-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
  cursor: default;
}

/* Botón deshabilitado - sin hover */
.pagination-btn:disabled {
  opacity: 0.5;
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.75rem;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.7;
  pointer-events: none;
  cursor: default;
}

/* ============================================

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1023px) {
  .table-header {
    flex-direction: column;
  }
  
  .table-actions {
    width: 100%;
  }
  
  .search-box {
    min-width: auto;
    flex: 1;
  }
}

@media (max-width: 767px) {
  .table-header {
    padding: 1.25rem;
  }
  
  .table-title {
    font-size: 1.125rem;
  }
  
  th, td {
    padding: 0.875rem;
  }
  
  .table-footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1rem 1.25rem;
  }
  
  .pagination {
    width: 100%;
    justify-content: center;
  }
}

/* ============================================
   BUDGET: TOKEN BUDGET
   ============================================ */

/* Variables de contraste */
:root {
  --table-selected-bg: rgba(59, 130, 246, 0.14);
  --btn-hover-bg: rgba(59, 130, 246, 0.10);
  --btn-active-bg: var(--color-primary);
  --btn-active-fg: #fff;
}

:global(.dark) :root,
:global(.dark) {
  --table-selected-bg: rgba(59, 130, 246, 0.22);
  --btn-hover-bg: rgba(59, 130, 246, 0.18);
}

/* Filas seleccionadas - SOLO para selección con checkbox */
.data-row.selected {
  background: var(--table-selected-bg);
  border-left: 3px solid var(--color-primary);
}

/* Header sortable - hover simple */
th.sortable {
  opacity: 0.9;
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  opacity: 1;
}

th.sorted {
  opacity: 1;
  color: var(--color-primary);
}

.th-content svg {
  stroke: currentColor;
  opacity: 0.8;
}

th.sorted .th-content svg {
  opacity: 1;
}

/* Botones de acciones */
.btn-icon {
  color: var(--color-text);
}

.btn-icon svg {
  stroke: currentColor;
}

.btn-icon:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-icon:active:not(:disabled) {
  background: var(--btn-active-bg);
  border-color: var(--btn-active-bg);
  color: var(--btn-active-fg);
}

/* Paginación */
.pagination-btn {
  color: var(--color-text);
}

.pagination-btn svg {
  stroke: currentColor;
}

.pagination-btn:hover:not(:disabled):not(.active) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn.active {
  background: var(--btn-active-bg);
  border-color: var(--btn-active-bg);
  color: var(--btn-active-fg);
}

.pagination-btn:disabled {
  opacity: 0.5;
}

/* Estados de carga/error */
.state-content svg {
  stroke: currentColor;
  opacity: 0.9;
}

/* Accesibilidad: alto contraste */
@media (forced-colors: active) {
  .pagination-btn.active,
  .btn-icon:active {
    background: Highlight;
    color: HighlightText;
    border-color: Highlight;
  }
}

/* Accesibilidad: más contraste */
@media (prefers-contrast: more) {
  th.sorted {
    background: rgba(59, 130, 246, 0.12);
  }
  
  .pagination-btn:hover:not(:disabled):not(.active) {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
  }
}
</style>
