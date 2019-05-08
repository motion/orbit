import { observeMany, loadMany } from '@o/kit'
import { Space, SpaceModel, User } from '@o/models'
import { Action, Derive } from 'overmind'

import { deepClone } from '../helpers'
import { updatePaneSort } from './spaces/paneManagerEffects'

export type SpacesState = {
  spaces: Space[]
  activeUser: User
  activeSpace: Derive<SpacesState, Space>
}

const getActiveSpace = state =>
  (state.activeUser && state.spaces.find(x => x.id === state.activeUser.activeSpace)) || null

export const state: SpacesState = {
  spaces: [],
  activeUser: null,
  activeSpace: getActiveSpace,
}

const setSpaces: Action<Space[]> = (om, spaces) => {
  if (!spaces) return
  om.state.spaces.spaces = spaces
  om.actions.apps.setActiveSpace(
    deepClone(getActiveSpace({ spaces, activeUser: om.state.spaces.activeUser })),
  )
  om.effects.apps.updatePaneManagerPanes(om.state.apps.activeApps)
  om.effects.spaces.updatePaneSort(om.state.apps.activeApps)
}

const setUser: Action<User> = (om, user) => {
  om.state.spaces.activeUser = user
}

export const actions = {
  setSpaces,
  setUser,
}

export const effects = {
  async start(om) {
    const args = { args: {} }
    om.actions.spaces.setSpaces(await loadMany(SpaceModel, args))
    observeMany(SpaceModel, args).subscribe(spaces => {
      om.actions.spaces.setSpaces(spaces)
    })
  },

  updatePaneSort,
}
