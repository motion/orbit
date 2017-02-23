export default class Model {
  constructor(db) {
    this.db = db
  }

  connect = async () => {
    console.log(this.schema)
    this.table = await this.db.collection(this.title, this.schema)
    this.table.sync(`http://localhost:5984/${this.title.toLowerCase()}`)
  }

  get schema() {
    return {
      title: this.title,
      description: this.description || '',
      properties: this.properties,
      required: this.required,
    }
  }
}
