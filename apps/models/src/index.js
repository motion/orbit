// @flow
import { view } from '@jot/black'
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pValidate from 'pouchdb-validation'
import pSearch from 'pouchdb-quick-search'
import type { Model } from '~/helpers'

// export all models
export Document from './document'
export Comment from './comment'
export Image from './image'
export User from './user'

export type { Model } from '~/helpers'

declare class ModelsStore {
  databaseConfig: Object,
  database: RxDB.Database,
  models: Object<string, Model>,
}

export default class Models implements ModelsStore {
  constructor(database, models) {
    console.log('#Models.new', database, models)

    if (!database || !models) {
      throw new Error(
        'No database or models given to App!',
        typeof database,
        typeof models
      )
    }

    this.databaseConfig = database
    this.models = models

    // hmr fix
    if (!RxDB.PouchDB.replicate) {
      RxDB.QueryChangeDetector.enable()
      // RxDB.QueryChangeDetector.enableDebugging()
      RxDB.plugin(pHTTP)
      RxDB.plugin(pIDB)
      RxDB.plugin(pREPL)
      RxDB.plugin(pValidate)
      RxDB.plugin(pSearch)
      PouchDB.plugin(pHTTP)
    }
  }

  start = async () => {
    console.time('#Models.start')
    this.database = await RxDB.create({
      adapter: 'idb',
      name: this.databaseConfig.name,
      password: this.databaseConfig.password,
      multiInstance: true,
      withCredentials: false,
    })
    await this.attachModels()
    console.timeEnd('#Models.start')
  }

  attachModels = async () => {
    const connections = []

    // attach Models to app and connect if need be
    for (const [name, model] of Object.entries(this.models)) {
      if (name === 'default') {
        // ignore base
        continue
      }
      console.log('connecting', name, model)
      this[name] = model

      if (typeof model.connect !== 'function') {
        throw `No connect found for model ${model.name} connect = ${typeof model.connect}`
      }

      connections.push(
        model.connect(this.database, this.databaseConfig, {
          sync: `${this.databaseConfig.couchUrl}/${model.title}/`,
        })
      )
    }

    const result = await Promise.all(connections)
    return result
  }
}
