import { MergeContext } from '@mcro/ui'
import React from 'react'
import { config } from '../configureKit'

type ProvideStoresProps = {
  stores: Object
  children: React.ReactNode
}

export function ProvideStores(props: ProvideStoresProps) {
  return (
    <MergeContext Context={config.StoreContext} value={props.stores}>
      {props.children}
    </MergeContext>
  )
}
