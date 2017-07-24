// @flow
import { Thing, extend, methods, getTitle, getContent } from './thing'

class Thread extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    type: 'thread',
    title: getTitle(doc),
    content: getContent(doc),
  })

  static defaultFilter = doc => ({ type: 'thread', ...doc })

  methods = extend(methods, {
    replies(parentId) {
      return this.collection.find({ draft: false, parentId, type: 'reply' })
    },
  })
}

export default new Thread()
