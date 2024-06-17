import '../src/index.css'
import PrimeVue from 'primevue/config';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import InputText from 'primevue/inputtext';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)

app.use(router)
app.component('VueDatePicker', VueDatePicker);
app.use(PrimeVue)
app.mount('#app')
