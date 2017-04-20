import { Component } from 'react'
import view from './view'

export default Component => @view class extends Component {
  onDestroy = () => {
    const { node } = this.props

    window._activeEditor.destroy(node.key)
  }

  render() {
    return <Component onDestroy={this.onDestroy} {...this.props} />
  }
}
