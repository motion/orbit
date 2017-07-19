// @flow
import { Thing } from './thing'
import { query } from '@mcro/black'

class Thread extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    type: 'thread',
  })

  static defaultFilter = doc => ({ ...doc, type: 'thread' })

  @query
  replies = parentId =>
    this.collection.find({ draft: false, parentId, type: 'reply' })
}

export default new Thread()
