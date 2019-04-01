import { useStore } from '@o/use-store'
import * as React from 'react'

class MyStore {
  firstState = 0
  otherState = 1

  onClick = () => {
    this.otherState++
  }
}

export const TestHMR = () => {
  const store = useStore(MyStore)
  if (!store.firstState) {
    setTimeout(() => {
      store.firstState = 2
    }, 1000)
    return <div>nooooo</div>
  }
  return (
    <>
      Hello world {/* <TestHMRInner /> */}
      first state: {store.firstState}
      <br />
      next state: {store.otherState}
      <br />
      <button onClick={store.onClick} />
    </>
  )
}
