import { isEqual } from '@o/fast-compare'
import { AppBit, getAppDefinition, PaneManagerPane, save } from '@o/kit'
import { Space, SpaceModel } from '@o/models'
import { App } from '@o/stores'
import { keyBy, sortBy } from 'lodash'

import { paneManagerStore } from '../stores'

export const updatePaneSort = async (space: Space, apps: AppBit[]) => {
  if (!space || !apps.length) return
  const paneSort = sortPanes(space, apps)
  if (!isEqual(paneSort, space.paneSort)) {
    await save(SpaceModel, {
      ...space,
      paneSort,
    })
  }
}

export const updatePaneManagerPanes = (apps: AppBit[]) => {
  paneManagerStore.setPanes(getAppsPanes(apps))
}

function getAppsPanes(apps: AppBit[]): PaneManagerPane[] {
  if (App.isEditing) {
    let pane = {
      type: App.appConf.path,
      id: String(App.appConf.appId),
    }
    return [pane, settingsPane]
  } else {
    const appPanes = apps
      .filter(x => {
        const def = getAppDefinition(x.identifier)
        return !!(def && def.app)
      })
      .map(appToPane)
    console.log('123', apps, appPanes)
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
  { id: 'query-builder', name: 'Query Builder', type: 'query-builder' },
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
