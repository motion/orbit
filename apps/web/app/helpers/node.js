import React from 'react'
import { object } from 'prop-types'

export default Component =>
  class extends React.Component {
    static contextTypes = {
      editor: object,
    }

    onDestroy = () => {
      const { node } = this.props
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
          editorStore={this.context.editor}
          {...this.props}
        />
      )
    }
  }
