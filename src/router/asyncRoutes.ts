
import Layout from "@/layout/default.vue"
import Home from '../views/Home.vue'
import Blank from '../layout/blank.vue'

export default [{
  path: "/",
  redirect: "/home",
  component: Layout,
  children: [
    {
      path: "/home",
      name: "Home",
      component: Home,
      meta: {
        title: "Home"
      }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
      meta: {
        title: "About"
      }
    },
    {
      path: '/test',
      component: Blank,
      meta: {
        title: "Test"
      },
      children: [
        {
          path: '',
          name: 'Test',
          component: () => import(/* webpackChunkName: "test" */ '../views/test/index.vue'),
          meta: {
            title: "Test1"
          }
        },
        {
          path: 'store',
          name: 'Store',
          component: () => import(/* webpackChunkName: "store" */ '../views/test/store.vue'),
          meta: {
            title: "Store"
          }
        }
      ]
    },
  ]
}]