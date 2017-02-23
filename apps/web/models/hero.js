import Model from './model'

export default class Hero extends Model {
  title = 'hero2'
  description = 'describes a simple hero'
  properties = {
    name: {
      type: 'string',
      primary: true
    },
    color: {
      type: 'string'
    }
  }
  required = ['color']

  byName = () => this.table.find().sort({ name: 1 }).$
}
