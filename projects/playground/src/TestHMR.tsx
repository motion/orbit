import * as React from 'react'
import { TestHMRInner } from './TestHMRSub'
import { useStore } from '@mcro/use-store'

class MyStore {
  firstState = 0
  otherState = 1

  onClick = () => {
    this.otherState++
  }
}

export function TestHMR(props) {
  const store = useStore(MyStore, props)
  if (!store.firstState) {
    setTimeout(() => {
      store.firstState = 2
    }, 1000)
    return <div>nooooo</div>
  }
  return (
    <>
      Hello world
      {/* <TestHMRInner /> */}
      first state: {store.firstState}
      <br />
      next state: {store.otherState}
      <br />
      <button onClick={store.onClick} />
    </>
  )
}
