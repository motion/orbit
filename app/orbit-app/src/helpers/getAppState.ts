import { App } from '@mcro/stores'
import { APP_ID } from '../constants'

export function getAppState() {
  const { allApps } = App.state
  return allApps.find(x => x.id === APP_ID)
}
