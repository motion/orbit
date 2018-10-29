// @ts-ignore
import { useContext, useState, useEffect } from 'react'
import { reaction } from 'mobx'

const pluck = <A extends any>(...values: Array<keyof A>) => (a: A) => {
  const res = {} as Partial<A>
  for (const val of values) {
    res[val] = a[val]
  }
  return res
}

export const useParentStore = <A, B>(Store: A, ...keys: Array<keyof A>) => {
  const store = useContext(Store)
  const setState = useState(null)[1]
  let val
  useEffect(() => reaction(() => pluck(...keys)(store), setState))
  return val as B
}

// useStore
// useParentStore

class MyStore {
  state = 0
  otherState = 1
}

function MyView() {
  const { state, otherState } = useParentStore(MyStore, 'state', 'otherState')
  return (
    <div>
      {state} {otherState}
    </div>
  )
}
