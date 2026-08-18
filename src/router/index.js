import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'Index',
        component: () => import('../views/Index')
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
