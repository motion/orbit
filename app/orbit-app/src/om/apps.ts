import { appSelectAllButDataAndTimestamps, loadMany, loadOne, observeMany, save } from '@o/kit'
import { AppBit, AppModel, Space } from '@o/models'
import { Action, Derive } from 'overmind'

import { orbitStaticApps } from '../apps/orbitApps'
import { updatePaneManagerPanes } from './spaces/paneManagerEffects'
import { queryStore } from './stores'

export type AppsState = {
  allApps: AppBit[]
  activeSpace: Space
  activeApps: Derive<AppsState, AppBit[]>
}

export const state: AppsState = {
  allApps: [],
  activeSpace: null,
  activeApps: state =>
    (state.activeSpace && state.allApps.filter(x => x.spaceId === state.activeSpace.id)) || [],
}

const setApps: Action<AppBit[]> = (om, apps) => {
  om.state.apps.allApps = apps
  om.effects.spaces.updatePaneSort(om.state.spaces.activeSpace, om.state.apps.activeApps)
  om.effects.apps.updatePaneManagerPanes(om.state.apps.activeApps)
  om.effects.apps.updateQueryStoreSources(apps)
}

const setActiveSpace: Action<Space> = (om, space) => {
  om.state.apps.activeSpace = space
  om.effects.apps.updatePaneManagerPanes(om.state.apps.activeApps)
  om.effects.apps.ensureStaticAppBits(space)
}

const start: Action = async om => {
  om.actions.apps.setApps(await loadMany(AppModel, allAppsArgs))
  observeMany(AppModel, allAppsArgs).subscribe(apps => {
    om.actions.apps.setApps(apps)
  })
}

export const actions = {
  start,
  setApps,
  setActiveSpace,
}

const allAppsArgs = {
  args: {
    select: appSelectAllButDataAndTimestamps,
  },
}

export const effects = {
  updatePaneManagerPanes,

  ensureStaticAppBits(activeSpace: Space) {
    const appDefs = orbitStaticApps
    for (const appDef of appDefs) {
      loadOne(AppModel, { args: { where: { identifier: appDef.id } } }).then(app => {
        if (!app) {
          console.log('ensuring model for static app', appDef)
          save(AppModel, {
            name: appDef.name,
            target: 'app',
            identifier: appDef.id,
            spaceId: activeSpace.id,
            icon: appDef.icon,
            colors: ['black', 'white'],
            tabDisplay: 'hidden',
          })
        }
      })
    }
  },

  updateQueryStoreSources(apps: AppBit[]) {
    const sources = apps.map(x => ({
      name: x.name,
      type: x.identifier,
    }))
    queryStore.setSources(sources)
  },
}
