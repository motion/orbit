// @flow
import { User, Setting } from '@mcro/models'
import { store, watch } from '@mcro/black'
import { omit } from 'lodash'
import SuperLoginClient from 'superlogin-client'

// TODO: Constants.API_HOST
const API_HOST = `${window.location.host}`
const API_URL = `http://${API_HOST}`

function popup(url, title, win, w, h) {
  var y = win.top.outerHeight / 2 + win.top.screenY - h / 2
  var x = win.top.outerWidth / 2 + win.top.screenX - w / 2
  return win.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      y +
      ', left=' +
      x
  )
}

function passportLink(provider: string, options: Object = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const opts = {
      windowName: 'Login',
      width: 800,
      height: 600,
      ...options,
    }
    const path = `/auth/${provider}`

    // setup new response object
    let resolved = false
    window.passport = {}
    window.passport.oauthSession = info => {
      if (!info.error && info.token) {
        resolved = true
        return resolve(info)
      }
      return reject(`Got an oauth error: ${JSON.stringify(info)}`)
    }

    const authWindow = popup(
      path,
      opts.windowName,
      window,
      opts.width,
      opts.height
    )
    if (!authWindow) {
      return reject('Authorization popup blocked')
    }
    let authComplete = false
    const check = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(check)
        if (!authComplete) {
          authComplete = true
          if (resolved) {
            return
          }
          return reject('Authorization cancelled')
        }
      }
    })
  })
}

@store
class CurrentUser {
  connected = false
  localDb = null
  remoteDb = null
  sessionInfo = null
  superlogin: SuperLoginClient = SuperLoginClient

  @watch user = () => this.id && User.findOrCreate(this.id)
  @watch settings = () => this.id && Setting.find({ userId: this.id })
  @watch
  setting = () =>
    (this.settings &&
      this.settings.reduce((acc, cur) => ({ ...acc, [cur.type]: cur }), {})) ||
    {}

  constructor(options: Object) {
    this.options = options
    this.setupSuperLogin()
    this.connected = true
    this.start()
  }

  async start() {
    // temp user for now
    await User.findOrCreate('a@b.com')
    this.ensureSettings()
  }

  ensureSettings() {
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

  setupSuperLogin() {
    if (!this.options) {
      console.log('skipping superlogin')
      return
    }

    this.superlogin.configure(this.options)

    // sync
    this.superlogin.on('login', async () => {
      await this.setUserSession()
    })

    this.superlogin.on('logout', () => {
      this.sessionInfo = null
    })
  }

  get loggedIn() {
    return !!this.user
  }

  get id() {
    // return this.sessionInfo && this.sessionInfo.user_id
    return 'a@b.com'
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

  loginOrSignup = async (email, password) => {
    try {
      await this.login(email, password)
    } catch (loginError) {
      if (!loginError) {
        console.log('signed in', email)
        return
      } else if (loginError.message === 'Document update conflict') {
        console.log('got a weird conflict erorr, ignore')
        return
      }
      console.log('loginError', loginError)
      try {
        await this.signup(email, password)
      } catch (signupError) {
        if (loginError.message === 'Invalid username or password') {
          throw loginError
        } else {
          throw signupError
        }
      }
    }
  }

  signup = async (email: string, password: string) => {
    try {
      const username = email
      const res = await this.superlogin.register({
        email,
        username,
        password,
        confirmPassword: password,
      })
      console.log('registerNewUser: ', res, 'logging in...')
      await this.login(username, password) // this should be auto done
    } catch (error) {
      console.error('registerNewUser error: ', error)
      if (error && error.validationErrors) {
        const errors = Object.keys(error.validationErrors)
          .map(key => {
            return error.validationErrors[key]
          })
          .join(', ')
        console.error(errors)
      }
      throw `Registration Error: ${JSON.stringify(error)}`
    }
  }

  login = async (email: string, password: string) => {
    await this.superlogin.login({
      username: email,
      password,
    })
    console.log('login: user', this.user)
  }

  logout = async () => {
    this.remoteDb = null
    this.localDb = null
    await this.superlogin.logout()
  }

  link = async (provider: string, options: Object = {}) => {
    if (!this.user) {
      throw new Error(`No user`)
    }
    try {
      const info = await passportLink(provider, options)
      if (info) {
        console.log('Merging new oauth', info)
        await this.user.mergeUpdate({
          authorizations: {
            [provider]: info,
          },
        })
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
