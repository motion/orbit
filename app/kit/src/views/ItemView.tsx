import { Bit } from '@mcro/models'
import React from 'react'
import { itemViewsApp } from './itemViews'

export function ItemView(props: { item: Bit }) {
  const View = itemViewsApp[props.item.type]

  if (!View) {
    throw new Error('Not found view')
  }
  return <View item={props.item} />
}
