import { ensure, useReaction } from '@mcro/black'
import { isEqual } from '@mcro/fast-compare'
import { PaneManagerPane, PaneManagerStore } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import { getAppState } from '../helpers/getAppState'
import { getIsTorn } from '../helpers/getIsTorn'
import { useActions } from '../hooks/useActions'
import { useStoresSimple } from '../hooks/useStores'

export function usePaneManagerUpdatePanes() {
  const Actions = useActions()
  const { paneManagerStore, spaceStore } = useStoresSimple()

  useReaction(() => spaceStore.apps, function managePanes(apps) {
    ensure('apps', !!apps.length)
    const { panes, paneIndex } = getPanes(paneManagerStore, apps)
    if (!isEqual(panes, paneManagerStore.panes)) {
      paneManagerStore.setPanes(panes)
    }
    paneManagerStore.setPaneIndex(paneIndex)
    Actions.setInitialPaneIndex()
  })
}

export const settingsPane = {
  id: 'settings',
  name: 'Settings',
  type: 'settings',
  isHidden: true,
  keyable: true,
}

export const defaultPanes: PaneManagerPane[] = [
  { id: 'spaces', name: 'Spaces', type: 'spaces', isHidden: true, keyable: true },
  settingsPane,
  { id: 'apps', name: 'Apps', type: 'apps' },
  { id: 'createApp', name: 'Add app', type: 'createApp' },
  { id: 'onboard', name: 'Onboard', type: 'onboard' },
]

function appToPane(app: AppBit): PaneManagerPane {
  return {
    type: app.identifier,
    id: `${app.id}`,
    keyable: true,
    subType: 'app',
    name: app.name,
  }
}

function getTornPanes(apps: AppBit[]): PaneManagerPane[] {
  // torn window panes, remove the others besides active app + settings
  const appState = getAppState()
  const app = apps.find(app => +app.id === +appState.appId)
  console.log('setting panes by torn')
  if (!app) {
    console.warn(`No app found! ${JSON.stringify(appState)} ${JSON.stringify(apps)}`)
    return [settingsPane]
  }
  return [appToPane(app), settingsPane]
}

function getAppsPanes(apps: AppBit[]): PaneManagerPane[] {
  if (getIsTorn()) {
    getTornPanes(apps)
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
    console.warn(
      'removing pane you are currently on! moving to a different one',
      prevIndex,
      paneIndex,
    )
  }
  return {
    panes,
    paneIndex,
  }
}
