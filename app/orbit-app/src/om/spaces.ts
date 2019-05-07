import { observeMany } from '@o/kit'
import { Space, SpaceModel, User } from '@o/models'
import { Action, Derive } from 'overmind'

type StateState = {
  spaces: Space[]
  activeUser: User
  activeSpace: Derive<StateState, Space>
}

const getActiveSpace = state =>
  (state.activeUser && state.spaces.find(x => x.id === state.activeUser.activeSpace)) || null

export const state: StateState = {
  spaces: [],
  activeUser: null,
  activeSpace: getActiveSpace,
}

const setSpaces: Action<Space[]> = (om, spaces) => {
  om.state.spaces.spaces = spaces
  om.actions.apps.setActiveSpace(getActiveSpace(om.state.spaces))
}

const setUser: Action<User> = (om, user) => {
  om.state.spaces.activeUser = user
}

export const actions = {
  setSpaces,
  setUser,
}

export const effects = {
  observeSpaces(om) {
    observeMany(SpaceModel, { args: {} }).subscribe(spaces => {
      om.actions.spaces.setSpaces(spaces)
    })
  },
}
