import { isEqual } from '@o/fast-compare'
import { loadOne, observeOne } from '@o/kit'
import { User, UserModel } from '@o/models'
import { App } from '@o/stores'
import { Action } from 'overmind'

type UserState = {
  user: User
}

export const state: UserState = {
  user: null,
}

const setUser: Action<User> = (om, user) => {
  if (user !== om.state.user.user) {
    om.state.user.user = user
    om.actions.spaces.setUser(user)
    if (!isEqual(user.settings, App.state.userSettings)) {
      App.setState({ userSettings: user.settings })
    }
  }
}

const start: Action = async om => {
  const args = { args: {} }
  om.actions.user.setUser(await loadOne(UserModel, args))
  observeOne(UserModel, args).subscribe(user => {
    if (user) {
      om.actions.user.setUser(user)
    }
  })
}

export const actions = {
  start,
  setUser,
}
