import * as React from 'react'
import * as PeekBitPanes from './bitPanes'
import { capitalize } from 'lodash'

export const PeekBit = ({ item, ...props }) => {
  const SubPane = PeekBitPanes[capitalize(item.subType)]
  console.log('load bit with subtype', item.subType, SubPane)
  if (!SubPane) {
    return <div>Error yo</div>
  }
  return <SubPane {...props} />
}
