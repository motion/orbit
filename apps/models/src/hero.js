import { Model, query } from './model'

class Hero extends Model {
  schema = {
    title: 'hero3',
    required: ['color'],
    properties: {
      name: {
        type: 'string',
        primary: true
      },
      color: {
        type: 'string'
      }
    }
  }

  @query byName = () => {
    return this.table.find().sort({ name: 1 })
  }
}

export default new Hero()
