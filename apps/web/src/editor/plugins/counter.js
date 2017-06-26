import { view } from '@jot/black'
import { replacer } from '/editor/helpers'
import React from 'react'
import node from '/editor/node'
import { BLOCKS } from '/editor/constants'

class CounterStore {
  diff = num => {
    const { node: { data }, setData } = this.props
    const next = data.set('count', (data.get('count') || 0) + num)
    setData(next)
  }
}

@node
@view({
  store: CounterStore,
})
class CounterNode {
  render({ store, node: { data } }) {
    return (
      <div contentEditable="false">
        <input type="text" />
        <h1>
          count: {data.get('count') || 0}
        </h1>

        <a
          onClick={() => {
            this.props.onDestroy()
          }}
        >
          close
        </a>
        <button onClick={() => store.diff(1)}>up</button>
        <button onClick={() => store.diff(-1)}>down</button>
      </div>
    )
  }

  static style = {}
}

export default class Counter {
  name = 'counter'
  nodes = {
    [BLOCKS.COUNTER]: CounterNode,
  }
  plugins = [replacer(/^(\-counter)$/, 'counter', { count: 0 })]
}
