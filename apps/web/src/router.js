// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import BarPage from './apps/bar'
import EmptyPage from './apps/empty'
import MasterDetailPage from './apps/masterDetail'
import { render } from './start'

let AppRouter

function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': HomePage,
      '/vibrancy': EmptyPage,
      bar: BarPage,
      master: MasterDetailPage,
    },
  })
  // because doing in installDevTools would break import order
  window.Router = AppRouter
}

// for hmr
if (module.hot) {
  module.hot.accept(() => {
    log('accept: ./router.js')
    runRouter()
    render()
  })
}

runRouter()

export default AppRouter
