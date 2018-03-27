import { store } from '@mcro/black/store'
import { omit } from 'lodash'
import Gun from 'gun/gun'
import global from 'global'

const gun = Gun()
console.log('gun', gun)

@store
class User {
  version = 0

  get user() {
    return gun.user()
  }

  get bucket() {
    return 'Default'
  }

  get loggedIn() {
    return !!this.user
  }

  get authorizations() {
    this.version
    return this.user && this.user.authorizations
  }

  constructor() {
    try {
      gun.user().create('username', 'password')
    } catch (err) {
      gun.user().auth('admin', 'password')
    }
  }

  token(provider) {
    return (
      this.authorizations &&
      this.authorizations[provider] &&
      this.authorizations[provider].token
    )
  }

  async refreshToken(provider) {
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
  }

  async setAuthorizations(authorizations) {
    await this.user.put({
      authorizations,
    })
    this.version++
  }

  unlink = async provider => {
    const user = this.user
    console.log('omitted is', omit(user.authorizations, [provider]))
    user.authorizations = omit(user.authorizations, [provider])
    await user.save()
  }
}

const user = new User()
global.User = user

export default user
