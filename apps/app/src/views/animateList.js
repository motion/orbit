import { view } from '@mcro/black'
import { isEqual } from 'lodash'

@view
export class AnimateList {
  state = {
    children: [],
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.children || !Array.isArray(nextProps.children)) {
      return
    }
    const oldKeys = this.state.children.map(x => x.key)
    const newKeys = nextProps.children.map(x => x.key)
    if (!isEqual(oldKeys, newKeys)) {
      this.setState({ willAnimate: true }, () => {
        this.setState({ children: nextProps.children })
      })
    }
  }

  render({ children }) {
    if (!children || !children.length) {
      return null
    }
    return <list>{this.state.children}</list>
  }
}
