// @flow
import Router from '@mcro/router'
import HomePage from '~/views/pages/home'
import SalesPage from '~/views/pages/sales'
import SupportPage from '~/views/pages/support'
import PricingPage from '~/views/pages/pricing'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
      '/sales': SalesPage,
      '/support': SupportPage,
      '/pricing': PricingPage,
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
