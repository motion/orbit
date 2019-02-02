import * as React from 'react'
import { ItemPropsContext, ItemsPropsContextType } from '../helpers/contexts/ItemPropsContext'
import { MergeContext } from '../views/MergeContext'

export function ItemPropsProvider(props: { children: any; value: Partial<ItemsPropsContextType> }) {
  return (
    <MergeContext Context={ItemPropsContext} value={props.value}>
      {props.children}
    </MergeContext>
  )
}
