import { MergeContext } from '@o/ui'
import { unwrapProxy } from '@o/use-store'
import { mapValues } from 'lodash'
import React from 'react'

import { config } from '../configureKit'
import { KitStores } from '../stores'

type ProvideStoresProps = {
  stores: Partial<KitStores>
  children: React.ReactNode
}

export function ProvideStores(props: ProvideStoresProps) {
  const next = mapValues(props.stores, unwrapProxy)
  return (
    <MergeContext Context={config.StoreContext} value={next}>
      {props.children}
    </MergeContext>
  )
}
