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
  lastActiveApp: Derive<AppsState, AppBit | undefined>
}

const isClientApp = (app: AppBit) => {
  const def = getAppDefinition(app.identifier)
  return def && !!def.app
}

export const state: AppsState = {
  allApps: [],
  activeSpace: null,
  activeApps: state => {
    return (
      (state.activeSpace && state.allApps.filter(x => x.spaceId === state.activeSpace.id)) || []
    )
  },
  activeClientApps: state => {
    const clientApps = state.activeApps.filter(
      app => isClientApp(app) && app.tabDisplay !== 'hidden',
    )
    // only client apps are sorted
    if (state.activeSpace) {
      return sortApps(clientApps, state.activeSpace.paneSort)
    }
    return clientApps
  },
  activeSettingsApps: state => {
    return state.activeApps.filter(app => isClientApp(app) && app.tabDisplay === 'hidden')
  },
  lastActiveApp: (state, { router }) => {
    for (let i = router.history.length - 1; i > -1; i--) {
      const item = router.history[i]
      if (item.name !== 'app') continue
      const app = state.activeClientApps.find(app => `${app.id}` === item.params.id)
      if (app) {
        return app
      }
    }
    // none yet, lets just use the first client app
    return state.activeClientApps[0]
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
