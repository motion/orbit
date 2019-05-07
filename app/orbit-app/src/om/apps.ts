import { appSelectAllButDataAndTimestamps, observeMany } from '@o/kit'
import { AppBit, AppModel, Space } from '@o/models'
import { Action, Derive } from 'overmind'

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
  om.effects.spaces.updatePaneManagerPanes(om)
}

const setActiveSpace: Action = om => {
  om.state.apps.activeSpace = { ...om.state.spaces.activeSpace }
}

export const actions = {
  setApps,
  setActiveSpace,
}

export const effects = {
  observeApps(om) {
    observeMany(AppModel, {
      args: {
        select: appSelectAllButDataAndTimestamps,
      },
    }).subscribe(apps => {
      om.actions.apps.setApps(apps)
    })
  },
}
