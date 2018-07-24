import * as React from 'react'
import * as PeekBitPanes from './bitPanes'

export const PeekBit = ({ item, ...props }) => {
  console.log('load bit with subtype', item.subType)
  const SubPane = PeekBitPanes[item.subType]
  return <SubPane {...props} />
}
