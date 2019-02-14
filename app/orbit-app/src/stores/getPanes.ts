import { AppBit } from '@mcro/models'
import { getAppState, getIsTorn } from '../helpers/getAppHelpers'
import { Pane, PaneManagerStore } from './PaneManagerStore'

const settingsPane = {
  id: 'settings',
  name: 'Settings',
  type: 'settings',
  isHidden: true,
  keyable: true,
}

export const defaultPanes: Pane[] = [
  { id: 'sources', name: 'Sources', type: 'sources', isHidden: true, keyable: true },
  { id: 'spaces', name: 'Spaces', type: 'spaces', isHidden: true, keyable: true },
  settingsPane,
  { id: 'apps', name: 'Apps', type: 'apps' },
  { id: 'createApp', name: 'Add app', type: 'createApp' },
  { id: 'onboard', name: 'Onboard', type: 'onboard' },
]

function appToPane(app: AppBit): Pane {
  return {
    type: app.type,
    id: `${app.id}`,
    keyable: true,
    subType: 'app',
    name: app.name,
  }
}

function getAppsPanes(apps: AppBit[]): Pane[] {
  const isTorn = getIsTorn()
  if (isTorn) {
    // torn window panes, remove the others besides active app + settings
    const appState = getAppState()
    const app = apps.find(app => +app.id === +appState.appId)
    if (!app) {
      console.warn(`No app found! ${JSON.stringify(appState)} ${JSON.stringify(apps)}`)
      return [settingsPane]
    }
    return [appToPane(app), settingsPane]
  } else {
    const appPanes = apps.map(appToPane)
    return [...defaultPanes, ...appPanes]
  }
}

export function getPanes(paneManagerStore: PaneManagerStore, apps: AppBit[]) {
  let paneIndex = 0
  const currentPaneId = paneManagerStore.activePane.id
  const panes = getAppsPanes(apps)
  paneIndex = panes.findIndex(pane => pane.id === currentPaneId)
  // move left one tab if were removing current tab
  if (paneIndex === -1) {
    const prevPane = paneManagerStore.panes[paneManagerStore.paneIndex - 1]
    const prevIndex = prevPane
      ? paneManagerStore.panes.findIndex(pane => pane.id === prevPane.id)
      : 0
    paneIndex = prevIndex === -1 ? 0 : prevIndex
    console.warn('removing pane you are currently on! moving to a different one')
  }
  return {
    panes,
    paneIndex,
  }
}
