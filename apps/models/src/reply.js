// @flow
import { Thing, methods } from './thing'

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
}

export default new Reply()
