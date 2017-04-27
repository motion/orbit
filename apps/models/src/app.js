import { observable, computed, action } from 'mobx'
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pAuth from 'pouchdb-authentication'

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

  constructor() {
    RxDB.plugin(pHTTP)
    RxDB.plugin(pIDB)
    RxDB.plugin(pREPL)
    PouchDB.plugin(pAuth)
    PouchDB.plugin(pHTTP)

    // expose models onto app
    for (const [name, model] of Object.entries(Models)) {
      this[name] = model
    }
  }

  async start(config: Object) {
    if (!config) {
      throw new Error('No config given to App!')
    }

    // connect to pouchdb
    this.db = await RxDB.create({
      adapter: 'idb',
      name: config.name,
      password: config.password,
      multiInstance: true,
    })

    // separate pouchdb for auth
    this.auth = new PouchDB(`${config.couchUrl}/auth`, { skipSetup: true })
    console.log('got auth', this.auth)

    // connect models
    for (const [name, model] of Object.entries(Models)) {
      await model.connect(this.db)
      model.collection.sync(`${config.couchUrl}/${model.title}`, {
        live: true,
        retry: true,
      })
    }

    // log back in
    this.setSession()
    this.catchErrors()
  }

  loginOrSignup = async (username, password) => {
    try {
      await this.signup(username, password)
    } catch (e) {
      console.error(e)
      console.log('recovering from signup, logging in...')
    }
    return await this.login(username, password)
  }

  signup = (username, password, info) => {
    return this.auth.signup(username, password, info || {})
  }

  login = async (username, password) => {
    const info = await this.auth.login(username, password)
    this.setSession()
    return info
  }

  logout = async () => {
    await this.auth.logout()
    this.setSession()
  }

  session = async () => {
    return await this.auth.getSession()
  }

  setSession = async () => {
    const session = await this.session()
    const loggedIn = session && session.userCtx.name
    console.log('loggedIn', loggedIn)
    if (loggedIn) {
      this.user = session.userCtx
    } else {
      this.user = this.temporaryUser
    }
  }

  setUsername = (name: string) => {
    this.user.name = name
    localStorage.setItem('tempUsername', name)
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

  @action clearErrors = () => {
    this.errors = []
  }

  catchErrors() {
    window.addEventListener('unhandledrejection', event => {
      event.promise.catch(err => {
        try {
          const error = JSON.parse(err.message)
          this.errors = [
            { id: Math.random(), ...error },
            ...this.errors.slice(),
          ]
        } catch (e) {
          this.errors = [{ id: Math.random(), ...err }, ...this.errors.slice()]
        }
      })
    })
  }
}
