import { loadOne, save } from '@o/bridge'
import { UserModel } from '@o/models'
import { filterCleanObject, stringToIdentifier } from '@o/ui'
import * as firebase from 'firebase/app'
import { Action, AsyncAction } from 'overmind'

import { ShareItem } from './state'

export const setNavVisible: Action<boolean> = ({ state }, x) => {
  state.navVisible = x
}

export const setNavHovered: Action<boolean> = ({ state }, x) => {
  state.navHovered = x
}

export const setShare: Action<{ id: string; value: ShareItem }> = ({ state }, { id, value }) => {
  state.share[id] = filterCleanObject(value)
}

export const rerenderApp: Action = () => {
  window['rerender']()
}

export const finishAuthorization: AsyncAction<{ path: string }> = async (_, { path }) => {
  if (firebase.auth().isSignInWithEmailLink(path)) {
    try {
      const user = await loadOne(UserModel, { args: {} })
      if (!user.email) throw new Error(`There is no email in user, something went wrong...`)

      const result = await firebase.auth().signInWithEmailLink(user.email, path)

      if (!result.user) {
        console.warn('no user')
        return
      }

      await save(UserModel, { ...user, cloudId: result.user.uid })

      console.log('authorization finished', result)
    } catch (error) {
      console.log('authorization error', error)
      throw error // not sure how do we handle this error in the UI
    }
  }
}

export const changeAppDevelopmentMode: AsyncAction<{
  packageId: string
  mode: 'development' | 'production'
}> = async (_, { packageId, mode }) => {
  const name = stringToIdentifier(packageId)
  return
  loadAppDLL(name, mode)
  // close old hot event listener
  window['__hot_handlers'][`app_${name}`].close()
}

function loadAppDLL(name: string, mode: 'development' | 'production') {
  const id = `app_script_${name}`
  const tag = document.getElementById(id)
  if (!tag) return
  tag.parentNode!.removeChild(tag)
  const body = document.getElementsByTagName('body')[0]
  const script = document.createElement('script')
  script.id = id
  script.src = `/${name}.${mode}.dll.js`
  script.type = 'text/javascript'
  body.appendChild(script)
}
