import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes = [
    {path: '/', name: 'home', component: Home},
    {path: '/tag/:id/trombi', component: () => import('../views/Trombi.vue')},
    {path: '/tag/:id/stats', component: () => import('../views/Stats.vue')},
    {path: '/tag/:id/slideshow', component: () => import('../views/Slideshow.vue')}
];

const router = new VueRouter({
    routes
});

export default router
