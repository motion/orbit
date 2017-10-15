// @flow
import { User, Setting } from '@mcro/models'
import { store, watch } from '@mcro/black'
import { omit } from 'lodash'
import passportLink from './passportLink'

// TODO: Constants.API_HOST
const API_HOST = `${window.location.host}`
const API_URL = `http://${API_HOST}`

@store
class CurrentUser {
  connected = false
  localDb = null
  remoteDb = null
  sessionInfo = null
  id = 'a@b.com'

  @watch user = () => this.id && User.findOrCreate(this.id)
  @watch settings = () => this.id && Setting.find({ userId: this.id })
  @watch
  setting = () =>
    (this.settings &&
      this.settings
        .filter(x => x.type && x.type !== 'undefined')
        .reduce((acc, cur) => ({ ...acc, [cur.type]: cur }), {})) ||
    {}

  constructor(options: Object) {
    this.options = options
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
      if (this.user.authorizations) {
        for (const type of Object.keys(this.user.authorizations)) {
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
    return this.user && this.user.authorizations
  }

  get refreshToken() {
    return this.user && this.user.refreshToken
  }

  get token(): (provider: string) => string {
    return (this.user && this.user.token) || (_ => '')
  }

  link = async (provider: string, options: Object = {}) => {
    if (!this.user) {
      throw new Error(`No user`)
    }
    try {
      const info = await passportLink(provider, options)
      if (info) {
        await this.user.mergeUpdate({
          authorizations: {
            [provider]: {
              ...info,
              updatedAt: Date.now(),
            },
          },
        })
        // double ensure sync
        await User.sync({ direction: { push: true } })
      }
    } catch (err) {
      return false
    }
  }

  unlink = async provider => {
    const user = this.user
    console.log('omitted is', omit(user.authorizations, [provider]))
    user.authorizations = omit(user.authorizations, [provider])
    await user.save()
  }

  setUserSession = async () => {
    try {
      if (this.superlogin) {
        this.sessionInfo = await this.superlogin.getSession()
      }
    } catch (e) {
      console.error('got err with current user get', e)
    }
  }
}

const user = new CurrentUser({
  providers: ['slack', 'github'],
  baseUrl: `${API_URL}/api/auth/`,
  endpoints: [API_HOST],
  storage: 'local', //   'local' | 'session'
  checkExpired: 'stateChange', // 'stateChange' ($stateChangeStart or $routeChangeStart is fired) | 'startup'
  refreshThreshold: 0.2, // eg: a token was issued at 1pm and expires at 2pm, threshold = 0.5, token will refresh at 1:30pm
})

// because
window.CurrentUser = user

export default user
