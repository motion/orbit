import { OnInitialize } from 'overmind'

import { startAppLoadWatch } from '../apps/orbitApps'
import { urls } from './router'

export const onInitialize: OnInitialize = async om => {
  const { actions, effects } = om

  actions.router.routeListen({ url: urls.home, action: 'showHomePage' })
  actions.router.routeListen({ url: urls.app, action: 'showAppPage' })
  actions.router.routeListen({ url: urls.appSub, action: 'showAppPage' })
  actions.router.routeListenNotFound()

  // load user before spaces so we have activeSpace
  await actions.user.start()

  // load spaces before app so we have active space
  await actions.spaces.start()

  // load apps once before loading rest of app
  await actions.apps.start()

  // start watching for updated app ids
  startAppLoadWatch()

  effects.router.start()
}
