// @flow
import { CompositeDisposable } from 'sb-event-kit'
import { autorun, observable } from 'mobx'
import { compile } from './properties'
import type RxDB, { RxCollection, RxQuery } from 'rxdb'
import { isRxQuery } from 'rxdb'
import type PouchDB from 'pouchdb-core'
import { cloneDeep, merge } from 'lodash'
import query from './query'
import * as Helpers from './helpers'

type SettingsObject = {
  index?: Array<string>,
  database?: string,
  version?: string | number,
}

type ModelArgs = {
  defaultSchema?: Object,
}

type Queryish = RxQuery | { query: RxQuery }

type PromiseFunction = () => Promise<any>

// HELPERS
const chain = (object, method, value) => {
  if (!value) {
    return object
  }
  return object[method](value)
}
const queryKey = query => JSON.stringify(query.mquery._conditions)
const modelMerge = (subjectModel: Object, object: Object) => {
  const subject = subjectModel.toJSON()
  for (const key of Object.keys(object)) {
    const type = typeof subject[key]
    if (!subject[key] || type === 'string' || type === 'number') {
      subjectModel[key] = object[key]
    } else {
      subjectModel[key] = merge(subject[key], object[key])
    }
  }
}

// METHODS
const modelMethods = {
  get id() {
    return this._id
  },
  delete() {
    return this.collection
      .findOne(this._id)
      .exec()
      .then(doc => doc && doc.remove())
  },
  // update, add properties to model & save
  async update(object: Object) {
    return await this.atomicUpdate(doc => {
      for (const key of Object.keys(object)) {
        doc[key] = object[key]
      }
    })
  },
  // merge object deeply
  merge(object: Object) {
    modelMerge(this, object)
  },
  async mergeUpdate(object: Object) {
    return await this.atomicUpdate(doc => {
      modelMerge(doc, object)
    })
  },
  // this is the mongo field update syntax that rxdb has
  // see https://docs.mongodb.com/manual/reference/operator/update-field/
  // and https://github.com/lgandecki/modifyjs#implemented
  async replace(object: Object = {}) {
    return await this.update(object)
  },
}

export default class Model {
  static isModel = true
  static props: Object
  static defaultProps: Function | Object

  _collection: RxCollection
  migrations: ?Object
  methods: ?Object
  statics: ?Object
  database: ?RxDB
  liveQueries: Object = {}
  options: Object = {}
  subscriptions = new CompositeDisposable()
  settings: SettingsObject = {}
  defaultSchema: Object = {}
  @observable connected = false
  remote: ?string = null // sync to
  hooks: { [string]: PromiseFunction | Function } = {} // hooks run before/after operations
  modelMethods = modelMethods

  constructor(args: ModelArgs = {}) {
    const { defaultSchema } = args
    this.defaultSchema = defaultSchema || {}
  }

  get compiledSchema(): Object {
    return {
      primaryPath: '_id',
      disableKeyCompression: true,
      ...this.defaultSchema,
      ...this.settings,
      ...cloneDeep(this.props), // cloneDeep fixes bug when re-using a model (compiling twice)
      title: this.settings.database,
      version: this.settings.version || 0,
    }
  }

  get hasTimestamps(): boolean {
    return this.constructor.props.timestamps === true
  }

  get now(): string {
    return new Date().toISOString()
  }

  get pouch(): PouchDB {
    return this._collection.pouch
  }

  get props(): Object {
    const { timestamps, ...props } = this.constructor.props
    let result = props

    result = compile(cloneDeep(result))

    if (timestamps) {
      result.properties = {
        ...result.properties,
        createdAt: {
          format: 'date-time',
          type: 'string',
          index: true,
        },
        updatedAt: {
          format: 'date-time',
          type: 'string',
          index: true,
        },
      }
    }

    return result
  }

  getDefaultProps(props: Object): Object {
    const { defaultProps } = this.constructor
    return typeof defaultProps === 'function'
      ? defaultProps(props)
      : defaultProps || {}
  }

  get title(): string {
    return ((this.settings && this.settings.database) || this.constructor.name)
      .toLowerCase()
  }

