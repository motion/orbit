import React from 'react'
import { StoreContext } from '../contexts'
import { MergeContext } from '../views/MergeContext'

type ProvideStoresProps = {
  stores: Object
  children: React.ReactNode
}

export function ProvideStores(props: ProvideStoresProps) {
  return (
    <MergeContext Context={StoreContext} value={props.stores}>
      {props.children}
    </MergeContext>
  )
}
