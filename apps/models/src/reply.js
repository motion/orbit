// @flow
import { Thing, methods } from './thing'
import Thread from './thread'

const type = 'reply'

class Reply extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    type,
    content: Thing.getContent(doc),
  })

  static defaultFilter = doc => ({ ...doc, type })

  methods = methods

  // hooks = {
  //  could use this to auto update the threads preview text
  //   async postInsert(reply) {
  //     const thread = await Thread.get(reply.parentId).exec()
  //     thread.text
  //   },
  // }
}

export default new Reply()
