// @flow
import { Thing, methods } from './thing'

class Thread extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    type: 'thread',
    title: Thing.getTitle(doc),
    content: Thing.getContent(doc),
  })

  static defaultFilter = doc => ({ ...doc, type: 'thread' })

  methods = Object.assign({}, methods, {
    url() {
      return `/thread/${Thing.urlify(this.id)}`
    },
    replies(parentId) {
      return this.collection.find({ draft: false, parentId, type: 'reply' })
    },
  })
}

export default new Thread()
