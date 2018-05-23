import Router from '@mcro/router'
// import HomePage from '~/pages/HomePage'
import FeaturesPage from '~/pages/FeaturesPage'
import UseCasesPage from '~/pages/UseCasesPage'
import AboutPage from '~/pages/AboutPage'

function runRouter() {
  return new Router({
    routes: {
      '/': require('./pages/HomePage').default,
      '/features': FeaturesPage,
      '/use-cases': UseCasesPage,
      '/about': AboutPage,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter

window.restartRouter = () => {
  AppRouter = runRouter()
  window.Router = AppRouter
}

export default AppRouter
