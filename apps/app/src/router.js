// @flow
import Router from '@mcro/router'

function runRouter() {
  return new Router({
    routes: {
      '/orbit': require('./apps/orbit/orbit').default,
      '/relevancy': require('./apps/relevancy').default,
      '/auth': require('./apps/auth').default,
      '/peek': require('./apps/peek/peek').default,
      '/highlights': require('./apps/highlights/highlights').default,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter

// for hmr
if (module.hot) {
  module.hot.accept('.', () => {
    AppRouter = runRouter()
    window.App.render()
  })
}

export default AppRouter
