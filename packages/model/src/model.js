// @flow
import { CompositeDisposable } from 'sb-event-kit'
import { autorun, observable } from 'mobx'
import { compile } from './properties'
import type RxDB, { RxCollection } from 'rxdb'
import { isRxQuery } from 'rxdb'
import type PouchDB from 'pouchdb-core'
import { cloneDeep } from 'lodash'
import query from './query'

type SettingsObject = {
  index?: Array<string>,
  database?: string,
}

type ModelArgs = {
  defaultSchema?: Object,
}

const chain = (object, method, value) => {
  if (!value) {
    return object
  }
  return object[method](value)
}

export default class Model {
  static isModel = true
  static props: Object
  static defaultProps: Function | Object

  methods: ?Object
  statics: ?Object
  database: ?RxDB

  subscriptions = new CompositeDisposable()
  settings: SettingsObject = {}
  defaultSchema: Object = {}
  options: ?Object = {}
  @observable connected = false
  // sync to
  remote: ?string = null
  // hooks that run before/after operations
  hooks: Object<string, () => Promise<any>> = {}

  constructor(args: ModelArgs = {}) {
    const { defaultSchema } = args
    this.defaultSchema = defaultSchema || {
      primaryPath: '_id',
      version: 0,
      disableKeyCompression: true,
    }
  }

  get compiledSchema(): Object {
    return {
      ...this.defaultSchema,
      ...this.settings,
      ...cloneDeep(this.props), // cloneDeep fixes bug when re-using a model (compiling twice)
      title: this.settings.database,
    }
  }

  get hasTimestamps(): boolean {
    return this.constructor.props.timestamps === true
  }

  get now(): string {
    return new Date().toISOString()
  }

