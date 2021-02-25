import Vue from 'vue'
import Router from 'vue-router'

import Login from './page/Login'
import BigHome from './page/BigHome'
import Course from './page/course/index'
import Carousel from './page/course/carousel.vue'

import User from './page/user/index'

Vue.use(Router);

// 解决二级菜单中路由跳转时的报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const router = new Router({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {path: '/bighome', component: BigHome, redirect: '/home', children: [
            // {path: '/home/home', component: Home, meta: ['首页管理', '首页类别管理']},
            {path: '/course/manage', component: Course, meta: ['首页', '课程管理']},
            {path: '/course/carousel', component: Carousel, meta: ['首页', '轮播图管理']},

            {path: '/user/manage', component: User, meta: ['用户', '用户管理']},

        ]},
    ],
    // mode: 'history',
    // base:'/dist'
})



export default router;