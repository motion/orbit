import { fromStream } from 'mobx-utils'

export function query(parent, property, { initializer, ...descriptor }) {
  return {
    ...descriptor,
    value: function() {
      const value = initializer.call(this)(arguments)
      // add some helpers
      Object.defineProperties(value, {
        'promise': {
          get: () => new Promise((resolve, reject) => {
            value.$.take(1).subscribe(resolve, reject)
          })
        },
        'observable': {
          get: () => fromStream(value.$)
        },
        'stream': {
          get: () => value.$
        }
      })
      return value
    }
  }
}

export class Model {
  async connect(db) {
    this.db = db
    const title = this.schema.title || this.constructor.name
    this.table = await this.db.collection(title, this.schema)
    this.table.sync(`http://localhost:5984/${title.toLowerCase()}`)
    return this
  }
}
