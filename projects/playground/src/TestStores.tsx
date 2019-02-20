import { react } from '@mcro/black'
import { useScreenPosition } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import * as Mobx from 'mobx'
import React, { useRef } from 'react'

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
  const ref = useRef<HTMLDivElement>()

  console.log('render with', ref)

  useScreenPosition(ref, pos => {
    console.log('pos', pos, 'ref', ref)
  })

  window.store = store
  return (
    <div style={{ height: 2000 }}>
      <h2>y: {store.y}</h2>
      <h2>z: {store.z}</h2>
      <h5>z2: {store.z2}</h5>
      {JSON.stringify(store.abc)}
      <button onClick={store.onClick}>gooo</button>
      <div style={{ flex: 1 }} />
      <div ref={ref}>hello</div>
      <div style={{ flex: 1 }} />
      <div>hello2</div>
      <div style={{ flex: 1 }} />
      <div>hello3</div>
      <div style={{ flex: 1 }} />
    </div>
  )
}

window['TestStore'] = TestStore
