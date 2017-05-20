import { Model, query, str, object } from './helpers'
import App from './app'

class Template extends Model {
  static props = {
    name: str,
    content: object,
  }

  settings = {
    title: 'templates',
  }

  @query all = () => {
    return this.collection.find()
  }
}

export default new Template()
