import React from 'react'
import { view, observable } from '~/helpers'
import { object } from 'prop-types'
import { BLOCKS } from '~/views/editor/constants'
import App from '@jot/models'

export default Component =>
  @view class extends React.Component {
    static contextTypes = {
      editor: object,
    }

    @observable btnActive = false

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
      this.btnActive = true
    }

    leave = () => {
      this.btnActive = false
    }

    render({ store, node, editor }) {
      const isRoot =
        !Component.plain &&
        editor.getState().document.getPath(node.key).length === 1

      return (
        <node
          $rootLevel={isRoot}
          onMouseEnter={this.ref('btnActive').setter(true)}
          onMouseLeave={this.ref('btnActive').setter(false)}
        >
          <btn
            $btnActive={this.btnActive}
            contentEditable={false}
            if={isRoot}
            $left
            onMouseEnter={this.enter}
            onMouseLeave={this.leave}
          />
          <insertBar contentEditable={false} />
          <Component
            setData={this.setData}
            onChange={editor.onChange}
            onDestroy={this.onDestroy}
            editorStore={this.context.editor}
            {...this.props}
          />
        </node>
      )
    }

    static style = {
      node: {
        display: 'inline-block',
        position: 'relative',
        '&:hover > insertBar': {
          opacity: 1,
        },
      },
      rootLevel: {
        // [line-height, margin]
        padding: [2, 55],
        '&:hover': {
          background: '#f2f2f2',
        },
      },
      insertBar: {
        position: 'absolute',
        height: 1,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#ccc',
        transition: ['all', '100ms'],
        opacity: 0,
      },
      btn: {
        position: 'absolute',
        opacity: 0,
        bottom: -5,
        width: 10,
        height: 10,
        borderRadius: 100,
        background: '#eee',
        color: '#fff',
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      },
      btnActive: {
        opacity: 1,
      },
      left: {
        left: 0,
      },
      right: {
        right: 0,
      },
    }
  }
