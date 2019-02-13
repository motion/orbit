import { react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import * as Mobx from 'mobx'
import React from 'react'

window['Mobx'] = Mobx

class TestStore {
  props: any

  y = Math.random()

  z = react(() => this.y, x => x + 1)

  get abc() {
    return [this.z, this.props.x]
  }

  onClick = () => {
    this.y++
  }
}

export function TestStores() {
  const store = useStore(TestStore, { x: 1 })
  return (
    <div>
      <h2>y: {store.y}</h2>
      <h2>z: {store.z}</h2>
      {JSON.stringify(store.abc)}
      <button onClick={store.onClick}>gooo</button>
    </div>
  )
}

window['TestStore'] = TestStore
console.log(TestStore)
