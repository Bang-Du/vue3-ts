import { createRouter, createWebHashHistory, RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { useStore } from "@/store"
import asyncRoutes from './asyncRoutes'

export let constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/notFound"
  },
  {
    path: "/notFound",
    name: "NotFound",
    component: () => import(/* webpackChunkName: "NotFound" */ '../views/404.vue')
  },
];

// routes = routes.concat(asyncRoutes)

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export function resetRouter() {
  const newRouter = router;
  (router as any).matcher = (newRouter as any).matcher // reset router
}

// 路由守卫
router.beforeEach(async(to: RouteLocationNormalized, _: RouteLocationNormalized, next: any) => {
  const store = useStore()
  if (store.state.login.token) {
    if (to.path === '/login') {
      next("/")
      
    } else {
      next() // 这里是 next()，不然会一直循环
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
});

export default router
