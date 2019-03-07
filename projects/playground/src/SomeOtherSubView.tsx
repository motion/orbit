import { useStore } from '@o/use-store'
import * as React from 'react'

class TestStore2 {
  state = 'wut2'
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
