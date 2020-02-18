import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../components/index'
import Notice from '../components/Notice'

Vue.use(VueRouter);

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
    },
    {
        path: '/notice',
        name: 'Notice',
        component: Notice
    },
];

const router = new VueRouter({
    routes
});

export default router
