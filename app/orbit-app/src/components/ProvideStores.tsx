import { MergeContext } from '@mcro/ui'
import React from 'react'
import { StoreContext } from '../contexts'

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
