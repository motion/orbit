import Home from './views/home'
import Projects from './views/projects'

export default {
  '/': Home,
  'project/:id(/tab/:tab)(/job/:job)': Projects,
}
