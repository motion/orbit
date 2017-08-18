// @flow
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pValidate from 'pouchdb-validation'
import pSearch from 'pouchdb-quick-search'
import type { Model } from '~/helpers'
import { omit } from 'lodash'
import { isBrowser } from './helpers'

// export all models
export Document from './document'
export Thread from './thread'
export Inbox from './inbox'
export Image from './image'
export Thing from './thing'
export User from './user'
export Org from './org'
export Job from './job'
export Reply from './reply'

// exports
export type { Model } from '~/helpers'

import User from './user'

declare class ModelsStore {
  databaseConfig: Object,
  database: RxDB.Database,
  models: Object<string, Model>,
}

export default class Models implements ModelsStore {
  connected = false

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
      // RxDB.QueryChangeDetector.enableDebugging(false)
      RxDB.plugin(this.databaseConfig.adapter)
      RxDB.plugin(pREPL)
      RxDB.plugin(pValidate)
      RxDB.plugin(pSearch)
      PouchDB.plugin(this.databaseConfig.adapter)

      if (isBrowser) {
        console.log('THIS IS A BROWSER')
        RxDB.plugin(pHTTP)
        PouchDB.plugin(pHTTP)
      }
    }

    console.log('Pouch using storage adapter:', this.databaseConfig.adapterName)
  }

  start = async () => {
    this.database = await RxDB.create({
      adapter: this.databaseConfig.adapterName,
      name: this.databaseConfig.name,
      password: this.databaseConfig.password,
      multiInstance: true,
      withCredentials: false,
    })

    await this.attachModels()
    this.connected = true
  }

  dispose = () => {
    for (const [name, model] of Object.entries(this.models)) {
      console.log('dispose model', name)
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
          pouch: PouchDB,
          remote: `${this.databaseConfig.couchUrl}/${model.title}/`,
          remoteOptions: {
            skip_setup: true,
            adapter: this.databaseConfig.adapterName,
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
    return result
  }
}
