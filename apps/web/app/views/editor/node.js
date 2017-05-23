import React from 'react'
import { view } from '~/helpers'
import { object } from 'prop-types'

export default Component =>
  @view class extends React.Component {
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

    render({ store }) {
      return (
        <node $rootLevel={!Component.plain}>
          <Component
            onChange={this.onChange}
            onDestroy={this.onDestroy}
            editorStore={this.context.editor}
            {...this.props}
          />
        </node>
      )
    }

    static style = {
      rootLevel: {
        borderLeft: [5, 'transparent'],
        borderRight: [5, 'transparent'],
        padding: [0, 15],

        '&:hover': {
          background: '#fefefe',
          borderLeftColor: 'blue',
        },
      },
    }
  }
