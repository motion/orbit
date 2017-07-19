import { Document } from './document'

class Thread extends Document {
  static props = Document.props
  static defaultProps = Document.defaultProps
  static defaultFind = {
    type: 'thread',
  }

  hooks = {
    ...super.hooks,
    preInsert(thread) {
      thread.type = 'thread'
      super.hooks.preInsert.call(this, thread)
    },
  }

  // this filters it down to type === 'thread'
  get collection() {
    return new Proxy(super.collection, {
      get(target, method) {
        if (method === 'find' || method === 'findOne') {
          return query => target[method]({ type: 'thread', ...query })
        }
        return target[method]
      },
    })
  }
}

export default new Thread()
