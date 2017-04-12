import * as Models from 'models'
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pAuth from 'pouchdb-authentication'

const KEYS = {
  url: 'http://localhost:5984',
  db: 'DB_NAME',
  pass: 'DB_PASSWORD',
}

class App {
  models = {}
  db = null
  user = null

  constructor() {
    RxDB.plugin(pIDB)
    RxDB.plugin(pREPL)
    RxDB.plugin(pHTTP)
    PouchDB.plugin(pAuth)
  }

  async connect() {
    // connect to pouchdb
    this.db = await RxDB.create(KEYS.db, 'idb', KEYS.pass, true)

    // separate pouchdb for auth
    this.auth = new PouchDB(`${KEYS.url}/auth`, { skipSetup: true })

    // connect models
    for (const [name, model] of Object.entries(Models)) {
      this.models[name] = model
      await model.connect(this.db)
      model.table.sync(`${KEYS.url}/${model.title}`)
    }
  }

  signup(username, password, info) {
    return this.auth.signup(username, password, info)
  }

  async login(username, password) {
    try {
      const user = await this.auth.login(username, password)
      console.log('got user', user)
      this.user = user
    }
    catch(e) {
      console.error(e)
    }
  }
}

export default new App()
