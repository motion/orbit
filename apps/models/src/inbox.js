import { Thing, methods, extend } from './thing'
import Thread from './thread'

class Inbox extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    type: 'inbox',
  })
  static defaultFilter = doc => ({ type: 'inbox', ...doc })

  hooks = {
    async postInsert(inbox) {
      await Thread.create({
        title: `Welcome to your inbox: ${inbox.title}`,
        parentId: inbox.id,
        parentIds: [...inbox.parentIds, inbox.id],
      })
    },
  }

  methods = extend(methods, {})
}

export default new Inbox()
