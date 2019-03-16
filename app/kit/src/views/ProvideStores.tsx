import { MergeContext } from '@o/ui'
import { GET_STORE } from '@o/use-store'
import { mapValues } from 'lodash'
import React from 'react'
import { config } from '../configureKit'
import { KitStores } from '../stores'

type ProvideStoresProps = {
  stores: Object
  children: React.ReactNode
}

export function ProvideStores(props: ProvideStoresProps) {
  const next = mapValues(props.stores, val => val[GET_STORE] || val) as KitStores
  console.log('next', next)
  return (
    <MergeContext Context={config.StoreContext} value={next}>
      {props.children}
    </MergeContext>
  )
}
