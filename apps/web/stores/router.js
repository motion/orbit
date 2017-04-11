import Router from 'motion-mobx-router'
import Home from '../views/home'
import Projects from '../views/projects'

export default new Router({
  routes: {
    '/': Home,
    'projects(/:id)(/tab/:tab)': Projects,
  },
})
