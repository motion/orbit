import React from 'react'
import { itemViewsApp } from './itemViews'

export function MediaView(props: { type: string }) {
  const View = itemViewsApp[props.type]
  if (!View) {
    throw new Error('Not found view')
  }
  return <View />
}
