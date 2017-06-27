// @flow
import { Model, query, str, object, array, bool } from '@jot/black'

const toSlug = (str: string) => `${str}`.replace(/ /g, '-').toLowerCase()
const methods = {}

export type Org = typeof methods & {
  title: str,
  members: Array<string>,
  private: boolean,
  slug: str,
  timestamps: true,
}

export class OrgModel extends Model {
  static props = {
    title: str,
    members: array.items(str),
    private: bool,
    slug: str,
    timestamps: true,
  }

  static defaultProps = (props: Object) => {
    return {
      members: [],
      private: true,
      slug: toSlug(props.title),
    }
  }

  settings = {
    database: 'orgs',
    index: ['createdAt', 'updatedAt'],
  }

  hooks = {
    preSave: async (org: Object) => {
      const doc = this.get(org.slug)
      if (doc && (await doc.exec())) {
        throw new Error(`Already exists a place with this slug! ${org.slug}`)
      }
    },
  }

  methods = methods
}

export default new OrgModel()
