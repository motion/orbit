// @flow
import { Model, query, str, object, array, bool } from '@mcro/black'

const toSlug = (str: string) => `${str}`.replace(/ /g, '-').toLowerCase()

const methods = {
  async url() {
    return `/d/${this.docId}`
  },
}

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
    admins: array.items(str),
    private: bool,
    slug: str,
    timestamps: true,
  }

  static defaultProps = (props: Object) => {
    return {
      admins: [],
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
    preInsert: () => {
      console.log('create FIRST doc for company!!!!!!!!!!!!!!!!!!')
    },
  }

  methods = methods
}

export default new OrgModel()
