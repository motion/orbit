import React from 'react'
import { view } from '~/helpers'
import { object } from 'prop-types'
import { BLOCKS } from '~/views/editor/constants'
import App from '@jot/models'

export default Component =>
  @view.ui class Node extends React.Component {
    static contextTypes = {
      stores: object,
    }

    get editorStore() {
      return this.context.stores.editorStore
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

    open = (event: MouseEvent) => {
      this.editorStore.lastClick = { x: event.clientX, y: event.clientY }
    }

    onMouseEnter = (event: MouseEvent) => {
      this.editorStore.selection.hover(event, this.props.node)
    }

    onMouseLeave = (event: MouseEvent) => {
      this.editorStore.selection.unHover(event, this.props.node)
    }

    render() {
      const { node, editor } = this.props
      const isRoot =
        this.editorStore.inline === false &&
        editor.getState().document.getPath(node.key).length === 1

      const inner = (
        <Component
          {...this.props}
          setData={this.setData}
          onChange={editor.onChange}
          editorStore={this.editorStore}
          id={this.id}
        />
      )

      if (!isRoot) {
        return inner
      }

      // avoid circular import
      const Icon = require('../../ui/icon').default

      return (
        <node
          $rootLevel={isRoot}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {inner}
          <Icon
            if={isRoot}
            $btn
            $btnActive={this.hovered}
            button
            name="dot"
            size={9}
            contentEditable={false}
            onClick={this.open}
          />
        </node>
      )
    }

    static style = {
      node: {
        display: 'inline-block',
        position: 'relative',
        padding: [0, 22],

        '&:hover > icon': {
          opacity: 1,
        },
      },
      rootLevel: {
        // [line-height, margin]
        padding: [0, 45],
        '&:hover': {
          background: '#f2f2f2',
        },
      },
      btn: {
        position: 'absolute',
        opacity: 0,
        bottom: 0,
        top: 9,
        left: 20,
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        pointerEvents: 'auto',
        transition: 'all ease-in 300ms',
      },
    }
  }
