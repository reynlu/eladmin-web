import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/exam/question/edit/single',
    name: 'SingleEdit',
    hidden: true,
    component: () => import('@/views/exam/question/edit/Single'),
    meta: { title: '单选题编辑', icon: 'tree' }
  },
  {
    path: '/exam/question/edit/multiple',
    name: 'MultipleEdit',
    hidden: true,
    component: () => import('@/views/exam/question/edit/Multiple'),
    meta: { title: '多选题编辑', icon: 'table' }
  },
  {
    path: '/exam/question/edit/score',
    name: 'ScoreEdit',
    hidden: true,
    component: () => import('@/views/exam/question/edit/Score'),
    meta: { title: '打分题编辑', icon: 'tree' }
  },
  {
    path: '/exam/question/edit/operation',
    name: 'OperationEdit',
    hidden: true,
    component: () => import('@/views/exam/question/edit/Operation'),
    meta: { title: '操作题编辑', icon: 'table' }
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
