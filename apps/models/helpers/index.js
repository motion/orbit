export { query } from 'motion-mobx-helpers'

export default class Model {
  get title() {
    return (this.schema.title || this.constructor.name).toLowerCase()
  }

  async connect(db) {
    this.db = db
    this.collection = await db.collection({
      name: this.title,
      schema: this.schema,
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
