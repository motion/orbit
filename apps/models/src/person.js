// @flow
import global from 'global'
import { Model, str, object, array } from '@mcro/model'

// keep here so we can use as generic
export const methods = {}

export type PersonType = typeof methods & {
  id: string,
  name: string,
  emails: Array<string>,
  avatar: ?string,
  data: ?Object,
  createdAt: string,
  updatedAt: string,
}

export class Person extends Model {
  static props = {
    id: str.primary,
    name: str.indexed,
    emails: array,
    avatar: str.optional,
    data: object.optional,
    timestamps: true,
  }

  static defaultProps = {
    emails: [],
  }

  methods = methods

  settings = {
    database: 'people',
  }
}

const PersonInstance = new Person()
global.Person = PersonInstance

export default PersonInstance
