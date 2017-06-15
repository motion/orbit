import { Model, query, str, object, array, bool } from '@jot/black'
import Image from './image'
import User from './user'
import generateName from 'sillyname'

const toSlug = str => `${str}`.replace(/ /g, '-').toLowerCase()

const DEFAULT_CONTENT = title => ({
  nodes: [
    {
      kind: 'block',
      type: 'title',
      data: {
        level: 1,
      },
      nodes: [
        {
          kind: 'text',
          text: title,
        },
      ],
    },
  ],
})

class Document extends Model {
  static props = {
    title: str,
    content: object,
    text: str.optional,
    authorId: str,
    parentId: str.optional,
    members: array.items(str),
    hashtags: array.items(str),
    attachments: array.optional.items(str),
    private: bool,
    slug: str,
    draft: bool.optional,
    timestamps: true,
  }

  static defaultProps = props => {
    const title = props.title || generateName()
    return {
      title,
      authorId: User.authorId,
      hashtags: [],
      members: [],
      attachments: [],
      private: true,
      content: DEFAULT_CONTENT(title),
      slug: toSlug(title || Math.random()),
    }
  }

  DEFAULT_CONTENT = DEFAULT_CONTENT

  settings = {
    database: 'documents',
    index: ['createdAt', 'updatedAt'],
  }

  hooks = {
    preSave: async ({ slug }) => {
      if (await this.get(slug).exec()) {
        throw new Error(`Already exists a place with this slug! ${slug}`)
      }
    },
  }

  methods = {
    url() {
      return `/d/${this._id.replace(':', '-')}`
    },
    getTitle() {
      try {
        if (this.content.nodes) {
          return this.content.nodes[0].nodes[0].text
        }
        return this.content.document.nodes[0].nodes[0].ranges[0].text
      } catch (e) {
        console.log('err no title node!', this._id)
        return this.title
      }
    },
    togglePrivate() {
      this.private = !this.private
      this.save()
    },
    async addImage(file) {
      return await Image.create({
        file,
        name: ('image' + Math.random()).slice(0, 8),
        docId: this._id,
      })
    },
    toggleSubscribe() {
      if (User.loggedIn) {
        const exists = some(this.members, m => m === User.user.name)
        if (exists) {
          this.members = this.members.filter(m => m !== User.user.name)
        } else {
          this.members = [...this.members, User.user.name]
        }
        this.save()
      }
    },
    subscribed() {
      return User.loggedIn && this.members.indexOf(User.user.name) >= 0
    },
  }

  search = async text => {
    // return recent
    if (text === '') {
      return await this.collection
        .find({ draft: { $ne: true } })
        // .sort({ createdAt: 'desc' })
        .limit(20)
        .exec()
    }

    const ids = (await this.pouch.search({
      query: text,
      fields: ['text', 'title'],
      include_docs: false,
      highlighting: false,
    })).rows.map(row => row.id)

    console.log('ids are', ids)

    return await this.collection.find({ _id: { $in: ids } }).exec()
  }

  @query userHomeDocs = userId => {
    if (!userId) {
      return null
    }
    return this.collection.find({
      parentId: { $exists: false },
      draft: { $ne: true },
    })
  }

  @query child = id => {
    if (!id) {
      return null
    }
    return this.collection
      .find({
        draft: { $ne: true },
      })
      .where('parentId')
      .eq(id)
      .sort({ createdAt: 'desc' })
  }

  @query all = () =>
    this.collection
      .find({ createdAt: { $gt: null } })
      .sort({ createdAt: 'asc' })

  @query recent = (limit = 10) =>
    this.collection
      .find({ draft: { $ne: true } })
      .sort({ createdAt: 'desc' })
      .limit(limit)

  @query get = id => {
    console.log('document get', id)
    if (!id) {
      return null
    }
    return this.collection.findOne(id.replace('-', ':'))
  };

  @query user = user => {
    if (!User.user) {
      return null
    }
    return this.collection.find().where('authorId').eq(User.user.name)
  }
}

export default new Document()
