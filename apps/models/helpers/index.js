import { compile } from 'kontur'

export { query } from 'motion-mobx-helpers'
export { bool, int, str } from 'kontur'

export class Model {
  get title() {
    return ((this.settings && this.settings.title) || this.constructor.name)
      .toLowerCase()
  }

  get compiledSchema() {
    const schema = {
      ...this.settings,
      ...compile(this.constructor.props),
    }
    return schema
  }

  async connect(db) {
    this.db = db
    this.collection = await db.collection({
      name: this.title,
      schema: this.compiledSchema,
      statics: this.statics,
      methods: this.methods,
    })

    if (this.hooks) {
      Object.keys(this.hooks).forEach(hook => {
        console.log('adding hook', this.title, hook)
        this.collection[hook](this.hooks[hook])
      })
    }
  }
}
