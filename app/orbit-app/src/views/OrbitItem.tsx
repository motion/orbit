import * as React from 'react'
import { OrbitListItem } from './OrbitListItem'
import { OrbitCard } from './OrbitCard'
import { ItemProps } from './OrbitItemProps'

// returns either a card or listItem based on a certain prop

export const OrbitItem = ({ listItem, ...props }: ItemProps<any>) => {
  if (listItem) {
    return <OrbitListItem {...props} />
  } else {
    return <OrbitCard {...props} />
  }
}
