// @flow
import { Model, query, str, object, array, bool } from '@mcro/black'
import User from './user'
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
    homeDocument: str,
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
      console.log('make new org', org, homeDoc)
    },
    postInsert: async (org: Object) => {
      console.log('post insert, update home doc to have mutual reference', org)
      const homeDoc = await Document.get(org.homeDocument).exec()
      homeDoc.parentId = org._id
      homeDoc.save()
    },
  }

  methods = methods

  @query
  forUser() {
    if (!User.loggedIn) {
      return null
    }
    return this.collection.find({
      members: { $elemMatch: { $eq: User.id } },
    })
  }
}

export default new OrgModel()
