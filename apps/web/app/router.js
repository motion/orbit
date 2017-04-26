import Router from 'motion-mobx-router'
import Home from '~/pages/home'
import Me from '~/pages/me'
import Place from '~/pages/place'
import Doc from '~/pages/doc'

const AppRouter = new Router({
  routes: {
    '/': Home,
    '/me': Me,
    'g/:name': Place,
    'd/:id': Doc,
  },
})

export default AppRouter
