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

    @observable hovered = false
    @observable hoveredBtn = -1
    @observable hoveredSection = -1

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

    open = (event: MouseEvent) => {
      this.context.editor.lastClick = { x: event.clientX, y: event.clientY }
    }

    render({ store, node, editor }) {
      const isRoot =
        !Component.plain &&
        editor.getState().document.getPath(node.key).length === 1

      // avoid circular import
      const Icon = require('../../ui/icon').default

      return (
        <node
          $rootLevel={isRoot}
          onMouseLeave={() => this.ref('hovered').set(false)}
          onMouseEnter={this.ref('hovered').setter(true)}
        >
          <component>
            <Component
              setData={this.setData}
              onChange={editor.onChange}
              onDestroy={this.onDestroy}
              editorStore={this.context.editor}
              {...this.props}
            />
          </component>
          {['top', 'bottom'].map((half, index) => {
            const isHalfHovered =
              (this.hovered && this.hoveredSection === index) ||
              this.hoveredBtn === index
            const isHovered = this.hovered
            return (
              <section
                $half={half}
                $active={isHovered}
                key={half}
                onMouseEnter={this.ref('hoveredSection').setter(index)}
                contentEditable={false}
              >
                <Icon
                  if={isRoot}
                  $btn
                  $btnActive={isHovered}
                  $btnTop={half === 'top'}
                  button
                  name="add"
                  size={6}
                  contentEditable={false}
                  onMouseEnter={this.ref('hoveredBtn').setter(index)}
                  onMouseLeave={
                    this.hoveredBtn === index &&
                      this.ref('hoveredBtn').setter(-1)
                  }
                  onClick={this.open}
                />
                <insertBar
                  $half={half}
                  $$show={isHovered}
                  contentEditable={false}
                />
              </section>
            )
          })}
        </node>
      )
    }

    static style = {
      node: {
        display: 'inline-block',
        position: 'relative',
      },
      rootLevel: {
        // [line-height, margin]
        padding: [0, 55],
        '&:hover': {
          // background: '#f2f2f2',
        },
      },
      component: {
        position: 'relative',
        zIndex: 1,
      },
      section: {
        position: 'absolute',
        left: 0,
        right: 0,
        opacity: 1,
        zIndex: 2,
        height: '50%',
      },
      active: {
        pointerEvents: 'none',
        opacity: 1,
      },
      half: half => {
        const isTop = half === 'top'
        return {
          top: isTop ? 0 : 'auto',
          bottom: isTop ? 'auto' : 0,
          // background: isTop ? 'black' : 'blue',
        }
      },
      insertBar: {
        position: 'absolute',
        height: 1,
        left: 0,
        right: 0,
        bottom: 0,
        borderBottom: [1, 'dotted', '#ddd'],
        transition: ['all', '100ms'],
        opacity: 0,
      },
      btn: {
        position: 'absolute',
        opacity: 0,
        bottom: -5,
        left: 25,
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        pointerEvents: 'auto',
        '&:hover': {
          transform: {
            scale: 2,
          },
        },
      },
      btnTop: {
        bottom: 'auto',
        top: -5,
      },
      btnActive: {
        opacity: 1,
      },
    }
  }
