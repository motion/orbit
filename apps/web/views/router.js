import Router from 'motion-mobx-router'
import Home from '../views/pages/home'
import Place from '../views/pages/place'

const AppRouter = new Router({
  routes: {
    '/': Home,
    'g(/:name)': Place,
  },
})

window.Router = AppRouter

export default AppRouter
