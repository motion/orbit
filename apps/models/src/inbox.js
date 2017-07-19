import { Document } from './document'

class Inbox extends Document {
  static props = Document.props
  static defaultProps = Document.defaultProps
  static defaultFind = {
    type: 'inbox',
  }

  constructor(...args) {
    super(...args)

    this.hooks = {
      ...this.hooks,
      preInsert(inbox) {
        inbox.type = 'inbox'
        super.hooks.preInsert.call(this, inbox)
      },
    }

    // this.methods = {
    //   ...this.methods,
    //   replies() {
    //     return this.collection.find({ parentId: this.id, type: 'reply' })
    //   },
    // }
  }

  // this filters it down to type === 'inbox'
  get collection() {
    return new Proxy(super.collection, {
      get(target, method) {
        if (method === 'find' || method === 'findOne') {
          return query => target[method]({ type: 'inbox', ...query })
        }
        return target[method]
      },
    })
  }
}

export default new Inbox()
