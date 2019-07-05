import { command, loadOne, save } from '@o/bridge'
import { Bit, OpenCommand, UserModel } from '@o/models'
import { filterCleanObject } from '@o/ui'
import * as firebase from 'firebase/app'
import { Action, AsyncAction } from 'overmind'

export const setNavVisible: Action<boolean> = ({ state }, x) => {
  state.navVisible = x
}

export const setNavHovered: Action<boolean> = ({ state }, x) => {
  state.navHovered = x
}

export const setShare: Action<{ key: string; value: any }> = ({ state }, { key, value }) => {
  state.share[key] = filterCleanObject(value)
}

export const openItem: Action<Bit | string> = (_, item) => {
  let url = ''
  if (typeof item === 'string') {
    url = item
  } else if (item.target === 'bit') {
    url = item.desktopLink || item.webLink
  }
  if (url) {
    command(OpenCommand, { url })
  }
}

export const finishAuthorization: AsyncAction<{ path: string }> = async (_, { path }) => {
  console.log('finishAuthorization path', path)
  if (firebase.auth().isSignInWithEmailLink(path)) {
    try {
      const user = await loadOne(UserModel, { args: {} })
      if (!user.email) throw new Error(`There is no email in user, something went wrong...`)

      const result = await firebase.auth().signInWithEmailLink(user.email, path)

      await save(UserModel, { ...user, cloudId: result.user.uid })

      console.log('authorization finished', result)
    } catch (error) {
      console.log('authorization error', error)
      throw error // not sure how do we handle this error in the UI
    }
  }
}
