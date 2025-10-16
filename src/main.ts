import './assets/main.css'
import './assets/container.css' // Estilos responsive globales
import './assets/design-system.css' // Sistema de diseño global (Apple Style)
import './amplify-config' // Configuración de AWS Amplify

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
