import * as React from 'react'
import { OrbitListItem } from './OrbitListItem'
import { OrbitCard } from './OrbitCard'
import { OrbitItemProps } from './OrbitItemProps'

// returns either a card or listItem based on a certain prop

export const OrbitItem = ({ listItem, ...props }: OrbitItemProps) => {
  if (listItem) {
    return <OrbitListItem {...props} />
  } else {
    return <OrbitCard {...props} />
  }
}
