import * as React from 'react'
import { TestHMRInner } from './TestHMRSub'
import { useStore } from '@mcro/use-store'

class MyStore {
  otherState = 1
  onClick = () => {
    this.otherState++
  }
}

export function TestHMR(props) {
  const store = useStore(MyStore, props)
  return (
    <>
      Hello world
      <TestHMRInner />
      {store.otherState}
      <button onClick={store.onClick} />
    </>
  )
}
