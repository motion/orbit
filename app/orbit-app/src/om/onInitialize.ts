import { Config, IContext, OnInitialize } from 'overmind'

import { getAllAppDefinitions, startAppLoadWatch } from '../apps/orbitApps'
import { runConfigurations } from '../configurations'
import { handleMediatorMessages } from './initialize/handleMediatorMessages'
import { urls } from './router'

export const onInitialize: OnInitialize = async om => {
  const { actions, effects } = om

  // start watching for updated app ids
  await startAppLoadWatch()

  runConfigurations({
    getLoadedApps: getAllAppDefinitions,
  })

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

  effects.router.watchPage()

  handleMediatorMessages()

  goToInitialApp(om)
}

function goToInitialApp(om: IContext<Config>) {
  if (!om.state.spaces.activeSpace.onboarded) {
    console.log(`hasn't onboarded, showing pane`)
    om.actions.router.showAppPage({ id: 'onboard' })
    return
  }
  if (window.location.pathname === '/') {
    om.actions.router.showHomePage({ avoidScroll: true })
  }
}
