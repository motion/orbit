// @flow
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pValidate from 'pouchdb-validation'
import pSearch from 'pouchdb-quick-search'
import type { Model } from '~/helpers'
import { omit } from 'lodash'

// export all models
export Document from './document'
export Comment from './comment'
export Thread from './thread'
export Reply from './reply'
export Inbox from './inbox'
export Image from './image'
export Thing from './thing'
export User from './user'
export Org from './org'

// exports
export type { Model } from '~/helpers'

if (module.hot) {
  module.hot.accept('./document', () => {
    log('accept: models/index.js:./document')
  })
}

import User from './user'

declare class ModelsStore {
  databaseConfig: Object,
  database: RxDB.Database,
  models: Object<string, Model>,
}

export default class Models implements ModelsStore {
  modelsLoggedIn = false

  constructor(databaseConfig, models) {
    if (!databaseConfig || !models) {
      throw new Error(
        'No database or models given to App!',
        typeof databaseConfig,
        typeof models
      )
    }

    this.databaseConfig = databaseConfig
    this.models = omit(models, ['default'])

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
      PouchDB.plugin(pIDB)
    }
  }

  start = async () => {
    // User.superlogin.on('login', () => {
    //   setTimeout(() => {
    //     if (!this.modelsLoggedIn && User.loggedIn) {
    //       this.attachModels()
    //       this.modelsLoggedIn = true
    //     }
    //   }, 100)
    // })
    // User.superlogin.on('logout', () => {
    //   if (this.modelsLoggedIn) {
    //     this.attachModels()
    //     this.modelsLoggedIn = false
    //   }
    // })

    this.database = await RxDB.create({
      adapter: 'idb',
      name: this.databaseConfig.name,
      password: this.databaseConfig.password,
      multiInstance: true,
      withCredentials: false,
    })

    await this.attachModels()
  }

  dispose = () => {
    for (const [name, model] of Object.entries(this.models)) {
      if (model && model.dispose) {
        model.dispose()
      } else {
        console.error('waht is this thing', model)
      }
    }
  }

  attachModels = async () => {
    const connections = []

    // attach Models to app and connect if need be
    for (const [name, model] of Object.entries(this.models)) {
      this[name] = model

      if (typeof model.connect !== 'function') {
        throw `No connect found for model ${model.name} connect = ${typeof model.connect}`
      }

      connections.push(
        model.connect(this.database, {
          remote: `${this.databaseConfig.couchUrl}/${model.title}/`,
          remoteOptions: {
            skip_setup: true,
            ajax: {
              headers: {
                'X-Token': `${User.name}*|*${User.token}`,
              },
            },
          },
        })
      )
    }

    const result = await Promise.all(connections)
    console.log('connecting', connections)
    return result
  }
}
