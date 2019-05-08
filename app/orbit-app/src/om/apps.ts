import { appSelectAllButDataAndTimestamps, observeMany } from '@o/kit'
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
  om.effects.apps.setHomePane()
}

const setActiveSpace: Action<Space> = (om, space) => {
  om.state.apps.activeSpace = space
}

export const actions = {
  setApps,
  setActiveSpace,
}

export const effects = {
  start(om) {
    observeMany(AppModel, {
      args: {
        select: appSelectAllButDataAndTimestamps,
      },
    }).subscribe(apps => {
      om.actions.apps.setApps(apps)
    })
  },

  setHomePane: once(() => {
    paneManagerStore.setActivePane(paneManagerStore.homePane.id)
  }),

  updatePaneManagerPanes,
}
