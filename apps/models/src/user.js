// @flow
import global from 'global'
import { Model, query, array, object, str } from '@mcro/model'
import Document from './document'
import Org from './org'

export const methods = {}

export class UserModel extends Model {
  static props = {
    name: str,
    username: str,
    type: str,
    roles: array.optional.items(str),
    providers: array.optional.items(str),
    unverifiedEmail: object,
    local: object,
    signUp: object,
    personalDBs: object,
    activity: array.optional.items(object),
    session: object,
    github: object.optional,
  }

  settings = {
    database: 'users',
  }

  methods = methods

  @query orgs = () => Org.forUser(this.id)
  @query favorites = () => Document.favoritedBy(this.id)
}

const UserInstance = new UserModel()
global.User = UserInstance

export default UserInstance
