import * as Models from 'models'
import * as RxDB from 'rxdb'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'

RxDB.plugin(pIDB)  // indexedDB
RxDB.plugin(pREPL) // sync
RxDB.plugin(pHTTP) // sync on http

class App {
  async connect() {
    // connect to pouchdb
    this.db = await RxDB.create('DB_NAME', 'idb', 'DB_PASSWORD', true)

    // connect models
    console.log('connecting...')
    this.models = {}
    for (const key of Object.keys(Models)) {
      this.models[key] = await Models[key].connect(this.db)
    }
  }
}

export default new App()
