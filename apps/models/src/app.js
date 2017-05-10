import { observable, computed, action } from 'mobx'
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pAuth from 'pouchdb-authentication'
import pValidate from 'pouchdb-validation'
import { uniqBy } from 'lodash'

RxDB.QueryChangeDetector.enable()
// RxDB.QueryChangeDetector.enableDebugging()

import * as Models from './all'

const tempId = () => {
  let id = localStorage.getItem('temp-id')
  if (!id) {
    id = `${Math.random()}`
    localStorage.setItem('temp-id', id)
  }
  return id
}

export default class App {
  db = null

  // basically global stores
  @observable user = null
  @observable.ref views = {}
  @observable.ref errors = []
  @observable.ref activeStores = {}

  constructor() {
    RxDB.plugin(pHTTP)
    RxDB.plugin(pIDB)
    RxDB.plugin(pREPL)
    RxDB.plugin(pValidate)
    PouchDB.plugin(pAuth)
    PouchDB.plugin(pHTTP)

    // expose models onto app
    for (const [name, model] of Object.entries(Models)) {
      this[name] = model
    }
  }

  async start(config: Object, stores: Object) {
    this.catchErrors()

    if (!config) {
      throw new Error('No config given to App!')
    }

    // connect to pouchdb
    this.db = await RxDB.create({
      adapter: 'idb',
      name: config.name,
      password: config.password,
      multiInstance: true,
      withCredentials: false,
    })

    // separate pouchdb for auth
    this.auth = new PouchDB(`${config.couchUrl}/auth`, {
      skipSetup: true,
      withCredentials: false,
    })
    // images
    this.images = new PouchDB(`${config.couchUrl}/images`, {
      skipSetup: true,
      withCredentials: false,
    })

    // connect models
    const connections = Object.entries(Models).map(async ([name, model]) => {
      await model.connect(this.db)
      model.collection.sync(`${config.couchUrl}/${model.title}`, {
        live: true,
        retry: true,
      })
    })

    // log back in
    await Promise.all([...connections, this.setSession()])

    // instantiate stores
    this.stores = Object.keys(stores).reduce((acc, cur) => {
      const Store = stores[cur]
      return {
        ...acc,
        [cur]: new Store(this),
      }
    }, {})
  }

  @action loginOrSignup = async (username, password) => {
    this.clearErrors()
    let errors = []

    // try signup
    const signup = await this.signup(username, password)
    if (!signup.error) {
      this.clearErrors()
      return signup
    }
    errors.push(signup.error)

    // try login
    const login = await this.login(username, password)
    if (!login.error) {
      this.clearErrors()
      return login
    }
    errors.push(login.error)

    // handle errors
    this.handleError(...errors)
    return { errors }
  }

  @action signup = async (username, password, extraInfo = {}) => {
    try {
      const info = await this.auth.signup(username, password, extraInfo)
      return { ...info, signup: true }
    } catch (error) {
      return { error: error || 'error signing up', signup: false }
    }
  }

  @action login = async (username, password) => {
    try {
      const info = await this.auth.login(username, password)
      this.clearErrors()
      this.setSession()
      return { ...info, login: true }
    } catch (error) {
      return { error: error || 'error logging in', login: false }
    }
  }

  @action logout = async () => {
    await this.auth.logout()
    this.setSession()
  }

  @action setUsername = (name: string) => {
    this.user.name = name
    localStorage.setItem('tempUsername', name)
  }

  @action clearErrors = () => {
    this.errors = []
  }

  @action session = async () => {
    return await this.auth.getSession()
  }

  @action setSession = async () => {
    const session = await this.session()
    console.log('got session')
    const loggedIn = session && session.userCtx.name
    if (loggedIn) {
      this.user = session.userCtx
    } else {
      this.user = this.temporaryUser
    }
  }

  @action clearUser = () => {
    localStorage.setItem('tempUsername', '')
    this.user = null
  }

  @computed get noUser() {
    return this.user && !this.user.name
  }

  @computed get tempUser() {
    return this.user && this.user.name && this.user.temp
  }

  get temporaryUser() {
    return {
      name: localStorage.getItem('tempUsername'),
      _id: tempId(),
      temp: true,
    }
  }

  get loggedIn() {
    return this.user && !this.user.temp
  }

  @action handleError = (...errors) => {
    const unique = uniqBy(errors, err => err.name)
    const final = []
    for (const error of unique) {
      try {
        final.push(JSON.parse(error.message))
      } catch (e) {
        final.push({ id: Math.random(), ...error })
      }
    }
    this.errors = uniqBy([...final, ...this.errors], err => err.id)
  }

  @action catchErrors() {
    window.addEventListener('unhandledrejection', event => {
      event.promise.catch(err => {
        this.handleError(err)
      })
    })
  }

  @action setStore = (key, store) => {
    this.activeStores = { ...this.activeStores, [key]: store }
  }

  @action removeStore = key => {
    this.activeStores = { ...this.activeStores, [key]: null }
  }
}
