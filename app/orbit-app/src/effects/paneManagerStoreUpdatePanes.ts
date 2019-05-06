import { isEqual } from '@o/fast-compare'
import { PaneManagerPane, PaneManagerStore } from '@o/kit'
import { AppBit } from '@o/models'
import { appStartupConfig, isEditing } from '@o/stores'
import { ensure, useReaction } from '@o/use-store'

import { useStoresSimple } from '../hooks/useStores'
import { useOm } from '../om/om'

export function usePaneManagerUpdatePanes() {
  const { actions } = useOm()
  const { paneManagerStore, spaceStore } = useStoresSimple()

  useReaction(
    () => spaceStore.apps,
    function managePanes(apps) {
      ensure('apps', !!apps.length)
      const { panes, paneIndex } = getPanes(paneManagerStore, apps)
      if (!isEqual(panes, paneManagerStore.panes)) {
        paneManagerStore.setPanes(panes)
      }
      paneManagerStore.setPaneIndex(paneIndex)
      actions.router.start()
    },
    [paneManagerStore, spaceStore],
  )
}

export const settingsPane = {
  id: 'settings',
  name: 'Settings',
  type: 'settings',
  isHidden: true,
  keyable: true,
}

export const loadingPane = {
  id: 'loading',
  name: 'Loading',
  type: 'loading',
  isHidden: true,
  keyable: true,
}

export const defaultPanes: PaneManagerPane[] = [
  { id: 'spaces', name: 'Spaces', type: 'spaces', isHidden: true, keyable: true },
  settingsPane,
  { id: 'apps', name: 'Apps', type: 'apps' },
  { id: 'data-explorer', name: 'Data Explorer', type: 'data-explorer' },
  { id: 'setupApp', name: 'New app', type: 'setupApp' },
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

function getAppsPanes(apps: AppBit[]): PaneManagerPane[] {
  if (isEditing) {
    let pane = {
      type: appStartupConfig.appInDev.path,
      id: String(appStartupConfig.appId),
    }
    return [pane, settingsPane]
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
  }
  return {
    panes,
    paneIndex,
  }
}
