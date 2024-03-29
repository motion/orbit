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
    console.warn('redoing save order to account for permanent/pinned/hidden')
    await save(SpaceModel, {
      ...space,
      paneSort,
    })
  }
}

export const updatePaneManagerPanes = (apps: AppBit[]) => {
  paneManagerStore.setPanes(getPanes(apps))
}

function getPanes(apps: AppBit[]): PaneManagerPane[] {
  if (App.isEditing) {
    let pane = {
      type: App.appConf.path!,
      id: String(App.appConf.appId),
    }
    return [pane, settingsPane]
  } else {
    const appPanes = apps
      .filter(x => {
        const def = getAppDefinition(x.identifier!)
        return !!(def && def.app)
      })
      .map((app: AppBit) => ({
        type: app.identifier!,
        id: `${app.id}`,
        keyable: app.tabDisplay !== 'hidden' ? true : false,
        subType: 'app',
        name: app.name,
      }))
    return appPanes
  }
}

export const settingsPane = {
  id: 'settings',
  name: 'Settings',
  type: 'settings',
  isHidden: true,
}

const tabDisplaySort = {
  permanent: 0,
  pinned: 1,
  plain: 2,
  permanentLast: 3,
}

const identifierSort = {
  searchResults: 1,
  setupApp: 2,
}

export function sortPanes(space: Space, apps: AppBit[]) {
  const appDict = keyBy(apps, 'id')

  let next = [
    ...new Set<number>([
      // keep current sort, remove deleted
      ...space.paneSort!.filter(id => appDict[id]),
      // add new
      ...sortBy(apps, x => `${x.id}`)
        .filter(x => x.tabDisplay !== 'hidden')
        .map(x => x.id!),
    ]),
  ]

  //  1. use tabdisplay to ensure they are in right order
  //  3. stable sort after that
  next = sortBy(next, id => {
    const a = appDict[id!]
    const index = `${next.indexOf(id)}`.padStart(20, '0')
    return `${tabDisplaySort[a.tabDisplay!]}${identifierSort[a.identifier!] || 0}${index}${a.id}`
  })

  return next
}
