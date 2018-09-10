import Oracle from '@mcro/oracle'
import { store, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { stringify } from '@mcro/helpers'

type AppsManagerOptions = {
  oracle: Oracle
}

// @ts-ignore
@store
export class AppsManager {
  oracle: Oracle

  constructor({ oracle }: AppsManagerOptions) {
    this.oracle = oracle
  }

  manageAppIcons = react(
    () => App.appsState,
    appsState => {
      console.log('appsManager sees apps', stringify(appsState))
      // launch app icons and events to listen for focus
    },
  )
}
