// @flow
import { CompositeDisposable } from '@jot/decor'
import { autorun, observable } from 'mobx'
import { compile, str } from './properties'
import { flatten, intersection } from 'lodash'
import type RxDB, { RxCollection } from 'rxdb'
import type PouchDB from 'pouchdb-core'
import { cloneDeep } from 'lodash'

type SettingsObject = {
  index?: Array<string>,
  database?: string,
}

type ModelArgs = {
  defaultSchema?: Object,
}

export default class Model {
  subscriptions = new CompositeDisposable()

  static isModel = true
  static props: Object
  static defaultProps: Function | Object
  options: ?Object = null
  methods: ?Object
  statics: ?Object
  settings: SettingsObject
  database: ?RxDB
  defaultSchema: Object
  collection: ?RxCollection & { pouch: PouchDB }

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
      ...compile(cloneDeep(this.props)),
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
    if (timestamps) {
      return {
        ...props,
        createdAt: str.datetime,
        updatedAt: str.datetime,
      }
    }
    return props
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
    return {
      ...(this.methods || {}),
      // get id() {
      //   return this._id
      // },
      delete() {
        return this.collection
          .findOne(this._id)
          .exec()
          .then(doc => doc && doc.remove())
      },
    }
  }

  get collection() {
    if (this._collection) {
      return this._collection
    }
    // chain().until().exec().or().$
    const self = this
    const worm = () =>
      new Proxy(
        {
          exec: () => Promise.resolve(false),
          isProxy: true,
        },
        {
          get(target: Object | Class, name: string) {
            if (name === '$') {
              const parent = {
                @observable subscribe: a => b => b,
              }

              const stop = autorun(() => {
                if (self.connected) {
                  if (stop) stop()
                  setTimeout(() => {
                    parent.subscribe = null // trigger re-query
                  })
                }
              })

              return parent
            }
            return () => worm()
          },
        }
      )
    return worm()
  }

  setupRemoteDB = (url, options: Object) => {
    this.remoteDB = new PouchDB(url, options)
  }

  connect = async (database: RxDB, options: Object): Promise<void> => {
    this.options = options

    if (options.remote) {
      this.setupRemoteDB(options.remote, options.remoteOptions)
    }

    // re-connect or hmr
    if (this.database || !database) {
      return
    }

    // new connect
    this.database = database
    this._collection = await database.collection({
      name: this.title,
      schema: this.compiledSchema,
      statics: this.statics,
      methods: this.compiledMethods,
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

    // this.subscriptions.add(() => {
    //   this._collection && this._collection.remove()
    // })
  }

  // dispose() {
  //   this.subscriptions.dispose()
  // }

  createIndexes = async (): Promise<void> => {
    const index = this.settings.index || []

    // TODO see if we can remove but fixes bug for now
    await this.collection.pouch.createIndex({ fields: index })

    if (index.length) {
      // TODO: pouchdb supposedly does this for you, but it was slow in profiling
      const { indexes } = await this.collection.pouch.getIndexes()
      const alreadyIndexedFields = flatten(indexes.map(i => i.def.fields)).map(
        field => Object.keys(field)[0]
      )
      // if we have not indexed every field
      if (intersection(index, alreadyIndexedFields).length !== index.length) {
        // need to await or you get error sorting by dates, etc
        console.log(
          `%c[pouch] CREATE INDEX ${this.title} ${JSON.stringify(index)}`,
          'color: green'
        )

        await this.collection.pouch.createIndex({ fields: index })
      } else {
        console.log(
          `%c[pouch] HAS INDEX ${this.title} ${JSON.stringify(index)}`,
          'color: green'
        )
      }
    }
  }

  // helpers

  create = (object: Object = {}): Promise<Object> => {
    const properties = {
      ...this.getDefaultProps(object),
      ...object,
    }
    console.log(
      `'%c ${this.constructor.name}.create ${JSON.stringify(properties)}`,
      'color: green'
    )
    return this.collection.insert(properties)
  }

  findOrCreate = async (object: Object = {}): Promise<Object> => {
    const found = await this.collection.findOne(object).exec()
    return found || (await this.create(object))
  }
}
