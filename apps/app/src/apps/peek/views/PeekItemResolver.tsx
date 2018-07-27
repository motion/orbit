import * as React from 'react'
import {
  ItemResolver,
  ItemResolverProps,
} from '../../../components/ItemResolver'

export const PeekItemResolver = ({
  bit,
  children,
  item,
  ...props
}: ItemResolverProps) => {
  return (
    <ItemResolver
      bit={bit}
      item={item}
      shownLimit={Infinity}
      isExpanded
      {...props}
    >
      {children}
    </ItemResolver>
  )
}