  compiledMethods = () => ({
    ...Object.getOwnPropertyDescriptors(this.methods || {}),
    ...Object.getOwnPropertyDescriptors(this.modelMethods),
  })

  _filteredProxy = null

  // we wrap the .collection calls so we can do some stuff in between
  //  first: allowing models to define a filter
  //  second: automatic sync from remote
  get _filteredCollection() {
    const { defaultFilter = _ => _ } = this.constructor

    // cache the proxy
    if (this._filteredProxy) {
      return this._filteredProxy
    }

    // set here to avoid changed `this` in proxy
    const { syncQuery, options } = this
    const queryObject = x => (typeof x === 'string' ? { _id: x } : x)

    this._filteredProxy = new Proxy(this._collection, {
      get(target, method) {
        if (method === 'find' || method === 'findOne') {
          return queryParams => {
            const finalParams = defaultFilter(queryObject(queryParams))
            const query = target[method](finalParams)
            return new Proxy(query, {
              get(target, method) {
                // they have intent to run this
                if (method === 'exec' || method === '$') {
                  if (options.autoSync) {
                    const syncPromise = syncQuery(query, {
                      live: method === '$',
                    })

                    // wait for sync to happen before returning
                    if (method === 'exec') {
                      const execute = target.exec.bind(target)
                      return function exec() {
                        return new Promise(async resolve => {
                          // gives option to avoid waiting for initial sync before resolving
                          if (!options.asyncFirstSync) {
                            await syncPromise
                          }
                          const value = await execute()

                          // return null for empty responses
                          if (
                            value instanceof Object &&
                            Object.keys(value).length === 0
                          ) {
                            return null
                          }

                          resolve(value)
                        })
                      }
                    }
                  }
                }
                return target[method]
              },
            })
          }
        }
        return target[method]
      },
    })
    return this._filteredProxy
  }

  get collection(): RxCollection {
    if (this._collection) {
      return this._filteredCollection
    }

    // chain().until().exec().or().$
    const self = this

    // turns a serialized query back into a real query
    const getQuery = called => {
      return called.reduce((acc, cur) => {
        return acc[cur.name](...(cur.args || []))
      }, this.collection)
    }

    const worm = base => {
      const result = new Proxy(
        {
          ...base,
          exec: () => {
            console.warn('This model isn\'t connected!')
            return Promise.resolve(false)
          },
          isntConnected: true,
          getQuery() {
            return getQuery(this.called)
          },
          onConnection() {
            return new Promise(resolve => {
              const stop = autorun(() => {
                if (self.connected) {
                  stop && stop()
                  resolve(this.getQuery())
                }
              })
            })
          },
        },
        {
          get(target: Object | Class, name: string) {
            if (target[name]) {
              return target[name]
            }
            target.called = target.called || []
            target.called.push({ name })
            return (...args) => {
              target.called[target.called.length - 1].args = args
              return worm(target)
            }
          },
        }
      )
      return result
    }

    return worm()
  }

  connect = async (database: RxDB, options: Object): Promise<void> => {
    this.options = options || {}

    // avoid re-connect on hmr
    if (this.database) {
      return
    }

    this.remote = options.remote
    this.database = database
    const name = options.remoteOnly ? options.remote : this.title
    this._collection = await database.collection({
      name,
      schema: this.compiledSchema,
      statics: this.statics,
      pouchSettings: this.options.pouchSettings,
      migrationStrategies: this.migrations,
    })

    // sync PUSH ONLY
    if (this.options.autoSync) {
      const pushSync = this._collection.sync({
        remote: this.remote,
        direction: {
          push: true,
        },
        options: {
          live: true,
          retry: true,
        },
      })
      this.subscriptions.add(pushSync.cancel)
    }

    // bump listeners
    this.pouch.setMaxListeners(100)

    // create index
    await this.createIndexes()

    Helpers.applyHooks(this)

    // this makes our userdb react properly to login, no idea why
    this._collection.watchForChanges()

    // AND NOW
    this.connected = true
  }

  onConnection = () => {
    return new Promise((resolve, reject) => {
      const off = autorun(() => {
        if (this.connected) {
          console.log('watch connected')
          resolve()
          off()
        }
      })
      setTimeout(() => {
        reject('Timed out connecting!')
      }, 4000)
    })
  }

