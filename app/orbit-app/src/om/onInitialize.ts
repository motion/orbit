import { observeOne } from '@o/kit'
import { WindowMessageModel, WorkspaceInfoModel } from '@o/models'
import { Config, IContext, OnInitialize } from 'overmind'

import { startAppLoadWatch } from '../apps/orbitApps'
import { runConfigurations } from '../configurations'
import { handleMediatorMessages } from './initialize/handleMediatorMessages'
import { urls } from './router'

export const onInitialize: OnInitialize = async om => {
  const { actions } = om

  // start watching for updated app ids
  startAppLoadWatch()

  runConfigurations()

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

  await actions.router.start()

  actions.develop.start()

  handleMediatorMessages()

  observeOne(WorkspaceInfoModel).subscribe(message => {
    console.log('workspace info', message)
  })
  observeOne(WindowMessageModel).subscribe(message => {
    console.log('app status', message)
  })

  goToInitialApp(om)
}

function goToInitialApp(om: IContext<Config>) {
  if (!om.state.spaces.activeSpace.onboarded) {
    console.log(`hasn't onboarded, showing pane`)
    om.actions.router.showAppPage({ id: 'onboard' })
    return
  }
}