  get pouch(): PouchDB {
    return this.collection.pouch
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

  compiledMethods = (doc): Object => {
    const descriptors = Object.getOwnPropertyDescriptors(this.methods || {})

    // methods to be added to each model
    const ogUpdate = doc.update.bind(doc)
    const extraDescriptors = Object.getOwnPropertyDescriptors({
      get id() {
        return this._id
      },
      delete() {
        return this.collection
          .findOne(this._id)
          .exec()
          .then(doc => doc && doc.remove())
      },
      // nicer update, adds properties to model & save
      async update(object: Object = {}) {
        return await this.atomicUpdate(doc => {
          for (const key of Object.keys(object)) {
            doc[key] = object[key]
          }
        })
      },
      // this is the mongo field update syntax that rxdb has
      // see https://docs.mongodb.com/manual/reference/operator/update-field/
      // and https://github.com/lgandecki/modifyjs#implemented
      async replace(object: Object = {}) {
        return await ogUpdate(object)
      },
    })

    return {
      ...descriptors,
      ...extraDescriptors,
    }
  }

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
            const query = target[method](
              defaultFilter(queryObject(queryParams))
            )
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
                      return function exec() {
                        return new Promise(async resolve => {
                          await syncPromise
                          const value = await target.exec()
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

  get collection(): ?RxCollection & { pouch: PouchDB } {
    if (this._collection) {
      return this._filteredCollection
    }
    // chain().until().exec().or().$
    const self = this
    const worm = () => {
      const result = new Proxy(
        {
          exec: () => {
            console.warn('This model isn\'t connected!')
            return Promise.resolve(false)
          },
          isntConnected: true,
          onConnection: () => {
            return new Promise(resolve => {
              const stop = autorun(() => {
                if (self.connected) {
                  stop && stop()
                  resolve({ connected: true })
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
            return () => worm()
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
    })

    // shim add pouchdb-validation
    this._collection.pouch.installValidationMethods()

    // bump listeners
    this._collection.pouch.setMaxListeners(100)

    // create index
    await this.createIndexes()

    // PRE-INSERT
    const ogInsert = this.hooks.preInsert
    this.hooks.preInsert = doc => {
      this.applyDefaults(doc)
      if (this.hasTimestamps) {
        doc.createdAt = this.now
        doc.updatedAt = this.now
      }
      console.log(
        `%cINSERT ${this.constructor.name}.create(${JSON.stringify(
          doc,
          0,
          2
        )})`,
        'color: green'
      )
      if (ogInsert) {
        return ogInsert.call(this, doc)
      }
    }

    // PRE-SAVE
    const ogSave = this.hooks.preSave
    this.hooks.preSave = doc => {
      if (this.hasTimestamps) {
        doc.updatedAt = this.now
      }
      if (ogSave) {
        return ogSave.call(this, doc)
      }
    }

    // POST-CREATE
    // decorate each instance with this.methods
    const ogPostCreate = this.hooks.postCreate
    this.hooks.postCreate = doc => {
      const compiledMethods = this.compiledMethods(doc)
      if (compiledMethods) {
        for (const method of Object.keys(compiledMethods)) {
          const descriptor = compiledMethods[method]
          // autobind
          if (typeof descriptor.get === 'function') {
            descriptor.get = descriptor.get.bind(doc)
          }
          if (typeof descriptor.value === 'function') {
            descriptor.value = descriptor.value.bind(doc)
          }
        }
      } else {
        console.warn('no methods')
      }
      Object.defineProperties(doc, compiledMethods)
      if (ogPostCreate) {
        ogPostCreate.call(this, doc)
      }
    }

    if (this._collection && this.hooks) {
      Object.keys(this.hooks).forEach((hook: () => Promise<any>) => {
        this._collection[hook](this.hooks[hook])
      })
    }

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

    // const { indexes } = await this.collection.pouch.getIndexes()
    // console.log('indexes ARE', indexes, 'vs', index)

    // TODO see if we can remove but fixes bug for now
    await this._collection.pouch.createIndex({ fields: index })

    // this was a faster way to make indexes if need be
    // if (index.length) {
    //   // TODO: pouchdb supposedly does this for you, but it was slow in profiling
    //   const { indexes } = await this.collection.pouch.getIndexes()
    //   const alreadyIndexedFields = flatten(indexes.map(i => i.def.fields)).map(
    //     field => Object.keys(field)[0]
    //   )
    //   // if have not indexed every field
    //   if (intersection(index, alreadyIndexedFields).length !== index.length) {
    //     // need to await or you get error sorting by dates, etc
    //     console.log(
    //       `%c[pouch] CREATE INDEX ${this.title} ${JSON.stringify(index)}`,
    //       'color: green'
    //     )

    //     await this.collection.pouch.createIndex({ fields: index })
    //   }
    // }
  }

  applyDefaults = doc => {
    const defaults = this.getDefaultProps(doc)
    for (const prop of Object.keys(defaults)) {
      if (typeof doc[prop] === 'undefined') {
        doc[prop] = defaults[prop]
      }
    }
  }

  syncQuery = (queryish, options = { live: true, retry: true }) => {
    let query = queryish
    if (query.query) {
      query = query.query
    }
    if (!isRxQuery(query) && !(query.constructor.name === 'RxQuery')) {
      console.log(query.constructor.name, query)
      throw new Error(
        'Could not sync query, does not look like a proper RxQuery object.'
      )
    }
    if (!this.remote) {
      throw new Error('Could not sync query, no remote is specified.')
    }

    const firstReplication = this._collection.sync({
      // query,
      remote: this.remote,
      options: {
        ...options,
        live: false,
      },
    })

    // wait for first replication to finish
    return new Promise(resolve => {
      let resolved = false

      // watched replication stream and checks for finish
      firstReplication.complete$
        .filter(state => {
          const done = state && state.pull && state.pull.ok
          if (done && !resolved) {
            if (options.live) {
              // if live, we re-run with a live query to keep it syncing
              // TODO we need to watch this and clear it on unsubscribe
              const liveReplication = this._collection.sync({
                remote: this.remote,
                options,
              })
              resolve(liveReplication)
            } else {
              resolve(true)
            }
            resolved = true
          }
        })
        .toPromise()
    })
  }

  // user facing!

  // get is a helper that returns a promise only
  get = query => this.collection.findOne(query).exec();

  // find/findOne return RxQuery objects
  // so you can subscribe to streams or just .exec()
  @query
  find = ({ sort, ...query } = {}) =>
    chain(this.collection.find(query), 'sort', sort)

  @query
  findOne = ({ sort, ...query } = {}) =>
    chain(this.collection.findOne(query), 'sort', sort)

  // returns a promise that resolves to found or created model
  findOrCreate = async (object: Object = {}): Promise<Object> => {
    const found = await this.collection.findOne(object).exec()
    return found || (await this.create(object))
  }

  // creates a model without persisting
  async createTemporary(object) {
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
}
