import { OnInitialize } from 'overmind'

import { startAppLoadWatch } from '../apps/orbitApps'
import { urls } from './router'

export const onInitialize: OnInitialize = async om => {
  const { actions, effects } = om
  effects.router.routeListen(urls.home, actions, actions.router.showHomePage)
  effects.router.routeListen(urls.app, actions, actions.router.showAppPage)
  effects.router.routeListen(urls.appSub, actions, actions.router.showAppPage)
  effects.router.routeListenNotFound()

  // load user before spaces so we have activeSpace
  await effects.user.start(om)

  // load spaces before app so we have active space
  await effects.spaces.start(om)

  // load apps once before loading rest of app
  await effects.apps.start(om)

  // start watching for updated app ids
  startAppLoadWatch()

  effects.router.start()
}
