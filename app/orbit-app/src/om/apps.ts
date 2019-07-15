import { command, getAppDefinition, loadMany, loadOne, observeMany, save, sortApps } from '@o/kit'
import { AppBit, AppModel, Space, RemoveAllAppDataCommand } from '@o/models'
import { Action, AsyncAction, Derive } from 'overmind'

import { orbitStaticApps } from '../apps/orbitApps'
import { appsCarouselStore } from '../pages/OrbitPage/OrbitAppsCarousel'
import { updatePaneManagerPanes } from './spaces/paneManagerEffects'
import { queryStore } from './stores'

export type AppsState = {
  allApps: AppBit[]
  activeSpace: Space | null
  activeApps: Derive<AppsState, AppBit[]>
  activeDockApps: Derive<AppsState, AppBit[]>
  activeClientApps: Derive<AppsState, AppBit[]>
  activeSettingsApps: Derive<AppsState, AppBit[]>
  lastActiveApp: Derive<AppsState, AppBit | undefined>
}

const isClientApp = (app: AppBit) => {
  const def = getAppDefinition(app.identifier!)
  return def && !!def.app
}

const dockAppIdentifiers = [
  // pins certain apps into dock (hardcoded for now)
  'quickFind',
  'clipboard',
  'query-builder',
  'apps',
  'settings',
]

export const state: AppsState = {
  allApps: [],
  activeSpace: null,
  activeApps: state => {
    if (!state.activeSpace) return []
    // this only includes client apps
    const paneSorted = state.activeSpace
      .paneSort!.map(appId => state.allApps.find(x => x.id === appId)!)
      .filter(Boolean)
    // add the rest of them in
    const allSortedIds = new Set([...paneSorted.map(x => x.id), ...state.allApps.map(x => x.id)])
    return [...allSortedIds].map(id => state.allApps.find(x => x.id === id)!)
  },
  activeClientApps: state => {
    const clientApps = state.activeApps.filter(
      app => isClientApp(app) && app.tabDisplay !== 'hidden',
    )
    // only client apps are sorted
    if (state.activeSpace) {
      return sortApps(clientApps, state.activeSpace!.paneSort || [])
    }
    return clientApps
  },
  activeSettingsApps: state => {
    return state.activeApps.filter(app => isClientApp(app) && app.tabDisplay === 'hidden')
  },
  lastActiveApp: (state, { router }) => {
    for (let i = router.history.length - 1; i > -1; i--) {
      const item = router.history[i]
      if (item.name !== 'app' || !item.params) continue
      const app = state.activeClientApps.find(app => `${app.id}` === item.params!.id)
      if (app) {
        return app
      }
    }
    // none yet, lets just use the first client app
    return state.activeClientApps[0]
  },
  activeDockApps: state => {
    const all = dockAppIdentifiers
      .map(x => state.activeApps.find(app => app.identifier! === x))
      // wtf typescript
      .filter<AppBit>((x): x is AppBit => x !== undefined)

    // we only want one of each, for some reason we are getting multiple, for now just filter to be sure
    const uids = [...new Set<string>(all.map(x => x.identifier!))]
    return uids.map(id => all.find(x => x.identifier === id)!)
  },
}

const setApps: Action<AppBit[]> = (om, apps) => {
  om.state.apps.allApps = apps
  om.effects.spaces.updatePaneSort(om.state.spaces.activeSpace, om.state.apps.activeApps)
  om.effects.apps.updatePaneManagerPanes(om.state.apps.activeApps)
  om.effects.apps.updateQueryStoreSources(apps)
  om.effects.apps.updateCarouselApps(om.state.apps.activeClientApps)
}

const setActiveSpace: Action<Space> = (om, space) => {
  om.state.apps.activeSpace = space
  om.effects.apps.updatePaneManagerPanes(om.state.apps.activeApps)
  om.effects.apps.ensureStaticAppBits(space)
}

const resetAllApps: AsyncAction = async om => {
  await command(RemoveAllAppDataCommand)
  // ensure the defaults are there
  om.effects.apps.ensureStaticAppBits(om.state.spaces.activeSpace)
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
  resetAllApps,
}

export const effects = {
  updatePaneManagerPanes,

  updateCarouselApps(apps: AppBit[]) {
    // load apps into carousel
    appsCarouselStore.setProps({
      apps,
    })
  },

  ensureStaticAppBits(activeSpace: Space) {
    const appDefs = orbitStaticApps
    for (const appDef of appDefs) {
      loadOne(AppModel, { args: { where: { identifier: appDef.id } } }).then(app => {
        if (!app) {
          const tabDisplay =
            appDef.id === 'setupApp' || appDef.id === 'bit' ? 'permanentLast' : 'hidden'
          const next: AppBit = {
            name: appDef.name,
            target: 'app',
            identifier: appDef.id,
            spaceId: activeSpace.id,
            icon: appDef.icon,
            colors: appDef.iconColors || ['#222', '#000'],
            tabDisplay,
          }
          console.log('ensuring model for static app', appDef.id, app, tabDisplay, next)
          save(AppModel, next)
        }
      })
    }
  },

  updateQueryStoreSources(apps: AppBit[]) {
    const sources = apps.map(x => ({
      name: x.name || '',
      type: x.identifier || '',
    }))
    queryStore.setSources(sources)
  },
}
