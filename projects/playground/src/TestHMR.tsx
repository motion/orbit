import * as React from 'react'
import { TestHMRInner } from './TestHMRSub'
import { useStore } from './useStores'
import { store } from '@mcro/black'

// useStore
// useParentStore

@store
class MyStore {
  otherState = 1
  onClick = () => {
    console.log('click')
    this.otherState++
  }
}

export function TestHMR(props) {
  // const { state } = useParentStore(MyStore, ['state'])
  const { otherState, onClick } = useStore(MyStore, ['otherState'], props)
  return (
    <>
      hello22222 1232 123 123123 123 123 123123 123 123 123
      <TestHMRInner />
      {otherState}
      <button onClick={onClick} />
    </>
  )
}
