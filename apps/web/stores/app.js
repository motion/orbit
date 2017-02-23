import createModels from './models'
import * as RxDB from 'rxdb'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'

RxDB.plugin(pIDB)  // indexedDB
RxDB.plugin(pREPL) // sync
RxDB.plugin(pHTTP) // sync on http

class App {
  // have some user information

  async connect() {
    this.db = await RxDB.create('DB_NAME', 'idb', 'DB_PASSWORD', true)
    this.models = await createModels(this.db)
    console.log('connected')
  }
}

export default new App()
