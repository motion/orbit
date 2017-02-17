import Router from 'motion-router'
import Home from '../views/home'
import Projects from '../views/projects'

export default new Router({
  routes: {
    '/': Home,
    'project/:id(/tab/:tab)(/job/:job)': Projects,
  },
})
