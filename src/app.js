/**
 *
 * @author liu_lin_sp@126.com
 * @date 2018/8/10
 */
import Vue from 'vue'
import Router from './router/index.js'
import {App, Index, About, Detail} from './components.js'

Vue.use(Router)
const router = new Router({
    // mode: 'history',
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'index',
            component: Index,
            children: [
                {
                    path: 'detail',
                    name: 'detail',
                    component: Detail
                }
            ]
        },
        {
            path: '/about',
            name: 'about',
            component: About
        }
    ]
})

window.vm = new Vue({
    el: '#app',
    template: '<App/>',
    router,
    components: {
        App
    }
})