import { OnInitialize } from 'overmind'

import { urls } from './router'

export const onInitialize: OnInitialize = om => {
  const { actions, effects } = om
  effects.router.routeListen(urls.home, actions, actions.router.showHomePage)
  effects.router.routeListen(urls.app, actions, actions.router.showAppPage)
  effects.router.routeListen(urls.appSub, actions, actions.router.showAppPage)
  effects.router.routeListenNotFound()
  effects.router.start()

  effects.spaces.start(om)

  effects.apps.start(om)

  effects.user.start(om)
}
