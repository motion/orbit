import { compile, str } from './properties'
import { flatten, intersection } from 'lodash'

export default class BaseModel {
  constructor({ defaultSchema, defaultProps }) {
    this.create = this.create.bind(this)
    this.defaultSchema = defaultSchema
    this.compiledSchema = {
      ...this.defaultSchema,
      ...this.settings,
      ...compile(this.props),
    }
  }

  get hasTimestamps() {
    return this.constructor.props.timestamps === true
  }

  get now() {
    return new Date().toISOString()
  }

  get pouch() {
    return this.collection.pouch
  }

  get props() {
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

  getDefaultProps(props) {
    const { defaultProps } = this.constructor
    return typeof defaultProps === 'function'
      ? defaultProps(props)
      : defaultProps || {}
  }

  get title() {
    return ((this.settings && this.settings.title) || this.constructor.name)
      .toLowerCase()
  }

  get compiledMethods() {
    return {
      ...this.methods,
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

  async connect(db) {
    this.db = db
    console.time('db-connect')
    this.collection = await db.collection({
      name: this.title,
      schema: this.compiledSchema,
      statics: this.statics,
      autoMigrate: true,
      pouchSettings: {
        revsLimit: 100,
        skipSetup: true,
      },
      methods: this.compiledMethods,
    })
    console.timeEnd('db-connect')

    // shim add pouchdb-validation
    this.collection.pouch.installValidationMethods()

    // create index
    if (this.settings.index) {
      // TODO: pouchdb supposedly does this for you, but it was slow in profiling
      const { indexes } = await this.collection.pouch.getIndexes()
      const alreadyIndexedFields = flatten(indexes.map(i => i.def.fields)).map(
        field => Object.keys(field)[0]
      )
      // if we have not indexed every field
      if (
        intersection(this.settings.index, alreadyIndexedFields).length !==
        this.settings.index.length
      ) {
        // need to await or you get error sorting by dates, etc
        await this.collection.pouch.createIndex({ fields: this.settings.index })
      }
    }

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

    Object.keys(this.hooks).forEach(hook => {
      this.collection[hook](this.hooks[hook])
    })
  }

  // helpers

  create(object = {}) {
    const properties = {
      ...this.getDefaultProps(object),
      ...object,
    }
    console.log('create', properties)
    return this.collection.insert(properties)
  }
}
