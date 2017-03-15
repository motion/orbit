import Router from 'motion-mobx-router'
import Home from '../views/home'
import Projects from '../views/projects'

console.log('re-require', Home)

export default new Router({
  routes: {
    '/': Home,
    'projects(/:id)(/tab/:tab)': Projects,
  },
})
