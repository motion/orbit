import { observeMany } from '@o/kit'
import { Space, SpaceModel, User } from '@o/models'
import { Action, Derive } from 'overmind'

type StateState = {
  spaces: Space[]
  activeUser: User
  activeSpace: Derive<StateState, Space>
}

export const state: StateState = {
  spaces: [],
  activeUser: null,
  activeSpace: state =>
    (state.activeUser && state.spaces.find(x => x.id === state.activeUser.activeSpace)) || null,
}

const setSpaces: Action<Space[]> = (om, spaces) => {
  om.state.spaces.spaces = spaces
  const activeSpace = om.state.spaces.activeSpace
  console.log('did derive update yet?', activeSpace)
  om.actions.apps.setActiveSpace(activeSpace)
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
