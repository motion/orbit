import { appSelectAllButDataAndTimestamps, observeMany } from '@o/kit'
import { AppBit, AppModel, Space } from '@o/models'
import { Action, Derive } from 'overmind'

type AppsState = {
  appsBySpace: { [key: number]: AppBit[] }
  activeSpace: Space
  activeApps: Derive<AppsState, AppBit[]>
}

export const state: AppsState = {
  activeSpace: null,
  appsBySpace: {},
  activeApps: state => (state.activeSpace && state.appsBySpace[state.activeSpace.id]) || null,
}

const setActiveSpace: Action<Space> = (om, space) => {
  om.state.apps.activeSpace = space
}

export const actions = {
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
