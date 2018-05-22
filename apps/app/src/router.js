import Router from '@mcro/router'

function runRouter() {
  return new Router({
    routes: {
      '/': require('./apps/main').default,
      '/orbit': require('./apps/orbit/orbit').default,
      '/peek': require('./apps/peek/peek').default,
      '/highlights': require('./apps/highlights/highlights').default,
      '/relevancy': require('./apps/relevancy').default,
      '/auth': require('./apps/auth').default,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter
window.runRouter = runRouter

export default AppRouter
