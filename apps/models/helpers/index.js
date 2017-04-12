export { query } from 'motion-mobx-helpers'

export default class Model {
  get title() {
    return this.schema.title || this.constructor.name
  }

  async connect(db) {
    this.db = db
    this.table = await this.db.collection(this.title, this.schema)
  }
}
