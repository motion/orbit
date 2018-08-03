import Router from '@mcro/router'
import { MainPage } from './apps/MainPage'
import { IsolatePage } from './apps/IsolatePage'

let AppRouter

export function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': MainPage,
      '/isolate': IsolatePage,
    },
  })
  window['Router'] = AppRouter
}

runRouter()

// is something you can import directly
// TODO clean this up a lot
export default AppRouter
