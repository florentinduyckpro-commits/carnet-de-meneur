import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/views/SessionListView.vue') },
  { path: '/session/:id', component: () => import('@/views/SessionView.vue') },
  { path: '/pnjs', component: () => import('@/views/PnjLibraryView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
