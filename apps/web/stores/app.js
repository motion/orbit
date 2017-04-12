import * as Models from 'models'
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pAuth from 'pouchdb-authentication'

RxDB.plugin(pIDB)
RxDB.plugin(pREPL)
RxDB.plugin(pHTTP)

PouchDB.plugin(pAuth)

window.P = PouchDB

class App {
  models = {}

  async connect() {
    // connect to pouchdb
    this.db = await RxDB.create('DB_NAME', 'idb', 'DB_PASSWORD', true)

    this.user = await

    // connect models
    for (const key of Object.keys(Models)) {
      this.models[key] = await Models[key].connect(this.db)
    }
  }
}

export default new App()
