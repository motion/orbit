import { observable, computed, action } from 'mobx'
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pAuth from 'pouchdb-authentication'
import pValidate from 'pouchdb-validation'
import pSearch from 'pouchdb-quick-search'
import Seed from './seed'
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

class App {
  db = null

  // basically global stores
  @observable user = null
  @observable.ref activePage = {}
  @observable.ref extraActions = null
  @observable.ref errors = []
  @observable.ref activeStores = {}

  constructor() {
    RxDB.plugin(pHTTP)
    RxDB.plugin(pIDB)
    RxDB.plugin(pREPL)
    RxDB.plugin(pValidate)
    RxDB.plugin(pSearch)
    PouchDB.plugin(pAuth)
    PouchDB.plugin(pHTTP)
  }

  async start({ database, stores }) {
    console.time('start')
    this.catchErrors()

    console.log(
      'Use App in your console to access models, activeStores, user, etc'
    )

    // attach Models to app
    for (const [name, model] of Object.entries(Models)) {
      this[name] = model
    }

    if (!database) {
      throw new Error('No config given to App!')
    }

    // attach
    this.database = database
    this.stores = stores

    // connect to pouchdb
    console.time('create db')
    this.db = await RxDB.create({
      adapter: 'idb',
      name: database.name,
      password: database.password,
      multiInstance: true,
      withCredentials: false,
      pouchSettings: {
        skipSetup: true,
        live: true,
        retry: true,
        since: 'now',
      },
    })
    console.timeEnd('create db')

    // separate pouchdb for auth
    this.auth = new PouchDB(`${database.couchUrl}/auth`, {
      skipSetup: true,
      withCredentials: false,
    })
    // images
    this.images = new PouchDB(`${database.couchUrl}/images`, {
      skipSetup: true,
      withCredentials: false,
    })

    // connect models
    const connections = Object.entries(Models).map(async ([name, model]) => {
      await model.connect(this.db)
      model.remoteDb = `${database.couchUrl}/${model.title}`
      // model.collection.sync(`${database.couchUrl}/${model.title}`, {
      //   live: true,
      //   retry: true,
      //   since: 'now',
      // })
    })

    console.time('connect')
    await Promise.all([...connections, this.setSession()])
    console.timeEnd('connect')
    console.log('connected')

    // seed db
    setTimeout(() => {
      this.seed = new Seed()
      this.seed.start()
    }, 100)

    console.timeEnd('start')
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

  get activePlace() {
    return (
      (this.activePage.place && this.activePage.place.slug) || this.user.slug
    )
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
    console.log('set username', this.user)
    this.user = { ...this.user, name }
    console.log(this.user)
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
    const loggedIn = session && session.userCtx.name
    if (loggedIn) {
      this.user = session.userCtx
    } else {
      this.user = this.temporaryUser
    }
  }

  @action clearUser = () => {
    localStorage.setItem('tempUsername', '')
    this.user = this.temporaryUser
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

  catchErrors() {
    window.addEventListener('unhandledrejection', event => {
      event.promise.catch(err => {
        this.handleError({ ...err, reason: event.reason })
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

export default new App()
