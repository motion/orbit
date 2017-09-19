// @flow
import { User, Setting } from '@mcro/models'
import { store, watch } from '@mcro/black'
import SuperLoginClient from 'superlogin-client'

// TODO: Constants.API_HOST
const API_HOST = `${window.location.host}`
const API_URL = `http://${API_HOST}`

@store
class CurrentUser {
  connected = false
  localDb = null
  remoteDb = null
  sessionInfo = null
  superlogin: SuperLoginClient = SuperLoginClient

  @watch userInfo = () => this.id && User.findOne(this.id)
  @watch settings = () => this.id && Setting.find({ userId: this.id })
  @watch
  setting = () =>
    (this.settings &&
      this.settings.reduce((acc, cur) => ({ ...acc, [cur.type]: cur }), {})) ||
    {}

  get user() {
    if (!this.sessionInfo) {
      return null
    }
    return {
      ...this.sessionInfo,
      ...this.userInfo,
    }
  }

  integrations = []

  constructor(options: Object) {
    this.options = options
    this.setupSuperLogin()
    this.connected = true
  }

  start() {
    this.ensureSettings()
  }

  ensureSettings() {
    this.watch(async () => {
      if (!this.user) {
        return
      }
      if (this.user.github) {
        await Setting.findOrCreate({
          userId: this.id,
          type: 'github',
        })
      }
    })
  }

  async setupSuperLogin() {
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

  get github() {
    return this.user && this.user.github
  }

  get authorId() {
    return (this.user && this.user._id) || 'anon'
  }

  get name() {
    return this.user && this.user.user_id
  }

  get email() {
    return this.user && this.user.user_id
  }

  get roles() {
    return this.user.roles
  }

  get id() {
    return this.sessionInfo && this.sessionInfo.user_id
  }

  get token() {
    return this.user && this.user.token
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
        var errors = Object.keys(error.validationErrors)
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
    const opts = {
      windowName: 'Login',
      windowOptions: 'location=100,status=0,width=800,height=600',
      ...options,
    }
    const authWindow = window.open(
      `/auth/${provider}`,
      opts.windowName,
      opts.windowOptions
    )
    if (!authWindow) {
      throw new Error('Authorization popup blocked')
    }
    let authComplete = false
    const check = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(check)
        if (!authComplete) {
          authComplete = true
          throw new Error('Authorization cancelled')
        }
      }
    })
  }

  unlink = async provider => {
    // return await this.superlogin.unlink(provider)
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
