import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/layout/index.vue')
import { basicRouter } from './modules/basic'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      name: 'entery',
      children: [
        ...basicRouter,
      ]
    },
  ]
})

export default router
