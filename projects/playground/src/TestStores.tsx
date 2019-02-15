import { react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import * as Mobx from 'mobx'
import React from 'react'

window['Mobx'] = Mobx

class TestStore {
  props: any

  y = Math.random()

  z = react(() => this.y, x => x + 1)

  z2 = react(
    () => {
      return this.z
    },
    z => {
      return z * 100
    },
  )

  get abc() {
    return [this.z, this.props.x]
  }

  onClick = () => {
    this.y++
  }
}

export function TestStores() {
  const store = useStore(TestStore, { x: 1 })
  window.store = store
  return (
    <div>
      <h2>y: {store.y}</h2>
      <h2>z: {store.z}</h2>
      <h5>z2: {store.z2}</h5>
      {JSON.stringify(store.abc)}
      <button onClick={store.onClick}>gooo</button>
    </div>
  )
}

window['TestStore'] = TestStore
