import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './plugins/vuescroll.js';
import './plugins/vuecookies.js';
import vuetify from './plugins/vuetify';
import 'animate.css';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
