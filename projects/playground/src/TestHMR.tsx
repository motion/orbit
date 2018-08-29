import * as React from 'react'
import { view, compose } from '@mcro/black'

const decorator = compose(
  view.attach({
    store: class {
      x = [0]

      onClick = () => {
        this.x = [
          ...this.x,
          0
        ]
      }
    },
  }),
  view,
)

export const TestHMR = () => <>
  hello
  <TestHMRInner />
</>


const TestHMRInner = decorator(({ store }) => {
  return (
    <div>
      123 123 123 123 123 123 123 123123123123 123
      <SomeOtherSubView />
      {/* {store.x.map((_, index) => (
        <SomeOtherSubView key={`${key}${index}`} id={index} />
      ))} */}
      <button onClick={store.onClick}>gooo</button>
    </div>
  )
})

const subDecorator = compose(
  view.attach({
    store: class {
      state = 'wut'

      willMount() {
        setTimeout(() => {
          this.state = 'yeeeeeeeeeeee'
        }, 1000)
      }
    },
  }),
  view,
)

const SomeOtherSubView = subDecorator(({ store, id }) => {
  return <div>{id}: {store.state}</div>
})
