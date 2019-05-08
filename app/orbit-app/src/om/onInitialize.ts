import { OnInitialize } from 'overmind'

import { urls } from './router'

export const onInitialize: OnInitialize = async om => {
  const { actions, effects } = om
  effects.router.routeListen(urls.home, actions, actions.router.showHomePage)
  effects.router.routeListen(urls.app, actions, actions.router.showAppPage)
  effects.router.routeListen(urls.appSub, actions, actions.router.showAppPage)
  effects.router.routeListenNotFound()

  // load apps once before loading rest of app
  await effects.apps.start(om)

  effects.router.start()

  effects.spaces.start(om)

  effects.user.start(om)
}
