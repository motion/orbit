import React from 'react'
import { view, observable } from '~/helpers'
import { object } from 'prop-types'
import { BLOCKS } from '~/views/editor/constants'
import App from '@jot/models'

export default Component => @view class Node {
  static contextTypes = {
    editor: object,
  }

  @observable hovered = false
  @observable hoveredBtn = -1
  @observable hoveredSection = -1
  id = Math.random()

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

    // without this, the editor sometimes doesn't rerender the node
    this.forceUpdate()
  }

  open = (event: MouseEvent) => {
    this.context.editor.lastClick = { x: event.clientX, y: event.clientY }
  }

  render({ node, editor, inline }) {
    const isRoot =
      !this.context.editor.inline &&
      !Component.plain &&
      editor.getState().document.getPath(node.key).length === 1

    const inner = (
      <Component
        {...this.props}
        setData={this.setData}
        onChange={editor.onChange}
        onDestroy={this.onDestroy}
        editorStore={this.context.editor}
        random={Math.random()}
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
        onMouseEnter={this.ref('hovered').setter(true)}
        onMouseLeave={() => this.ref('hovered').set(false)}
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
    btnActive: {
      opacity: 1,
    },
  }
}
