import { Bit } from '@o/models'
import React from 'react'

import { customItems } from './customItems'

export function ItemView(props: { item: Bit }) {
  const customItem = customItems[props.item.type]
  const View = customItem && customItem.item
  if (!View) {
    console.error('ItemView not found', props)
    return null
  }
  return <View item={props.item} />
}
