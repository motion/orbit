// @flow
import { Org, Inbox, Document, User } from '~/app'
import { store, watch } from '@mcro/black'
import SuperLoginClient from 'superlogin-client'

// TODO: Constants.API_HOST
const API_HOST = `${window.location.host}`
const API_URL = `http://${API_HOST}`

console.log('API_HOST', API_HOST)

@store
class Queries {
  id = false
  activeOrg = 0

  get org() {
    return this.orgs && this.orgs[this.activeOrg]
  }

  @watch orgs = () => this.id && Org.forUser(this.id)
  @watch favorites = () => Document.favoritedBy(this.id)

  @watch
  home = () => {
    if (this.org === false) {
      return false
    }
    if (this.org) {
      return Document.get({ parentId: this.org.id })
    }
    return null
  }

  @watch
  defaultInbox = () => {
    if (this.org) {
      return Inbox.get({ parentId: this.org.id })
    }
  }
}

@store
class CurrentUser {
  connected = false
  user = false
  localDb = false
  remoteDb = false
  queries = {}
  integrations = []

  constructor(options) {
    this.superlogin = SuperLoginClient
    this.options = options

    this.setTimeout(() => {
      this.queries = new Queries()
      this.watch(() => {
        if (this.id && !this.queries.id) {
          console.log('starting user')
          this.queries.id = this.id
        }
      })
    }, 500)

    this.setupSuperLogin()
    this.connected = true
  }

  get org() {
    return this.queries.org
  }

  get favorites() {
    return this.queries.favorites
  }

  get home() {
    return this.queries.home
  }

  get defaultInbox() {
    return this.queries.defaultInbox
  }

  async setupSuperLogin() {
    if (!this.options) {
      console.log('skipping superlogin')
      return
    }

    this.superlogin.configure(this.options)

    // sync
    this.superlogin.on('login', async () => {
      this.user = await this.getCurrentUser()
      this.setupDbSync()
    })

    this.superlogin.on('logout', () => {
      this.user = null
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
    this.user = await this.superlogin.login({
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
    await this.superlogin.link(provider)
    await this.getCurrentUser()
  }

  getCurrentUser = async () => {
    try {
      let session = {}
      if (this.superlogin) {
        session = await this.superlogin.getSession()
      }
      console.log('session user id is', session.user_id)
      const user = await User.get(session.user_id)
      return {
        ...session,
        ...user,
      }
    } catch (e) {
      console.error('got err with current user get', e)
    }
  }

  createOrg = async name => {
    if (!this.id) {
      console.error('woah no id')
      return
    }

    await Org.create({
      title: name,
      admins: [this.id],
      members: [this.id],
    })
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
