// @flow
import { Thing, extend, methods, getTitle, getContent } from './thing'
import Reply from './reply'

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
    replies() {
      return Reply.collection
        .find({ draft: false, parentId: this.id })
        .sort('createdAt')
    },
    lastReply() {
      return Reply.collection
        .findOne({
          draft: false,
          parentId: this.id,
        })
        .sort('createdAt')
    },
  })
}

export default new Thread()
