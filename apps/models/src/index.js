// @flow
import RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pHTTP from 'pouchdb-adapter-http'
import pMapReduce from 'pouchdb-mapreduce'
import * as Constants from '~/constants'
import type { Model } from '@mcro/model'
export type { Model }

import { CompositeDisposable as CD } from '@mcro/model'
export const CompositeDisposable = CD

// ⭐️ ADD MODELS HERE:

import UserInstance from './user'
import ThingInstance from './thing'
import JobInstance from './job'
import SettingInstance from './setting'
import EventInstance from './event'
import PersonInstance from './person'

// AND THEN HERE:

export const User = UserInstance
export const Thing = ThingInstance
export const Job = JobInstance
export const Setting = SettingInstance
export const Event = EventInstance
export const Person = PersonInstance

// ⭐️ DONT FORGET TO ADD HERE TOO:

export const Models = {
  Thing: ThingInstance,
  User: UserInstance,
  Job: JobInstance,
  Setting: SettingInstance,
  Event: EventInstance,
  Person: PersonInstance,
}

// ⭐️ YOU'RE ALL SET

export type ModelOptions = {|
  autoSync?: boolean,
  pouchSettings?: Object,
|}

export type StartOptions = {|
  options: Object,
  modelOptions?: ModelOptions,
|}

export type ModelsObject = {
  [string]: Model,
}

export type DatabaseConfig = {|
  name: string,
  password: string,
  remoteUrl: string,
  remoteHost: string,
  adapter: Function,
  adapterName: string,
|}

export default class Database {
  modelOptions: ?ModelOptions
  models: ModelsObject = {}
  databaseConfig: Object
  modelsConfig: ModelsObject
  database: RxDB.Database

  connected = false

  constructor(databaseConfig: DatabaseConfig, modelsConfig: ModelsObject) {
    if (!databaseConfig || !modelsConfig) {
      console.log('Info for error', typeof databaseConfig, typeof modelsConfig)
      throw new Error('No database or models given to App!')
    }

    this.databaseConfig = databaseConfig
    this.modelsConfig = modelsConfig

    // hmr fix
    if (Constants.IS_BROWSER) {
      const oglog = console.log
      console.log = _ => _
      RxDB.QueryChangeDetector.enable()
      console.log = oglog
    }
    if (this.databaseConfig.adapter) {
      RxDB.plugin(this.databaseConfig.adapter)
      PouchDB.plugin(this.databaseConfig.adapter)
    }
    if (this.databaseConfig.plugins) {
      for (const plugin of this.databaseConfig.plugins) {
        RxDB.plugin(plugin)
      }
    }

    RxDB.plugin(pHTTP)
    PouchDB.plugin(pHTTP)
    PouchDB.plugin(pMapReduce)
    RxDB.plugin(pMapReduce)

    // asyncMethods => postCreateRxDocument hook
    RxDB.plugin({
      rxdb: true,
      hooks: {
        postCreateRxDocument: async doc => {
          const { asyncMethods } = doc.collection.options
          if (asyncMethods) {
            await Promise.all(
              Object.keys(asyncMethods).map(async key => {
                const value = await asyncMethods[key].call(doc)
                doc[key] = value
              })
            )
          }
        },
      },
    })

    RxDB.plugin({
      rxdb: true,
      hooks: {
        preCreatePouchDb: options => {
          options.settings = {
            ...options.settings,
            ...this.pouchOptions,
          }
        },
      },
    })
  }

  get pouch() {
    return PouchDB
  }

  async start({ options, modelOptions }: StartOptions = {}) {
    this.modelOptions = modelOptions
    this.database = await RxDB.create({
      adapter: this.databaseConfig.adapterName,
      name: this.databaseConfig.name,
      password: this.databaseConfig.password,
      multiInstance: false,
      ignoreDuplicate: true,
      ...options,
    })
    await this.attachModels()
    this.connected = true
  }

  async dispose() {
    for (const name of Object.keys(this.models)) {
      const model = this.models[name]
      if (model) {
        await model.dispose()
      }
    }
    if (this.database) {
      await this.database.destroy()
    }
  }

  get pouchOptions() {
    return {
      skip_setup: true,
      ajax: {
        withCredentials: false,
        headers: {
          'X-Token': `${User.name}*|*${User.token}`,
        },
      },
    }
  }

  async attachModels() {
    const connections = []
    // attach Models to app and connect if need be
    for (const name of Object.keys(this.modelsConfig)) {
      const model = this.modelsConfig[name]
      this.models[name] = model
      if (typeof model.connect !== 'function') {
        throw new Error(
          `No connect found for model ${
            model.name
          } connect = ${typeof model.connect}`
        )
      }
      connections.push(
        model.connect(this.database, {
          pouch: PouchDB,
          remote: `${this.databaseConfig.remoteUrl}/${model.title}/`,
          ...this.modelOptions,
          pouchSettings: this.pouchOptions,
        })
      )
    }
    await Promise.all(connections)
  }
}
