// @flow
import global from 'global'
import { Model, array, object, str } from '@mcro/model'
import * as Constants from '~/constants'

export const methods = {
  token(provider: string) {
    return (
      this.authorizations &&
      this.authorizations[provider] &&
      this.authorizations[provider].token
    )
  },

  async refreshToken(provider: string) {
    if (!provider) {
      throw new Error(`no provider ${provider}`)
    }
    let info
    try {
      info = await fetch(`/auth/refreshToken/${provider}`)
    } catch (error) {
      console.log('refreshToken error', error)
      return null
    }
    info = await info.json()
    if (info && info instanceof Object) {
      const update = {
        authorizations: {
          [provider]: {
            token: info.refreshToken,
          },
        },
      }
      await this.mergeUpdate(update)
    }
    return info.refreshToken
  },
}

export class UserModel extends Model {
  static props = {
    id: str.primary,
    name: str.optional,
    username: str.optional,
    type: str.optional,
    roles: array.optional.items(str),
    providers: array.optional.items(str),
    unverifiedEmail: object.optional,
    local: object.optional,
    signUp: object.optional,
    personalDBs: object.optional,
    activity: array.optional.items(object),
    session: object.optional,
    authorizations: object,
  }

  static defaultProps = {
    authorizations: {},
  }

  settings = {
    database: 'users',
    autoSync: {
      push: !!Constants.AUTH_SERVICE,
      pull: 'basic',
    },
  }

  methods = methods
}

const UserInstance = new UserModel()
global.User = UserInstance

export default UserInstance
