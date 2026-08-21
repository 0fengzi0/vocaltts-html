import { createApp } from 'vue'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import './styles/global.css'

// 天依蓝为主色的明暗双主题
const tianyiDark = {
  dark: true,
  colors: {
    background: '#050810',
    surface: '#0d1626',
    'surface-variant': '#16233c',
    primary: '#66CCFF',
    'primary-darken-1': '#3FA8E0',
    secondary: '#B388FF',
    accent: '#7CF2E0',
    error: '#FF6B8A',
    info: '#66CCFF',
    success: '#5EE6A8',
    warning: '#FFC866',
    'on-background': '#E8F2FF',
    'on-surface': '#E8F2FF'
  }
}

const tianyiLight = {
  dark: false,
  colors: {
    background: '#EEF4FB',
    surface: '#FFFFFF',
    'surface-variant': '#E2EDF9',
    primary: '#2FA4DE',
    'primary-darken-1': '#1E86BC',
    secondary: '#7C5CE0',
    accent: '#18B8A6',
    error: '#E04A6E',
    info: '#2FA4DE',
    success: '#2FA97C',
    warning: '#D99A2B',
    'on-background': '#16233C',
    'on-surface': '#16233C'
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'tianyiDark',
    themes: { tianyiDark, tianyiLight }
  },
  defaults: {
    VCard: { rounded: 'xl' },
    VBtn: { rounded: 'lg' }
  }
})

createApp(App).use(vuetify).mount('#app')
