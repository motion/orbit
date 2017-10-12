// @flow
import global from 'global'
import { Model, str, object, array } from '@mcro/model'

// keep here so we can use as generic
export const methods = {}

export type PersonType = typeof methods & {
  id: string,
  ids: Object,
  name: string,
  emails: Array<string>,
  avatar: ?string,
  data: ?Object,
  location: ?string,
  bio: ?string,
  createdAt: string,
  updatedAt: string,
}

export class Person extends Model {
  static props = {
    ids: object,
    name: str.indexed,
    emails: array,
    avatar: str.optional,
    data: object.optional,
    location: str.optional,
    bio: str.optional,
    timestamps: true,
  }

  static defaultProps = {
    // map of service: id
    ids: {},
    emails: [],
    name: '',
  }

  methods = methods

  settings = {
    database: 'people',
  }
}

const PersonInstance = new Person()
global.Person = PersonInstance

export default PersonInstance
