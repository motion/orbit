import { appSelectAllButDataAndTimestamps, observeMany, loadMany } from '@o/kit'
import { AppBit, AppModel, Space } from '@o/models'
import { once } from 'lodash'
import { Action, Derive } from 'overmind'

import { updatePaneManagerPanes } from './spaces/paneManagerEffects'
import { paneManagerStore } from './stores'

export type AppsState = {
  apps: AppBit[]
  activeSpace: Space
  activeApps: Derive<AppsState, AppBit[]>
}

export const state: AppsState = {
  apps: [],
  activeSpace: null,
  activeApps: state =>
    (state.activeSpace && state.apps.filter(x => x.spaceId === state.activeSpace.id)) || [],
}

const setApps: Action<AppBit[]> = (om, apps) => {
  om.state.apps.apps = apps
  om.effects.apps.updatePaneManagerPanes(apps)
  om.effects.spaces.updatePaneSort(om.state.spaces.activeSpace, om.state.apps.activeApps)
}

const setActiveSpace: Action<Space> = (om, space) => {
  om.state.apps.activeSpace = space
}

export const actions = {
  setApps,
  setActiveSpace,
}

const allAppsArgs = {
  args: {
    select: appSelectAllButDataAndTimestamps,
  },
}

export const effects = {
  async start(om) {
    om.actions.apps.setApps(await loadMany(AppModel, allAppsArgs))
    observeMany(AppModel, allAppsArgs).subscribe(apps => {
      om.actions.apps.setApps(apps)
    })
  },

  setHomePane: once(() => {
    paneManagerStore.setActivePane(paneManagerStore.homePane.id)
  }),

  updatePaneManagerPanes,
}
