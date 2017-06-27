// @flow
import React from 'react'
import node from '~/editor/node'
import { replacer } from '~/editor/helpers'
import { BLOCKS } from '~/editor/constants'

@node
class CounterNode {
  diff = (num: number) => {
    const { node: { data }, setData } = this.props
    const next = data.set('count', (data.get('count') || 0) + num)
    setData(next)
  }
  render = ({ node: { data } }) =>
    <div contentEditable="false">
      <input type="text" />
      <h1>
        count: {data.get('count') || 0}
      </h1>

      <a
        onClick={() => {
          this.props.onDestroy && this.props.onDestroy()
        }}
      >
        close
      </a>
      <button onClick={() => this.diff(1)}>up</button>
      <button onClick={() => this.diff(-1)}>down</button>
    </div>
  style = {}
}

export default class Counter {
  name = 'counter'
  nodes = {
    [BLOCKS.COUNTER]: CounterNode,
  }
  plugins = [replacer(/^(\-counter)$/, 'counter', { count: 0 })]
}
