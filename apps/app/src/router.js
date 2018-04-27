import Router from '@mcro/router'

function runRouter() {
  return new Router({
    routes: {
      '/': require('./apps/main').default,
      '/orbit': require('./apps/orbit/orbit').default,
      '/peek': require('./apps/peek/peek').default,
      '/cosal': require('./apps/cosal').default,
      '/highlights': require('./apps/highlights/highlights').default,
      '/auth': require('./apps/auth').default,
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
