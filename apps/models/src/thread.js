// @flow
import { Thing, extend, methods, withContent } from './thing'
import Reply from './reply'

class Thread extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    ...withContent(doc),
    type: 'thread',
  })

  static defaultFilter = doc => ({ type: 'thread', ...doc })

  methods = extend(methods, {
    get icon() {
      return 'list'
    },
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
