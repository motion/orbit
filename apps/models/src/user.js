import { Model, query, str } from './helpers'
import App from './app'

class User extends Model {
  static props = {
    title: str,
    authorId: str,
    placeId: str,
    timestamps: true,
  }

  settings = {
    title: '_users',
  }

  @query get = id => this.collection.find(id);
}

export default new User()
