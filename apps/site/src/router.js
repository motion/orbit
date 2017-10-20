// @flow
import Router from '@mcro/router'
import HomePage from '~/views/pages/home'
import ContextPage from '~/views/pages/context'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter

// for hmr
if (module.hot) {
  module.hot.accept(() => {
    AppRouter = runRouter()
    window.App.render()
  })
}

export default AppRouter
