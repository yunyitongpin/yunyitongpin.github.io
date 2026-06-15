import { createRouter, createWebHistory } from 'vue-router'
import VideoLibraryView from '../views/VideoLibraryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'library',
      component: VideoLibraryView,
    },
    {
      path: '/games',
      name: 'games',
      // 小游戏模块，按需懒加载，单独打包。
      component: () => import('../views/GamesView.vue'),
    },
  ],
})

export default router
