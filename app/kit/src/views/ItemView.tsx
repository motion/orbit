import { Bit } from '@mcro/models'
import React from 'react'
import { itemViewsApp } from './itemViews'

export function ItemView(props: { item: Bit }) {
  const View = itemViewsApp[props.item.type]
  if (!View) {
    console.error('ItemView not found', props)
    return null
  }
  return <View item={props.item} />
}
