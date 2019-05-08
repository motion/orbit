import { isEqual } from '@o/fast-compare'
import { AppBit, getAppDefinition, PaneManagerPane, save } from '@o/kit'
import { Space, SpaceModel } from '@o/models'
import { appStartupConfig, isEditing } from '@o/stores'
import { keyBy, sortBy } from 'lodash'

import { paneManagerStore } from '../stores'

export const updatePaneSort = async (apps: AppBit[]) => {
  const space = om.state.spaces.activeSpace
  if (!space) return
  const paneSort = sortPanes(space, apps)
  if (!isEqual(paneSort, space.paneSort)) {
    await save(SpaceModel, {
      ...space,
      paneSort,
    })
  }
}

export const updatePaneManagerPanes = (apps: AppBit[]) => {
  const { panes, paneIndex } = getPanes(apps)
  console.log('setting panes', paneIndex, panes)
  debugger
  paneManagerStore.setPanes(panes)
  paneManagerStore.setPaneIndex(paneIndex)
}

function getPanes(apps: AppBit[]) {
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

function getAppsPanes(apps: AppBit[]): PaneManagerPane[] {
  if (isEditing) {
    let pane = {
      type: appStartupConfig.appInDev.path,
      id: String(appStartupConfig.appId),
    }
    return [pane, settingsPane]
  } else {
    const appPanes = apps.filter(x => !!getAppDefinition(x.identifier).app).map(appToPane)
    return [...defaultPanes, ...appPanes]
  }
}

function appToPane(app: AppBit): PaneManagerPane {
  return {
    type: app.identifier,
    id: `${app.id}`,
    keyable: true,
    subType: 'app',
    name: app.name,
  }
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
  { id: 'data-explorer', name: 'Data Explorer', type: 'data-explorer' },
  { id: 'setupApp', name: 'New app', type: 'setupApp' },
  { id: 'onboard', name: 'Onboard', type: 'onboard' },
]

const tabDisplaySort = {
  permanent: 0,
  pinned: 1,
  plain: 2,
}

export function sortPanes(space: Space, apps: AppBit[]) {
  const appDict = keyBy(apps, 'id')

  let next = [
    ...new Set([
      // keep current sort, remove deleted
      ...space.paneSort.filter(id => appDict[id]),
      // add new
      ...apps.filter(x => x.tabDisplay !== 'hidden').map(x => x.id),
    ]),
  ]

  // ensure:
  //  1. editable at front
  //  2. pinned after that
  //  3. stable sort after that
  next = sortBy(next, id => {
    const a = appDict[id]
    return `${tabDisplaySort[a.tabDisplay]}${a.id}`
  })

  return next
}
