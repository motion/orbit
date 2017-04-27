import Router from 'motion-mobx-router'
import Feed from '~/pages/feed'
import Me from '~/pages/me'
import Place from '~/pages/place'
import Doc from '~/pages/doc'

const AppRouter = new Router({
  routes: {
    '/': Me,
    '/me': Feed,
    'g/:slug': Place,
    'd/:id': Doc,
  },
})

export default AppRouter
