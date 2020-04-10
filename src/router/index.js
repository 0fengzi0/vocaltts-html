import Vue from 'vue'
import VueRouter from 'vue-router'
import PcIndex from '../components/pc/PcIndex'
import PhoneIndex from "../components/mobel/PhoneIndex";

Vue.use(VueRouter);

const routes = [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
        path : '/',
        name : 'PcIndex',
        component : PcIndex
    },
    {
        path : '/PhoneIndex',
        name : 'PhoneIndex',
        component : PhoneIndex
    },
];

const router = new VueRouter({
    routes
});

export default router
