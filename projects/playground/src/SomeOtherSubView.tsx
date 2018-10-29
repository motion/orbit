import * as React from 'react'
import { view, compose, attach } from '@mcro/black'

class TestStore2 {
  state = 'wut2'

  willMount() {
    setTimeout(() => {
      this.state = 'yeeeeee2'
    }, 1000)
  }
}

const subDecorator = compose(
  attach({
    store: TestStore2,
  }),
  view,
)
export const SomeOtherSubView = subDecorator(({ store, id }) => {
  return (
    <div>
      123 123
      {id}: {store.state}
    </div>
  )
})
