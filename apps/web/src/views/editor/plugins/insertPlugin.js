import { view } from '@mcro/black'
import { replacer } from '~/views/editor/helpers'
import React from 'react'
import node from '~/views/editor/node'
import { BLOCKS } from '~/views/editor/constants'

class InsertStore {
  names = ['image', 'video', 'list', 'todo']
  activeIndex = 0

  step = diff => {
    this.activeIndex += diff
    if (this.activeIndex < 0) this.activeIndex = this.names.length - 1
    if (this.activeIndex > this.names.length - 1) this.activeIndex = 0
  }
}

@node
@view({
  store: InsertStore,
})
class InsertNode {
  onKeyDown = e => {
    const { store } = this.props
    if (e.which === 37) store.step(-1)
    if (e.which === 39) store.step(1)
    if (e.which === 13) this.insert(store.names[store.activeIndex])
  }

  insert(type) {
    this.props.editorStore.transform(t => t.setBlock({ type, data: {} }))
  }

  componentDidMount() {
    this.props.editorStore.blur()
    requestAnimationFrame(() => {
      addEventListener('keydown', this.onKeyDown)
    })
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.onKeyDown)
  }

  render({ store, node: { data } }) {
    const { names, activeIndex } = store

    return (
      <insert $$row contentEditable={false}>
        {names.map((name, index) =>
          <block
            key={name}
            onClick={() => this.insert(name)}
            $active={index === activeIndex}
          >
            {name}
          </block>
        )}
      </insert>
    )
  }

  static style = {
    insert: {
      margin: 20,
    },
    block: {
      width: 80,
      userSelect: 'none',
      height: 80,
      background: '#eee',
      border: '1px solid #ccc',
      marginRight: 20,
      justifyContent: 'center',
      textAlign: 'center',
      opacity: 0.6,
      cursor: 'pointer',
      transition: 'all 150ms ease-in',

      '&:hover': {
        opacity: 1,
      },
    },
    active: {
      boxShadow: '1px 1px 1px #ccc',
      border: '1px solid #333',
    },
  }
}

export default class Insert {
  name = 'insert'
  nodes = {
    [BLOCKS.INSERT]: InsertNode,
  }
  plugins = [replacer(/^(\-insert)$/, 'insert', {})]
}
