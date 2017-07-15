// @flow
import { Model, query, str, object, array, bool } from '@mcro/black'
import Document from './document'

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
    homeDocument: str.optional,
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
      const found = await this.collection.find({ slug: org.slug }).exec()
      if (found) {
        throw new Error(`Already exists a org with this slug! ${org.slug}`)
      }
    },
    preInsert: async (org: Object) => {
      const homeDoc = await Document.create({
        home: true,
        title: 'Welcome',
      })
      org.homeDocument = homeDoc._id
    },
    postInsert: async (org: Object) => {
      const homeDoc = await Document.get(org.homeDocument).exec()
      homeDoc.orgId = org._id
      homeDoc.save()
    },
  }

  methods = methods

  @query
  forUser(id) {
    if (!id) {
      return null
    }
    return this.collection.find({
      members: { $elemMatch: { $eq: id } },
    })
  }
}

export default new OrgModel()
