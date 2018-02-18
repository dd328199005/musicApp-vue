import Vue from 'vue'
import Router from 'vue-router'
import rank from 'components/rank/rank'
import recommend from 'components/recommend/recommend'
import search from 'components/search/search'
import singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank
    },
    {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
    
  ]
})
