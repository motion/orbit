export { query } from 'motion-mobx-helpers'

export default class Model {
  get title() {
    return (this.schema.title || this.constructor.name).toLowerCase()
  }

  async connect(db) {
    this.db = db
    this.table = await db.collection({
      name: this.title,
      schema: this.schema,
      statics: this.statics,
      methods: this.methods,
    })
  }
}
