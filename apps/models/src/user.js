// @flow
import global from 'global'
import { Model, query, array, object, str } from '@mcro/model'

export const methods = {}

export class UserModel extends Model {
  static props = {
    id: str.primary,
    name: str.optional,
    username: str.optional,
    type: str.optional,
    roles: array.optional.items(str),
    providers: array.optional.items(str),
    unverifiedEmail: object.optional,
    local: object.optional,
    signUp: object.optional,
    personalDBs: object.optional,
    activity: array.optional.items(object),
    session: object.optional,
    authorizations: object.optional,
  }

  settings = {
    database: 'users',
  }

  methods = methods
}

const UserInstance = new UserModel()
global.User = UserInstance

export default UserInstance
