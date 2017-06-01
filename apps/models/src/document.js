import { Model, query, str, object, array, bool } from './helpers'
import Image from './image'
import Place from './place'
import App from './app'
import generateName from 'sillyname'

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
    authorId: str,
    placeId: str.optional,
    places: array.optional.items(str),
    hashtags: array.items(str),
    attachments: array.optional.items(str),
    private: bool,
    temporary: bool.optional,
    timestamps: true,
    draft: bool.optional,
  }

  static defaultProps = props => {
    const title = props.title || generateName()
    return {
      title,
      authorId: App.user && App.user.name,
      hashtags: [],
      attachments: [],
      private: true,
      content: DEFAULT_CONTENT(title),
    }
  }

  DEFAULT_CONTENT = DEFAULT_CONTENT

  settings = {
    title: 'documents',
    index: ['createdAt'],
  }

  hooks = {
    preSave: async ({ title, placeId }) => {
      // sync title
      if (placeId) {
        console.log('save document to place', placeId)
        const place = await Place.get(placeId).exec()
        if (place && place.title !== title) {
          place.title = title
          place.save()
        }
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
  }

  @query homeForPlace = id => {
    if (!id) {
      return null
    }
    return this.collection.findOne().where('placeId').eq(id)
  }

  @query forPlace = id => {
    if (!id) {
      return null
    }
    return (
      this.collection
        .find({
          placeId: { $exists: false },
          draft: { $ne: true },
        })
        .where('places')
        // in array find
        .elemMatch({ $eq: id })
        .sort({ createdAt: 'desc' })
    )
  }

  @query forHashtag = (slug, hashtag) => {
    if (!slug) {
      return null
    }

    return this.collection
      .find({
        hashtags: { $elemMatch: { $eq: hashtag } },
        draft: { $ne: true },
        places: { $elemMatch: { $eq: slug } },
      })
      .sort({ createdAt: 'desc' })
  }

  @query all = () => this.collection.find().sort({ createdAt: 'asc' })

  @query recent = (limit = 10) =>
    this.collection
      .find({ draft: { $ne: true } })
      .sort({ createdAt: 'desc' })
      .limit(limit)

  @query get = id => {
    if (!id) return null
    return this.collection.findOne(id.replace('-', ':'))
  };

  @query user = user => {
    if (!App.user) {
      return null
    }
    return this.collection.find().where('authorId').eq(App.user.name)
  }
}

export default new Document()
