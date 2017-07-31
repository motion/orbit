import { store, watch, log } from '@mcro/black'
import PouchDB from 'pouchdb-core'
import superLogin from 'superlogin-client'
import Document, { Document as DocumentModel } from './document'
import Org from './org'
import Inbox from './inbox'

const API_HOST = `api.${window.location.host}`
const API_URL = `http://${API_HOST}`

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
class User {
  connected = false
  user = false
  localDb = false
  remoteDb = false
  queries = {}
  integrations = []

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

  constructor(options) {
    this.superlogin = superLogin
    this.options = options
  }

  connect = async database => {
    if (this.database) {
      return // hmr
    }

    // for now
    this.setTimeout(() => {
      this.queries = new Queries()
      this.watch(() => {
        if (this.id && !this.queries.id) {
          console.log('starting user')
          this.queries.id = this.id
        }
      })
    }, 500)

    this.database = database
    this.documents = new DocumentModel()
    this.documents.settings.database = 'userdocuments'

    await new Promise(resolve => {
      this.setTimeout(async () => {
        await this.setupSuperLogin()
        resolve()
      })
    })

    this.connected = true
  }

  async setupSuperLogin() {
    this.superlogin.configure(this.options)

    // sync
    this.superlogin.on('login', async () => {
      this.user = await this.getCurrentUser()
      if (this.user) {
        await this.documents.connect(this.database, {
          sync: this.user.userDBs.documents,
        })
      }
    })

    this.superlogin.on('logout', () => {
      this.user = null
    })
  }

  dispose = () => {}

  get loggedIn() {
    return !!this.user
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
    if (!this.remoteDb && this.user) {
      this.remoteDb = new PouchDB(this.user.userDBs.documents, {
        skip_setup: true,
      })
      this.localDb = new PouchDB(`local_db_${this.user.user_id}`)
      // syncronize the local and remote user databases...
      this.remoteSyncHandler = this.localDb
        .sync(this.remoteDb, { live: true, retry: true })
        .on('error', console.log.bind(console))
    }
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
      // await this.login(username, password) // this should be auto done
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
    this.setupDbSync()
  }

  logout = async () => {
    this.remoteSyncHandler && this.remoteSyncHandler.cancel()
    this.remoteDb = null
    this.localDb = null
    await this.superlogin.logout()
  }

  getCurrentUser = async () => {
    const session = await this.superlogin.getSession()
    this.setupDbSync()
    return session
  }

  createOrg = async name => {
    await Org.create({
      title: name,
      admins: [this.id],
      members: [this.id],
    })
  }
}

const user = new User({
  baseUrl: `${API_URL}/auth/`,
  endpoints: [API_HOST],
  noDefaultEndpoint: true, // don't auto add url host to endpoints
  storage: 'local', //   'local' | 'session'
  checkExpired: 'stateChange', // 'stateChange' ($stateChangeStart or $routeChangeStart is fired) | 'startup'
  refreshThreshold: 0.2, // eg: a token was issued at 1pm and expires at 2pm, threshold = 0.5, token will refresh at 1:30pm
})

// because
window.User = user

export default user
