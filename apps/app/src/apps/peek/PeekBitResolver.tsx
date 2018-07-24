import * as React from 'react'
import { BitResolver } from '../../components/BitResolver'

export const PeekBitResolver = ({ bit, children, ...props }) => {
  return (
    <BitResolver bit={bit} shownLimit={Infinity} isExpanded {...props}>
      {children}
    </BitResolver>
  )
}
