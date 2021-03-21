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
  { path: '/login-wework',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/mobile/loginWeixin'], resolve),
    hidden: true
  },
  { path: '/login-wework-secretary',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/mobile/loginSecretary'], resolve),
    hidden: true
  },
  { path: '/resident-home',
    meta: { title: '住院医师', noCache: true },
    component: (resolve) => require(['@/views/mobile/residentHome'], resolve),
    hidden: true
  },
  { path: '/secretary-home',
    meta: { title: '秘书管理', noCache: true },
    component: (resolve) => require(['@/views/mobile/secretaryHome'], resolve),
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
  },
  {
    path: '/mobile/rotation/list',
    component: (resolve) => require(['@/views/mobile/rotation/list'], resolve),
    name: '轮转计划',
    meta: { title: '轮转计划' }
  },
  {
    path: '/mobile/rotation/exchange',
    component: (resolve) => require(['@/views/mobile/rotation/exchange'], resolve),
    name: '轮转调换申请',
    meta: { title: '轮转调换申请' }
  },
  {
    path: '/mobile/diagnosis/add',
    component: (resolve) => require(['@/views/mobile/diagnosis/addDiagnosis'], resolve),
    name: '录入诊断',
    meta: { title: '录入诊断' }
  },
  {
    path: '/mobile/diagnosis/history',
    component: (resolve) => require(['@/views/mobile/diagnosis/history'], resolve),
    name: '诊断',
    meta: { title: '诊断记录' }
  },
  {
    path: '/mobile/schedule-calendar',
    component: (resolve) => require(['@/views/mobile/rotation/ScheduleCalendar'], resolve),
    name: '排班日历',
    meta: { title: '排班日历' }
  },
  {
    path: '/mobile-secretary/schedule',
    component: (resolve) => require(['@/views/mobile/manager/ScheduleResident'], resolve),
    name: '住院医师排班',
    meta: { title: '住院医师排班' }
  },
  {
    path: '/mobile-secretary/assign-teacher',
    component: (resolve) => require(['@/views/mobile/manager/AssignPhysician'], resolve),
    name: '设置带教老师',
    meta: { title: '设置带教老师' }
  },
  {
    path: '/mobile-secretary/rotation-list',
    component: (resolve) => require(['@/views/mobile/manager/ResidentRotationList'], resolve),
    name: '轮转列表',
    meta: { title: '查看轮转列表' }
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
