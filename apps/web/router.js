import Router from 'motion-mobx-router'
import Home from '~/pages/home'
import Place from '~/pages/place'

const AppRouter = new Router({
  routes: {
    '/': Home,
    'g(/:name)': Place,
  },
})

export default AppRouter
