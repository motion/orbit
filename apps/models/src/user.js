// @flow
import { observable, computed, action } from 'mobx'
import { Model, query, str } from './helpers'
import AuthStore from './authStore'

const tempId = () => {
  let id = localStorage.getItem('temp-id')
  if (!id) {
    id = `${Math.random()}`
    localStorage.setItem('temp-id', id)
  }
  return id
}

class User {
  authStore: AuthStore

  @observable.ref user = {}

  connect(database, databaseConfig) {
    this.database = database
    this.databaseConfig = databaseConfig
    // separate pouchdb for auth
    this.authStore = new AuthStore({
      authDB: `${this.databaseConfig.couchUrl}/auth`,
    })
    this.syncUser()
  }

  @computed
  get name() {
    return this.user.name
  }

  updateInfo = async (metadata: Object) => {
    console.log('User.updateInfo', metadata)
    // bugfix: overwriting arrays didnt work, clearing first does :|
    for (const key of Object.keys(metadata)) {
      await this.authDb.putUser(this.name, { metadata: { [key]: null } })
    }
    await this.authDb.putUser(this.name, { metadata })
    await this.syncUser()
  }

  @action loginOrSignup = async (username: string, password: string) => {
    this.emit('clearErrors')
    let errors = []

    // try signup
    try {
      const login = await this.login(username, password)
      if (!login.error) {
        this.syncUser()
        this.emit('clearErrors')
        return login
      }

      const signup = await this.signup(username, password)
      if (!signup.error) {
        this.syncUser()
        this.emit('clearErrors')
        return signup
      }

      throw login.error
    } catch (e) {
      console.error(e)
      errors.push(e)
      App.handleError(...errors)
      return { errors }
    }
  }

  @action signup = async (
    username: string,
    password: string,
    extraInfo = {}
  ) => {
    try {
      const info = await this.authDb.signup(username, password, extraInfo)
      return { ...info, signup: true }
    } catch (error) {
      return { error: error || 'error signing up', signup: false }
    }
  }

  @action login = async (username: string, password: string) => {
    try {
      const info = await this.authDb.login(username, password)
      this.emit('clearErrors')
      this.syncUser()
      return { ...info, login: true }
    } catch (error) {
      return { error: error || 'error logging in', login: false }
    }
  }

  @action logout = async () => {
    await this.authDb.logout()
    this.clearUser()
  }

  @action clearErrors = () => {
    this.errors = []
  }

  getSession = () => this.authDb.getSession()
  getUser = (name: string) => this.authDb.getUser(name || this.name)

  @action syncUser = async () => {
    this.user = this.temporaryUser
    // const session = await this.getSession()
    // const loggedIn = session && session.userCtx.name
    // if (loggedIn) {
    //   this.user = await this.getUser(session.userCtx.name)
    // } else {
    //   this.user = this.temporaryUser
    // }
  }

  @action clearUser = () => {
    localStorage.setItem('tempUsername', '')
    this.user = this.temporaryUser
  }

  @computed
  get tempUser() {
    return this.user && this.user.name && this.user.temp
  }

  get temporaryUser() {
    return {
      name: localStorage.getItem('tempUsername'),
      _id: tempId(),
      temp: true,
    }
  }

  @computed
  get loggedIn() {
    return this.user && !this.user.temp
  }

  get authorId() {
    return (this.loggedIn && this.user.name) || 'anon'
  }
}

export default new User()
