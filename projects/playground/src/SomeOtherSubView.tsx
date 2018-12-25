import * as React from 'react'
import { useStore } from '@mcro/use-store'

class TestStore2 {
  state = 'wut2'

  willMount() {
    setTimeout(() => {
      this.state = 'yeeeeee2'
    }, 1000)
  }
}

export const SomeOtherSubView = ({ id }) => {
  const store = useStore(TestStore2)
  return (
    <div>
      123 123
      {id}: {store.state}
    </div>
  )
}
