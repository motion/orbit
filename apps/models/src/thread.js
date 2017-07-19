import { Document } from './document'

class Thread extends Document {
  static props = Document.props
  static defaultProps = Document.defaultProps
  static defaultFind = {
    type: 'thread',
  }

  constructor(...args) {
    super(...args)

    console.log('methods', this.methods, this.hooks)

    this.hooks = {
      ...this.hooks,
      preInsert(thread) {
        thread.type = 'thread'
        super.hooks.preInsert.call(this, thread)
      },
    }

    // this.methods = {
    //   ...this.methods,
    //   replies() {
    //     return this.collection.find({ parentId: this.id, type: 'reply' })
    //   },
    // }
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
