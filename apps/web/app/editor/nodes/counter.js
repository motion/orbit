import React from 'react'
import { Editor, Raw } from 'slate'
import { view, observable } from '~/helpers'
import node from '~/editor/node'

class CounterStore {
  diff = num => {
    const { node: { data }, setData } = this.props
    const next = data.set('count', (data.get('count') || 0) + num)
    setData(next)
  }

  text = ''
  saveText = () => {
    const { node: { data }, setData } = this.props
    const next = data.set('text', JSON.parse(this.text))
    setData(next)
  }
}

@node
@view({
  store: CounterStore,
})
export default class Counter {
  render({ store, node: { data } }) {
    return (
      <div contentEditable="false">
        <h5>text is {JSON.stringify(data.get('text') || {})}</h5>
        <input value={store.text} onChange={e => store.text = e.target.value} />
        <save onClick={store.saveText}>save</save>
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
