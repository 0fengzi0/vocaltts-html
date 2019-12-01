import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../components/index.vue'

Vue.use(VueRouter)

const routes = [
	// {
	//   path: '/',
	//   name: 'home',
	//   component: Home
	// },
	{
		path: '/',
		name: 'index',
		component: index
	}

]

const router = new VueRouter({
	routes
})

export default router
