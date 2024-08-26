import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { OhVueIcon } from './plugins/Icons'

const app = createApp(App)
app.use(router)

app.component('v-icon', OhVueIcon)

app.mount('#app')
