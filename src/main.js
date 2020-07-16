import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;
Vue.use(Vuetify)

new Vue({
	router,
	render: h => h(App),
	vuetify: new Vuetify({
		icons: {
			iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
		},
		theme: {
			themes: {
				dark: true,
				light: {
					primary: '#1976D2',
					secondary: '#424242',
					accent: '#82B1FF',
					error: '#FF5252',
					info: '#2196F3',
					success: '#4CAF50',
					warning: '#FFC107',
				},
			},
		},
	})
}).$mount('#app');
