import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { abilitiesPlugin } from '@casl/vue';
import { ability } from './lib/ability';
import './assets/base.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(abilitiesPlugin, ability, {
    useGlobalProperties: true
  })
app.mount('#app')
