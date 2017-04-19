import { compile } from 'kontur'

export { query } from 'motion-mobx-helpers'
export { bool, int, str, object } from 'kontur'

export class Model {
  get title() {
    return ((this.settings && this.settings.title) || this.constructor.name)
      .toLowerCase()
  }

  defaultSchema = {
    primaryPath: '_id',
    version: 0,
    disableKeyCompression: true,
  }

  get compiledSchema() {
    const schema = {
      ...this.defaultSchema,
      ...this.settings,
      ...compile(this.constructor.props),
    }
    return schema
  }

  get compiledMethods() {
    return {
      ...this.methods,
      delete() {
        return this.collection
          .findOne(this._id)
          .exec()
          .then(doc => doc.remove())
      },
    }
  }

  async connect(db) {
    this.db = db
    this.collection = await db.collection({
      name: this.title,
      schema: this.compiledSchema,
      statics: this.statics,
      methods: this.compiledMethods,
    })

    if (this.hooks) {
      Object.keys(this.hooks).forEach(hook => {
        console.log('adding hook', this.title, hook)
        this.collection[hook](this.hooks[hook])
      })
    }
  }
}
