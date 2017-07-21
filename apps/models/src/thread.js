// @flow
import { Thing, extend, methods } from './thing'

class Thread extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    type: 'thread',
    title: Thing.getTitle(doc),
    content: Thing.getContent(doc),
  })

  static defaultFilter = doc => ({ type: 'thread', ...doc })

  methods = extend(methods, {
    replies(parentId) {
      return this.collection.find({ draft: false, parentId, type: 'reply' })
    },
  })
}

export default new Thread()
