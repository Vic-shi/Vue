import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
var children = [
  {
    path: 'role',
    name: '系统角色',
    component: () => import('@/views/role/index'),
    meta: { title: '系统角色', icon: '系统角色' }
  },
  {
    path: 'person',
    name: '系统用户',
    component: () => import('@/views/person/index'),
    meta: { title: '系统用户', icon: '系统用户' }
  },
  {
    path: 'tree',
    name: '组织机构',
    component: () => import('@/views/tree/index'),
    meta: { title: '组织机构', icon: '组织机构' }
  },
  {
    path: 'type',
    name: '组织类型',
    component: () => import('@/views/type/index'),
    meta: { title: '组织类型', icon: '组织类型' }
  },
  {
    path: 'account',
    name: '账套',
    component: () => import('@/views/account/index'),
    meta: { title: '账套', icon: '账套' }
  },
  {
    path: 'permission',
    name: '权限设置',
    component: () => import('@/views/permission/index'),
    meta: { title: '权限设置', icon: '权限设置' }
  }
]
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '控制台',
    meta: { title: '控制台', icon: '控制台' },
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/tree',
    name: '权限管理',
    meta: { title: '权限管理', icon: '权限管理' },
    children: children
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