  async dispose() {
    this.subscriptions.dispose()
    if (this._collection) {
      this._collection.destroy()
    }
  }

  createIndexes = async (): Promise<void> => {
    const index = this.settings.index || []
    await this._collection.pouch.createIndex({ fields: index })
  }

  applyDefaults = (doc: Object): Object => {
    const defaults = this.getDefaultProps(doc)
    for (const prop of Object.keys(defaults)) {
      if (typeof doc[prop] === 'undefined') {
        doc[prop] = defaults[prop]
      }
    }
    return doc
  }

  syncQuery = (
    queryish: Queryish,
    options: Object = { live: true, retry: true }
  ) => {
    let query = queryish
    if (query.query) {
      query = query.query
    }
    if (!isRxQuery(query)) {
      throw new Error(
        'Could not sync query, does not look like a proper RxQuery object.'
      )
    }
    if (!this.remote) {
      throw new Error('Could not sync query, no remote is specified.')
    }

    const QUERY_KEY = queryKey(query)
    if (this.liveQueries[QUERY_KEY]) {
      return Promise.resolve(true)
    }

    const firstReplication = this._collection.sync({
      query,
      remote: this.remote,
      waitForLeadership: false,
      direction: {
        pull: true,
      },
      options: {
        ...options,
        live: false,
      },
    })

    // wait for first replication to finish
    return new Promise((resolve, reject) => {
      let resolved = false

      const error$ = firstReplication.error$.subscribe(error => {
        if (error) {
          reject(error)
        }
      })

      // watched replication stream and checks for finish
      firstReplication.complete$
        .filter(state => {
          const done = state && state.pull && state.pull.ok

          if (done && !resolved) {
            resolved = true
            // unsub error stream
            error$.unsubscribe()

            if (options.live) {
              // if live, we re-run with a live query to keep it syncing
              // TODO we need to watch this and clear it on unsubscribe
              const liveReplication = this._collection.sync({
                query,
                remote: this.remote,
                waitForLeadership: false,
                direction: {
                  pull: true,
                },
                options,
              })
              this.liveQueries[QUERY_KEY] = true
              resolve(liveReplication)
            } else {
              resolve(true)
            }
          }
        })
        .toPromise()
    })
  }

  getParams = (params?: Object | string, callback: Function) => {
    const objParams = this.paramsToObject(params)
    return callback(objParams)
  }

  paramsToObject = (params: Object | string) => {
    if (!params) {
      return {}
    }
    if (typeof params === 'string') {
      return { _id: params }
    } else {
      return params
    }
  }

  // user facing!

  // get is a helper that returns a promise only
  get = (query: string | Object) => this.collection.findOne(query).exec();
  getAll = (query: string | Object) => this.collection.find(query).exec()

  // find/findOne return RxQuery objects
  // so you can subscribe to streams with .$ or promise with .exec()
  find = (params: string | Object) =>
    this.getParams(params, this.collection.find)

  findOne = (params: string | Object) =>
    this.getParams(params, this.collection.findOne)

  // find or create, doesnt require primary key usage
  findOrCreate = async (object: Object = {}): Promise<Object> => {
    if (!this._collection) {
      await this.onConnection()
    }
    const found = await this.get(object)
    if (found) {
      return found
    }
    return await this.create(object)
  }

  // creates a model without persisting
  async createTemporary(object: Object = {}) {
    if (!this._collection) {
      await this.onConnection()
    }
    this.applyDefaults(object)
    const doc = await this._collection.newDocument(object)
    doc.__is_temp = true
    return doc
  }

  // create a model and persist
  async create(object: Object = {}) {
    if (!this._collection) {
      await this.onConnection()
    }
    return this._collection.insert(object)
  }

  // upsert requires you to use primary key, unlike findOrCreate which doesn't
  // but upsert only requires one request
  async upsert(object: Object = {}) {
    if (!this._collection) {
      await this.onConnection()
    }
    this.applyDefaults(object)
    return this._collection.upsert(object)
  }
}
