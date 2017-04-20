import { observable } from 'mobx'
import * as RxDB from 'motion-rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pAuth from 'pouchdb-authentication'

import * as Models from './all'

const KEYS = {
  url: 'http://localhost:5984',
  name: 'username',
  password: 'password',
}

export default class App {
  db = null
  @observable user = null

  constructor() {
    RxDB.plugin(pIDB)
    RxDB.plugin(pREPL)
    RxDB.plugin(pHTTP)
    PouchDB.plugin(pAuth)

    // expose models onto app
    for (const [name, model] of Object.entries(Models)) {
      this[name] = model
    }
  }

  get pouch() {
    return this.db._adminPouch
  }

  async connect() {
    // connect to pouchdb
    this.db = await RxDB.create({
      name: KEYS.name,
      adapter: 'idb',
      password: KEYS.password,
      multiInstance: true,
    })

    // separate pouchdb for auth
    this.auth = new PouchDB(`${KEYS.url}/auth`, { skipSetup: true })

    // connect models
    for (const [name, model] of Object.entries(Models)) {
      await model.connect(this.db)
      model.collection.sync(`${KEYS.url}/${model.title}`)
    }

    // log back in
    this.setSession()
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
      console.error(e)
      return null
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
      this.user = false
    }
  }
}
