// @flow
import { CompositeDisposable } from '@mcro/decor'
import { autorun, observable } from 'mobx'
import { compile, str } from './properties'
import { flatten, intersection } from 'lodash'
import type RxDB, { RxCollection } from 'rxdb'
import PouchDB from 'pouchdb-core'
import { cloneDeep } from 'lodash'

type SettingsObject = {
  index?: Array<string>,
  database?: string,
}

type ModelArgs = {
  defaultSchema?: Object,
}

export default class Model {
  static isModel = true
  static props: Object
  static defaultProps: Function | Object

  subscriptions = new CompositeDisposable()
  options: ?Object
  methods: ?Object
  statics: ?Object
  database: ?RxDB
  settings: SettingsObject = {}
  defaultSchema: Object = {}

  @observable connected = false
  // sync to
  remoteDB: ?string = null
  // for tracking which queries we are watching
  queryCache: Object = {}
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
      // cloneDeep fixes bug when re-using a model (compiling twice)
      ...this.props,
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

    if (timestamps) {
      result = {
        ...props,
        createdAt: str.datetime,
        updatedAt: str.datetime,
      }
    }

    result = compile(cloneDeep(result))

    if (timestamps) {
      // result.createdAt.properties.index = true
      // result.updatedAtAt.properties.index = true
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

  get compiledMethods(): Object {
    if (!this.methods) {
      return null
    }

    const descriptors = Object.getOwnPropertyDescriptors(this.methods)
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
    })

    return {
      ...extraDescriptors,
      ...descriptors,
    }
  }

  get collection(): ?RxCollection & { pouch: PouchDB } {
    if (this._collection) {
      return this._collection
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

  setupRemoteDB = (url, options: Object) => {
    if (url) {
      this.remoteDB = new PouchDB(url, options)
    }
  }

  connect = async (database: RxDB, options: Object): Promise<void> => {
    this.options = options

    // re-connect or hmr
    if (this.database) {
      return
    }

    this.setupRemoteDB(options.remote, options.remoteOptions)

    // new connect
    this.database = database

    this._collection = await database.collection({
      name: this.title,
      schema: this.compiledSchema,
      statics: this.statics,
    })

    // shim add pouchdb-validation
    this.collection.pouch.installValidationMethods()

    // bump listeners
    this.collection.pouch.setMaxListeners(100)

    // create index
    await this.createIndexes()

    // auto timestamps
    if (this.hasTimestamps) {
      const ogInsert = this.hooks.preInsert
      this.hooks.preInsert = doc => {
        console.log('i am pre insert')
        doc.createdAt = this.now
        doc.updatedAt = this.now
        if (ogInsert) {
          return ogInsert.call(this, doc)
        }
      }

      const ogSave = this.hooks.preSave
      this.hooks.preSave = doc => {
        doc.updatedAt = this.now
        if (ogSave) {
          return ogSave.call(this, doc)
        }
      }

      // decorate each instance with this.methods
      const ogPostCreate = this.hooks.postCreate
      this.hooks.postCreate = doc => {
        const { compiledMethods } = this
        for (const method of Object.keys(compiledMethods)) {
          const descriptor = compiledMethods[method]
          if (typeof descriptor.get === 'function') {
            descriptor.get = descriptor.get.bind(doc)
          }
        }
        Object.defineProperties(doc, compiledMethods)

        if (ogPostCreate) {
          return ogPostCreate.call(this, doc)
        }
      }
    }

    if (this.collection && this.hooks) {
      Object.keys(this.hooks).forEach((hook: () => Promise<any>) => {
        this.collection[hook](this.hooks[hook])
      })
    }

    // this makes our userdb react properly to login, no idea why
    this.collection.watchForChanges()

    // AND NOW
    this.connected = true
  }

  async dispose() {
    this.subscriptions.dispose()
    if (this._collection) {
      this._collection.destroy()
    }
  }

  createIndexes = async (): Promise<void> => {
    const index = this.settings.index || []

    const { indexes } = await this.collection.pouch.getIndexes()
    // console.log('indexes ARE', indexes, 'vs', index)

    // TODO see if we can remove but fixes bug for now
    await this.collection.pouch.createIndex({ fields: index })

    if (index.length) {
      // TODO: pouchdb supposedly does this for you, but it was slow in profiling
      const { indexes } = await this.collection.pouch.getIndexes()
      const alreadyIndexedFields = flatten(indexes.map(i => i.def.fields)).map(
        field => Object.keys(field)[0]
      )
      // if have not indexed every field
      if (intersection(index, alreadyIndexedFields).length !== index.length) {
        // need to await or you get error sorting by dates, etc
        console.log(
          `%c[pouch] CREATE INDEX ${this.title} ${JSON.stringify(index)}`,
          'color: green'
        )

        await this.collection.pouch.createIndex({ fields: index })
      }
    }
  }

  // helpers

  createTemporary = object => this.create(object, true)

  create = (object: Object = {}, temporary = false): Promise<Object> => {
    const properties = {
      ...this.getDefaultProps(object),
      ...object,
    }

    if (!temporary) {
      console.log(
        `%c${this.constructor.name}.create(${JSON.stringify(properties).slice(
          0,
          100
        )}...)`,
        'color: green'
      )
    }

    return this.collection[temporary ? 'newDocument' : 'insert'](properties)
  }

  findOrCreate = async (object: Object = {}): Promise<Object> => {
    const found = await this.collection.findOne(object).exec()
    return found || (await this.create(object))
  }
}
