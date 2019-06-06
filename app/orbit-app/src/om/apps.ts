import { appSelectAllButDataAndTimestamps, loadMany, observeMany } from '@o/kit'
import { AppBit, AppModel, Space } from '@o/models'
import { Action, Derive } from 'overmind'

import { updatePaneManagerPanes } from './spaces/paneManagerEffects'

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
}

const setActiveSpace: Action<Space> = (om, space) => {
  om.state.apps.activeSpace = space
  om.effects.apps.updatePaneManagerPanes(om.state.apps.activeApps)
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
}
