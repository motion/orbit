// @flow
import { User, Setting } from '@mcro/models'
import { store, watch } from '@mcro/black'
import { omit } from 'lodash'

@store
class CurrentUser {
  connected = false
  localDb = null
  remoteDb = null
  sessionInfo = null
  id = 'a@b.com'
  version = 0

  @watch user = () => this.id && User.connected && User.findOne(this.id)

  @watch
  settings = () =>
    this.id && Setting.connected && Setting.find({ userId: this.id })

  @watch
  setting = () =>
    (this.settings &&
      this.settings
        .filter(x => x.type && x.type !== 'undefined')
        .reduce((acc, cur) => ({ ...acc, [cur.type]: cur }), {})) ||
    {}

  constructor() {
    this.connected = true
    this.start()
  }

  async start() {
    // temp user for now
    await User.findOrCreate('a@b.com')
    this._ensureSettings()
  }

  _ensureSettings() {
    this.watch(async () => {
      if (!this.user) {
        return
      }
      if (this.authorizations) {
        for (const type of Object.keys(this.authorizations)) {
          await Setting.findOrCreate({
            userId: this.id,
            type,
          })
        }
      }
    })
  }

  get loggedIn() {
    return !!this.user
  }

  get authorizations() {
    this.version
    return this.user && this.user.authorizations
  }

  async setAuthorizations(authorizations) {
    await this.user.mergeUpdate({
      authorizations,
    })
    this.version++
  }

  get refreshToken() {
    return this.user && this.user.refreshToken
  }

  get token(): (provider: string) => string {
    return (this.user && this.user.token) || (_ => '')
  }

  unlink = async provider => {
    const user = this.user
    console.log('omitted is', omit(user.authorizations, [provider]))
    user.authorizations = omit(user.authorizations, [provider])
    await user.save()
  }
}

const user = new CurrentUser()

// because
window.CurrentUser = user

export default user
