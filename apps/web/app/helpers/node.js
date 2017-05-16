import React from 'react'
import { view } from '~/helpers'
import { object } from 'prop-types'

export default Component => @view class extends React.Component {
  static contextTypes = {
    editor: object,
  }

  state = { hovering: false, editing: false }

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
  /*
  'media-1_edit-color',
  'media-1_edit-contrast-42',
  'media-1_edit-contrast-43',
  'media-1_edit-saturation',
  */

  render({ store }) {
    const { hovering, editing } = this.state

    return (
      <node
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
      >
        <edit
          contentEditable={false}
          onClick={() => {
            this.setState({ editing: !editing })
          }}
          if={false && hovering}
        >
          {editing ? 'save' : 'edit'}
        </edit>
        <Component
          onChange={this.onChange}
          onDestroy={this.onDestroy}
          editorStore={this.context.editor}
          editing={editing}
          {...this.props}
        />
      </node>
    )
  }

  static style = {
    node: {
      position: 'relative',
    },
    edit: {
      position: 'absolute',
      userSelect: 'none',
      left: -55,
      bottom: 0,
      width: 55,
      padding: 5,
      cursor: 'pointer',
      color: '#333',
      top: 0,
      '&:hover': {
        color: 'black',
      },
    },
  }
}
