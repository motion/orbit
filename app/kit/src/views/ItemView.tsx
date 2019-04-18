import { Bit } from '@o/models'
import React from 'react'
import { customItems } from './customItems'

export function ItemView(props: { item: Bit }) {
  const View = customItems[props.item.type].item
  if (!View) {
    console.error('ItemView not found', props)
    return null
  }
  return <View item={props.item} />
}
