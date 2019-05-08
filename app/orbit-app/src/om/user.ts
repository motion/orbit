import { observeOne } from '@o/kit'
import { User, UserModel } from '@o/models'
import { Action } from 'overmind'

type UserState = {
  user: User
}

export const state: UserState = {
  user: null,
}

const setUser: Action<User> = (om, user) => {
  om.state.user.user = user
  om.actions.spaces.setUser(user)
}

export const actions = {
  setUser,
}

export const effects = {
  start(om) {
    observeOne(UserModel, { args: {} }).subscribe(user => {
      om.actions.user.setUser(user)
    })
  },
}
