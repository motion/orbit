import Router from '@mcro/router'
import Auth from '~/apps/auth'
import Main from '~/apps/main'

function runRouter() {
  return new Router({
    routes: {
      '/': Main,
      '/auth': Auth,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter

export default AppRouter
