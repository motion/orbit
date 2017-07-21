import React from 'react'
import { view, computed } from '@mcro/black'
import { BLOCKS } from '~/views/editor/constants'
import * as UI from '@mcro/ui'

export default View => {
  @view.basics
  class DecoratedNode extends React.Component {
    static get name() {
      return Node.name
    }

    state = {
      context: null,
    }

    node = null

    get editorStore() {
      return this.props.editor.props.editorStore
    }

    get isRootNode() {
      return (
        this.props.editor.getState().document.getPath(this.props.node.key)
          .length === 1
      )
    }

    setData = data => {
      return this.editorStore.transform(t =>
        t.setNodeByKey(this.props.node.key, { data })
      )
    }

    toggleData = name => {
      const { node: { data }, setData } = this.props

      this.setData(data.set(name, !(data.get(name) || false)))
    }

    onClick = () => {
      this.editorStore.selection.setClicked(this.props.node, this.node)
    }

    onMouseEnter = () => {
      this.editorStore.selection.setHovered(this.props.node, this.node)
    }

    @computed
    get isFocused() {
      const { focusedNode } = this.editorStore.selection
      if (this.editorStore.inline || !this.node) {
        return false
      }
      return focusedNode === this.node
    }

    insert = (type: string, data: Object) => (event: Event) => {
      this.editorStore.transform(t => t.insertBlock({ type, data }))
    }

    contextMenu = () =>
      <UI.Popover
        target={
          <UI.Button
            icon="add"
            iconSize={9}
            size={0.75}
            glow={false}
            chromeless
            color={[0, 0, 0, 0.1]}
            hoverColor={[0, 0, 0, 0.1]}
          />
        }
        closeOnClick
        openOnClick
        escapable
        noArrow
        shadow
        delay={300}
      >
        {isOpen =>
          isOpen &&
          <UI.List
            background
            elevation={1}
            items={[
              {
                primary: 'Doc List',
                onClick: this.insert(BLOCKS.DOC_LIST, { type: 'card' }),
              },
              {
                primary: 'Row',
                onClick: () =>
                  this.editorStore.transform(t =>
                    this.editorStore.allPlugins.row.insertRow(t)
                  ),
              },
              { primary: 'Image', onClick: this.insert(BLOCKS.IMAGE) },
              {
                primary: 'Bullet List',
                onClick: this.insert(BLOCKS.UL_LIST),
              },
              {
                primary: 'Ordered List',
                onClick: this.insert(BLOCKS.OL_LIST),
              },
            ]}
          />}
      </UI.Popover>

    componentProps = {
      setContext: context => {
        this.setState({ context })
      },
    }

    render({ node, editor, onFocus }, { context }) {
      const isInline = this.editorStore.inline
      const isRoot = this.isRootNode
      const isHovered =
        this.editorStore.selection.hovered &&
        node.key === this.editorStore.selection.hovered.key

      const component = (
        <View
          {...this.props}
          setData={this.setData}
          toggleData={this.toggleData}
          onChange={editor.onChange}
          editorStore={this.editorStore}
          isRoot={isRoot}
          setContext={context => {
            this.setState({ context })
          }}
          id={this.id}
          {...this.componentProps}
        />
      )

      if (!isRoot) {
        return component
      }

      const { selection } = this.editorStore
      const isTitle = selection.isDocTitle(node)

      return (
        <node
          $rootLevel={isRoot && !isInline}
          $hoverable={!isTitle}
          $focused={!isTitle && this.isFocused}
          // commenting out because this wasn't used anywhere
          // ref={this.ref('node').set}
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <context if={!isInline} contentEditable={false}>
            {isHovered && !isTitle && (context || this.contextMenu())}
          </context>
          {component}
        </node>
      )
    }

    static style = {
      node: {
        display: 'inline-block',
        position: 'relative',
        padding: [0, 15],
        borderLeft: [3, 'transparent'],
        borderRight: [3, 'transparent'],
        '&:hover > context': {
          opacity: 1,
        },
      },
      context: {
        opacity: 0,
        transition: 'opacity ease-in 200ms',
        transitionDelay: '300ms',
        position: 'absolute',
        left: -5,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      },
      rootLevel: {
        // [line-height, margin]
        padding: [0, 25],
      },
      hoverable: {},
      focused: {},
    }
  }

  return DecoratedNode
}
