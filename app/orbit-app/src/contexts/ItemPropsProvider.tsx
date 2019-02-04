import * as React from 'react'
import { ItemPropsContext, ItemsPropsContextType } from '../helpers/contexts/ItemPropsContext'
import { MergeContext } from '../views/MergeContext'

export type ItemPropsProviderProps = { children: any; value: Partial<ItemsPropsContextType> }

export function ItemPropsProvider(props: ItemPropsProviderProps) {
  return (
    <MergeContext Context={ItemPropsContext} value={props.value}>
      {props.children}
    </MergeContext>
  )
}
