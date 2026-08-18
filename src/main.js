import {createApp} from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import cookies from './plugins/vuecookies.js';
import vuetify from './plugins/vuetify';
import 'animate.css';

createApp(App)
    .use(router)
    .use(store)
    .use(cookies)
    .use(vuetify)
    .mount('#app');
