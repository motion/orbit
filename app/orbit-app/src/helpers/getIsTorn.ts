import { App } from '@o/stores'
import { APP_ID } from '../constants'

export function getIsTorn() {
  const { allApps } = App.state
  const isLastApp = allApps.findIndex(x => x.id === APP_ID) === allApps.length - 1
  // if its the last app its torn
  return !isLastApp
}
