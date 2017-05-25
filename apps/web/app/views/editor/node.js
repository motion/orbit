import React from 'react'
import { view, observable } from '~/helpers'
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

    node = null

    onClick = (event: MouseEvent) => {
      this.editorStore.selection.click(event, this.node)
    }

    onMouseEnter = (event: MouseEvent) => {
      this.editorStore.selection.hover(event, this.node)
    }

    get isFocused() {
      if (!this.node) return
      return this.editorStore.selection.lastNode === this.node
    }

    render() {
      const { node, editor, onFocus } = this.props
      const isRoot =
        this.editorStore.inline === false &&
        editor.getState().document.getPath(node.key).length === 1

      return (
        <node
          $rootLevel={isRoot}
          $focused={this.isFocused}
          ref={this.ref('node').set}
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <Component
            {...this.props}
            setData={this.setData}
            onChange={editor.onChange}
            editorStore={this.editorStore}
            id={this.id}
          />
        </node>
      )
    }

    static style = {
      node: {
        display: 'inline-block',
        position: 'relative',
        padding: [0, 18],
        borderLeft: [3, 'transparent'],
        borderRight: [3, 'transparent'],
      },
      rootLevel: {
        // [line-height, margin]
        padding: [0, 40],
        '&:hover': {
          background: '#fafafa',
        },
      },
      focused: {
        borderLeftColor: 'blue',
      },
    }
  }
