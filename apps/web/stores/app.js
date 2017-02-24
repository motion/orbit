import * as Models from 'models'
import { lazyObject } from 'helpers'
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

    // this wraps getters so we lazily connect to models
    this.models = lazyObject(Models, ModelClass => {
      const model = new ModelClass(this.db)
      model.connect()
      return model
    })
  }
}

export default new App()
