import { observable } from 'mobx'
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
  @observable user = null

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
    try {
      const info = await this.auth.login(username, password)
      this.setSession()
      return info
    } catch (e) {
      console.log('error logging in')
      console.error(e)
      return false
    }
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

  get temporaryUser() {
    return { name: 'anon', _id: tempId() }
  }

  get loggedIn() {
    return this.user && this.user.name !== 'anon'
  }
}
