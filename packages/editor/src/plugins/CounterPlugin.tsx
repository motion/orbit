// @flow
import React from 'react'

import { BLOCKS } from './constants'
import { replacer } from './helpers'
import node from './node'

@node
const CounterNode = node(({ node }) => {
  const diff = (num: number) => {
    const {
      node: { data },
      setData,
    } = this.props
    const next = data.set('count', (data.get('count') || 0) + num)
    setData(next)
  }
  return (
    <div contentEditable="false">
      <input type="text" />
      <h1>count: {data.get('count') || 0}</h1>
      <a
        onClick={() => {
          this.props.onDestroy && this.props.onDestroy()
        }}
      >
        close
      </a>
      <button onClick={() => diff(1)}>up</button>
      <button onClick={() => diff(-1)}>down</button>
    </div>
  )
})

export class CounterPlugin {
  name = 'counter'
  nodes = {
    [BLOCKS.COUNTER]: CounterNode,
  }
  plugins = [replacer(/^(\-counter)$/, 'counter', { count: 0 })]
}
