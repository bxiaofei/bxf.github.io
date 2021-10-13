import Vue from 'vue'
import Router from 'vue-router'
import KeyWordsAdvantage from '@/container/keywords-advantage/keywords-advantage'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'KeyWordsAdvantage',
      meta: {
        title: 'KeyWordsAdvantage'
      },
      component: KeyWordsAdvantage
    }
  ]
})

export default router
