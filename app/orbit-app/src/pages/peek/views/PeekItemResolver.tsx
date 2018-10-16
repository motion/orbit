import * as React from 'react'
import {
  ItemResolver,
  ItemResolverProps,
} from '../../../components/ItemResolver'

export const PeekItemResolver = (props: ItemResolverProps) => {
  return <ItemResolver shownLimit={Infinity} isExpanded {...props} />
}
