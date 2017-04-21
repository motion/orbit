import { Component } from 'react'
import view from './view'

export default Component => @view class extends Component {
  onDestroy = () => {
    const { node } = this.props

    window._activeEditor.destroy(node.key)
  }

  onChange = data => {
    const { node, editor } = this.props

    const next = editor
      .getState()
      .transform()
      .setNodeByKey(node.key, { data })
      .apply()

    editor.onChange(next)
  }

  render() {
    return (
      <Component
        onChange={this.onChange}
        onDestroy={this.onDestroy}
        {...this.props}
      />
    )
  }
}
