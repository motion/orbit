// @flow
import { Org, User } from '~/app'
import { store } from '@mcro/black'
import SuperLoginClient from 'superlogin-client'
import { observable, autorun, computed } from 'mobx'

// TODO: Constants.API_HOST
const API_HOST = `${window.location.host}`
const API_URL = `http://${API_HOST}`

class CurrentUser {
  connected = false
  localDb = null
  remoteDb = null
  @observable.ref sessionInfo = null
  @observable.ref userInfo = null

  @computed
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

  constructor(options) {
    this.superlogin = SuperLoginClient
    this.options = options
    this.setupSuperLogin()
    this.connected = true
    this.watchUser()
  }

  watchUser = () => {
    autorun(() => {
      if (this.sessionInfo && User.connected) {
        User._collection
          .findOne(this.sessionInfo.user_id)
          .$.subscribe(userInfo => {
            if (userInfo) {
              this.userInfo = userInfo
            }
          })
      }
    })

    // try this too
    User.find().sync()
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
      this.setupDbSync()
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
    return this.user && this.user.user_id
  }

  get token() {
    return this.user && this.user.token
  }

  setupDbSync = () => {
    // if (!this.remoteDb && this.user) {
    //   this.remoteDb = new PouchDB(this.user.userDBs.documents, {
    //     skip_setup: true,
    //   })
    //   this.localDb = new PouchDB(`local_db_${this.user.user_id}`)
    //   // syncronize the local and remote user databases...
    //   this.remoteSyncHandler = this.localDb
    //     .sync(this.remoteDb, { live: true, retry: true })
    //     .on('error', console.log.bind(console))
    // }
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

  signup = async (email, password) => {
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

  login = async (email, password) => {
    await this.superlogin.login({
      username: email,
      password,
    })
    console.log('login: user', this.user)
  }

  logout = async () => {
    this.remoteSyncHandler && this.remoteSyncHandler.cancel()
    this.remoteDb = null
    this.localDb = null
    await this.superlogin.logout()
  }

  link = async provider => {
    return await this.superlogin.link(provider)
  }

  unlink = async provider => {
    return await this.superlogin.unlink(provider)
  }

  setUserSession = async () => {
    try {
      if (this.superlogin) {
        this.sessionInfo = await this.superlogin.getSession()
        console.log('setting to', this.sessionInfo)
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
