import { OnInitialize } from 'overmind'

import { urls } from './router'

export const onInitialize: OnInitialize = ({ actions, effects }) => {
  effects.router.routeListen(urls.home, actions, actions.router.showHomePage)
  effects.router.routeListen(urls.app, actions, params => actions.router.showAppPage(params))
  effects.router.routeListen(urls.appSub, actions, params => actions.router.showAppPage(params))
  effects.router.routeListenNotFound()
}
