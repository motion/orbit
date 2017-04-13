import Router from 'motion-mobx-router'
import Home from '../views/pages/home'
import Place from '../views/pages/place'

export default new Router({
  routes: {
    '/': Home,
    'g(/:name)': Place,
  },
})
