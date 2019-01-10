import * as React from 'react'
import { ListItem } from '../VirtualList/VirtualListItem'
import { ListItemNormalize } from './ListItemNormalize'

export const SearchResultListItem = React.memo((props: any) => {
  if (props.target) {
    switch (props.target) {
      case 'bit':
      case 'person-bit':
        return <ListItemNormalize item={props as any} {...props} />
      default:
        return <div>SearchResultListItem no result</div>
    }
  }
  return <ListItem {...props} />
})
