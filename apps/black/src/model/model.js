// @flow
import { compile, str } from './properties'
import { flatten, intersection } from 'lodash'
import type RxDB, { RxCollection } from 'rxdb'
import type PouchDB from 'pouchdb-core'

type SettingsObject = {
  index?: Array<string>,
  database?: string,
}

type ModelArgs = {
  defaultSchema?: Object,
}

export default class Model {
  static props: Object
  static defaultProps: Function | Object
  methods: ?Object
  statics: ?Object
  hooks: ?Object
  settings: SettingsObject
  database: ?RxDB
  defaultSchema: Object
  collection: ?RxCollection & { pouch: PouchDB }
  remoteDb: ?string

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
      ...compile(this.props),
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

  connect = async (
    database: RxDB,
    dbConfig: Object,
    options: Object
  ): Promise<void> => {
    if (this.database) {
      console.log('hmr model')
      return
    }

    this.database = database
    this.remoteDB = options.sync

    console.time('db:connect')
    this.collection = await database.collection({
      name: this.title,
      schema: this.compiledSchema,
      statics: this.statics,
      autoMigrate: true,
      methods: this.compiledMethods,
      pouchSettings: {
        skip_setup: true,
      },
    })
    console.timeEnd('db:connect')

    // shim add pouchdb-validation
    this.collection.pouch.installValidationMethods()

    // create index
    await this.createIndexes()

    // setup hooks
    this.hooks = this.hooks || {}

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
      Object.keys(this.hooks).forEach(hook => {
        this.collection[hook](this.hooks[hook])
      })
    }

    this.replicateToRemote()

    // rxdb watch for query changes
    this.collection.watchForChanges()
  }

  // TODO until rxdb supports query sync
  replicateToRemote = (): void => {
    if (this.replicatingToRemote) {
      return
    }
    this.replicatingToRemote = true
    this.collection.pouch.replicate.to(this.remoteDB, {
      live: true,
      retry: true,
    })
  }

  createIndexes = async (): void => {
    const index = this.settings.index || []

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
}
