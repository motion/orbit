export { query } from 'motion-mobx-helpers'

export default class Model {
  async connect(db) {
    this.db = db
    const title = this.schema.title || this.constructor.name
    this.table = await this.db.collection(title, this.schema)
    this.table.sync(`http://localhost:5984/${title.toLowerCase()}`)
    return this
  }
}
