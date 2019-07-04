import { getAppDefinition, loadMany, loadOne, observeMany, save, sortApps } from '@o/kit'
import { AppBit, AppModel, Space } from '@o/models'
import { Action, AsyncAction, Derive } from 'overmind'

import { orbitStaticApps } from '../apps/orbitApps'
import { updatePaneManagerPanes } from './spaces/paneManagerEffects'
import { queryStore } from './stores'

export type AppsState = {
  allApps: AppBit[]
  activeSpace: Space
  activeApps: Derive<AppsState, AppBit[]>
  activeClientApps: Derive<AppsState, AppBit[]>
  activeSettingsApps: Derive<AppsState, AppBit[]>
}

export const state: AppsState = {
  allApps: [],
  activeSpace: null,
  activeApps: state => {
    const all =
      (state.activeSpace && state.allApps.filter(x => x.spaceId === state.activeSpace.id)) || []
    return state.activeSpace ? sortApps(all, state.activeSpace.paneSort) : all
  },
  activeClientApps: state => {
    return state.activeApps.filter(
      app => !!getAppDefinition(app.identifier).app && app.tabDisplay !== 'hidden',
    )
  },
  activeSettingsApps: state => {
    return state.activeApps.filter(
      app => !!getAppDefinition(app.identifier).app && app.tabDisplay === 'hidden',
    )
  },
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

const start: AsyncAction = async om => {
  const appsQuery = { args: { where: { spaceId: om.state.spaces.activeSpace.id } } }
  om.actions.apps.setApps(await loadMany(AppModel, appsQuery))
  observeMany(AppModel, appsQuery).subscribe(apps => {
    om.actions.apps.setApps(apps)
  })
}

export const actions = {
  start,
  setApps,
  setActiveSpace,
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
            tabDisplay: appDef.id === 'setupApp' ? 'permanentLast' : 'hidden',
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
