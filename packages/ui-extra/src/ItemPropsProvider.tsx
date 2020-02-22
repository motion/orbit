import { MergeContext } from '@o/ui'
import * as React from 'react'

import { ItemPropsContext, ItemsPropsContextType } from './ItemPropsContext'

export type ItemPropsProviderProps = { children: any; value: Partial<ItemsPropsContextType> }

export function ItemPropsProvider(props: ItemPropsProviderProps) {
  return (
    <MergeContext Context={ItemPropsContext} value={props.value}>
      {props.children}
    </MergeContext>
  )
}
