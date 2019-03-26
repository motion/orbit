import * as firebase from 'firebase'
import { loadOne, save } from '@o/bridge'
import { UserModel } from '@o/models'

export const finishAuthorization = async (path: string) => {
  console.log('finishAuthorization path', path)
  if (firebase.auth().isSignInWithEmailLink(path)) {
    try {
      const user = await loadOne(UserModel, { args: {} })
      if (!user.email)
        throw new Error(`There is no email in user, something went wrong...`)

      const result = await firebase
        .auth()
        .signInWithEmailLink(user.email, path)

      await save(UserModel, { ...user, cloudId: result.user.uid })

      console.log('authorization finished', result)

    } catch (error) {
      console.log('authorization error', error)
      throw error // not sure how do we handle this error in the UI

    }
  }
}
