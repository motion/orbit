import { Button, Stack, usePosition } from '@o/ui'
import { react, useStore } from '@o/use-store'
import * as Mobx from 'mobx'
import React, { useRef } from 'react'

window['Mobx'] = Mobx

class TestStore {
  props: any

  y = 1

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

  usePosition({
    ref,
    onChange: pos => {
      console.log('pos', pos, 'ref', ref)
    },
  })

  return (
    <div style={{ height: 2000 }}>
      <h2>y: {store.y}</h2>
      <h2>z: {store.z}</h2>
      <h5>z2: {store.z2}</h5>
      {JSON.stringify(store.abc)}
      <Button tooltip="hi mom" onClick={store.onClick}>
        gooo
      </Button>

      <TestStoresCascading />

      <br />

      <Button onClick={() => store.y++}>ok</Button>

      <Stack direction="horizontal" group>
        <Button>hello</Button>
        {store.y % 2 === 0 ? <Button>hello2</Button> : null}
        <Button>hello3</Button>
        <Button>hello4</Button>
      </Stack>
    </div>
  )
}

class CascadeStore {
  x = 0
}

function TestStoresCascading() {
  const store = useStore(CascadeStore)
  return <div>{store.x}</div>
}

window['TestStore'] = TestStore
