import * as React from 'react'
import { BitResolver, BitResolverProps } from '../../../components/BitResolver'

export const PeekBitResolver = ({
  bit,
  children,
  item,
  ...props
}: BitResolverProps) => {
  return (
    <BitResolver
      bit={bit}
      item={item}
      shownLimit={Infinity}
      isExpanded
      {...props}
    >
      {children}
    </BitResolver>
  )
}
