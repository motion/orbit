// @flow
import RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pHTTP from 'pouchdb-adapter-http'
// import pValidate from 'pouchdb-validation'
// import pSearch from 'pouchdb-quick-search'
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

export const User = UserInstance
export const Thing = ThingInstance
export const Job = JobInstance
export const Setting = SettingInstance
export const Event = EventInstance

// ⭐️ DONT FORGET TO ADD HERE TOO:

export const Models = {
  Thing,
  User,
  Job,
  Setting,
  Event,
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
  couchUrl: string,
  couchHost: string,
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
      RxDB.QueryChangeDetector.enable()
    }
    console.log('Create RxDB with adapter', this.databaseConfig.adapterName)
    RxDB.plugin(this.databaseConfig.adapter)
    RxDB.plugin(pHTTP)
    PouchDB.plugin(this.databaseConfig.adapter)
    PouchDB.plugin(pHTTP)
  }

  start = async ({ options, modelOptions }: StartOptions = {}) => {
    this.modelOptions = modelOptions
    this.database = await RxDB.create({
      adapter: this.databaseConfig.adapterName,
      name: this.databaseConfig.name,
      password: this.databaseConfig.password,
      multiInstance: true,
      withCredentials: false,
      ...options,
    })

    await this.attachModels()
    this.connected = true
  }

  dispose = () => {
    for (const name of Object.keys(this.models)) {
      const model = this.models[name]
      if (model) {
        model.dispose()
      }
    }
  }

  attachModels = async () => {
    const connections = []

    // attach Models to app and connect if need be
    for (const name of Object.keys(this.modelsConfig)) {
      const model = this.modelsConfig[name]
      this.models[name] = model

      if (typeof model.connect !== 'function') {
        throw new Error(
          `No connect found for model ${model.name} connect = ${typeof model.connect}`
        )
      }

      connections.push(
        model.connect(this.database, {
          pouch: PouchDB,
          // remote: `${this.databaseConfig.couchUrl}/${model.title}/`,
          pouchSettings: {
            skip_setup: true,
            skipSetup: true,
          },
          // remoteOptions: {
          //   skip_setup: true,
          //   skipSetup: true,
          //   adapter: this.databaseConfig.adapterName,
          //   ajax: {
          //     headers: {
          //       'X-Token': `${User.name}*|*${User.token}`,
          //     },
          //   },
          // },
          ...this.modelOptions,
        })
      )
    }

    return await Promise.all(connections)
  }
}
