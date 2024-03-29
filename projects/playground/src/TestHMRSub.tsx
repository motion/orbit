import { useStore } from '@o/use-store'
import * as React from 'react'
import { SomeOtherSubView } from './SomeOtherSubView'

class TestStore {
  x = [0]
  y = Math.random()

  onClick = () => {
    this.x = [...this.x, 0]
  }
}

export default function TestHMRInner() {
  const store = useStore(TestStore)
  return (
    <div>
      hi123 123 123 123
      <h2>{store.y}</h2>
      <SomeOtherSubView id={0} />
      {store.x.map((_, index) => (
        <SomeOtherSubView key={`${index}`} id={index} />
      ))}
      <button onClick={store.onClick}>go2</button>
    </div>
  )
}
