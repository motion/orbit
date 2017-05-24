import React from 'react'
import { view } from '~/helpers'
import { object } from 'prop-types'
import { BLOCKS } from '~/views/editor/constants'
import App from '@jot/models'

export default Component =>
  @view class extends React.Component {
    static contextTypes = {
      editor: object,
    }

    onDestroy = () => {
      const { node } = this.props
    }

    setData = data => {
      const { node, editor } = this.props
      const next = editor
        .getState()
        .transform()
        .setNodeByKey(node.key, { data })
        .apply()
      editor.onChange(next)
    }

    enter = (event: MouseEvent) => {
      this.context.editor.lastClick = { x: event.clientX, y: event.clientY }
    }

    render({ store, node, editor }) {
      const isRoot =
        !Component.plain &&
        editor.getState().document.getPath(node.key).length === 1

      return (
        <node $rootLevel={isRoot}>
          <btn
            contentEditable={false}
            if={isRoot}
            $left
            onMouseEnter={this.enter}
            onMouseLeave={this.leave}
          >
            +
          </btn>
          <Component
            setData={this.setData}
            onChange={editor.onChange}
            onDestroy={this.onDestroy}
            editorStore={this.context.editor}
            {...this.props}
          />
          <btn contentEditable={false} $right />
        </node>
      )
    }

    static style = {
      node: {
        display: 'inline-block',
        position: 'relative',
      },
      rootLevel: {
        padding: [2, 25],

        '&:hover': {
          background: '#f2f2f2',
        },

        '&:hover > btn': {
          opacity: 1,
        },
      },
      btn: {
        position: 'absolute',
        opacity: 0,
        top: 0,
        bottom: 0,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',

        '&:hover': {
          background: 'red',
        },
      },
      left: {
        left: 0,
      },
      right: {
        right: 0,
      },
    }
  }
