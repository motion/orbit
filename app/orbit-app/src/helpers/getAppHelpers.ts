import { App } from '@mcro/stores'
import { APP_ID } from '../constants'

export function getAppState() {
  const { allApps } = App.state
  return allApps.find(x => x.id === APP_ID)
}

export function getIsTorn() {
  const { allApps } = App.state
  const isLastApp = allApps.findIndex(x => x.id === APP_ID) === allApps.length - 1
  // if its the last app its torn
  return !isLastApp
}
