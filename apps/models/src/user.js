import { store } from '@jot/black'
import PouchDB from 'pouchdb-core'
import superlogin from 'superlogin-client'
import { DocumentModel } from './document'

const COUCH_PROTOCOL = `${window.location.protocol}//`
const COUCH_HOST = `couch.${window.location.host}`
const API_HOST = `api.${window.location.host}`
const API_URL = `http://${API_HOST}`

@store
class User {
  user = null
  superlogin = superlogin
  localDb = null
  remoteDb = null

  connect = database => {
    this.database = database
    this.documents = new DocumentModel()
    this.documents.settings.database = 'userdocuments'

    this.superlogin.configure({
      baseUrl: `${API_URL}/auth/`,
      endpoints: [API_HOST],
      // don't auto add url host to endpoints
      noDefaultEndpoint: true,
      //   'local' | 'session'
      storage: 'local',
      // The authentication providers that are supported by your SuperLogin host
      //   eg: ['facebook', 'twitter'],
      // Sets when to check if the session is expired.
      //   'stateChange' | 'startup' - checks every time $stateChangeStart or $routeChangeStart is fired, or startup
      checkExpired: 'stateChange',
      // Percentage of session duration after which to automatically refresh token
      //   eg: a token was issued at 1pm and expires at 2pm, threshold = 0.5, token will refresh at 1:30pm
      refreshThreshold: 0.2,
    })

    // sync
    this.superlogin.on('login', async (event, session) => {
      this.user = await this.getCurrentUser()
      console.log('also got', session)
      this.documents.connect(this.database, {
        sync: this.user.userDBs.documents,
      })
    })

    this.superlogin.on('logout', () => {
      this.user = null
    })
  }

  get loggedIn() {
    return !!this.user
  }

  get authorId() {
    return (this.user && this.user._id) || 'anon'
  }

  get name() {
    return this.user.user_id
  }

  get email() {
    return this.user.user_id
  }

  get roles() {
    return this.user.roles
  }

  get id() {
    return this.user.user_id
  }

  get org() {
    return this.user.org || 'motion'
  }

  get token() {
    return this.superlogin && this.superlogin.getSession().token
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
      const res = await superlogin.register({
        email,
        username,
        password,
        confirmPassword: password,
      })
      console.log('registerNewUser: ', res)
      return await this.login(username, password)
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
    this.user = await superlogin.login({
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
    await superlogin.logout()
  }

  getCurrentUser = async () => {
    const session = await superlogin.getSession()
    this.setupDbSync()
    return session
  }
}

export default new User()
