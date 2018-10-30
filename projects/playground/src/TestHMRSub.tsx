import * as React from 'react'
import { view, compose, attach } from '@mcro/black'
import { SomeOtherSubView } from './SomeOtherSubView'

class TestStore {
  x = [0]
  y = Math.random()

  onClick = () => {
    this.x = [...this.x, 0]
  }
}

const decorator = compose(
  attach({
    store: TestStore,
  }),
  view,
)
export const TestHMRInner = decorator(({ store }) => {
  return (
    <div>
      hi123 123 123 123
      <h2>{store.y}</h2>
      <SomeOtherSubView />
      {store.x.map((_, index) => (
        <SomeOtherSubView key={`${index}`} id={index} />
      ))}
      <button onClick={store.onClick}>gooo</button>
    </div>
  )
})
