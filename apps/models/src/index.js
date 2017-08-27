// @flow
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pValidate from 'pouchdb-validation'
import pSearch from 'pouchdb-quick-search'
import type { Model } from '~/helpers'

export { CompositeDisposable } from '@mcro/model'

import UserInstance from './user'
import ThingInstance from './thing'
import JobInstance from './job'
import SettingInstance from './setting'

export const User = UserInstance
export const Thing = ThingInstance
export const Job = JobInstance
export const Setting = SettingInstance

// AND THIS TOO

export const Models = {
  Thing,
  User,
  Job,
  Setting,
}

// exports
export type { Model } from '~/helpers'

export default class Database {
  databaseConfig: Object
  database: RxDB.Database
  models: { [string]: Model }

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
    this.models = models

    // hmr fix
    if (!RxDB.PouchDB.replicate) {
      RxDB.QueryChangeDetector.enable()
      RxDB.plugin(this.databaseConfig.adapter)
      RxDB.plugin(pREPL)
      // RxDB.plugin(pValidate)
      // RxDB.plugin(pSearch)
      RxDB.plugin(pHTTP)
      PouchDB.plugin(this.databaseConfig.adapter)
      PouchDB.plugin(pHTTP)
    }
  }

  start = async ({ options, modelOptions } = {}) => {
    this.database = await RxDB.create({
      adapter: this.databaseConfig.adapterName,
      name: this.databaseConfig.name,
      password: this.databaseConfig.password,
      multiInstance: true,
      withCredentials: false,
      ...options,
    })

    await this.attachModels(modelOptions)
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

  attachModels = async (modelOptions?: Object) => {
    const connections = []

    // attach Models to app and connect if need be
    for (const [name, model] of Object.entries(this.models)) {
      this[name] = model

      if (typeof model.connect !== 'function') {
        throw new Error(
          `No connect found for model ${model.name} connect = ${typeof model.connect}`
        )
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
          ...modelOptions,
        })
      )
    }

    const result = await Promise.all(connections)
    return result
  }
}
