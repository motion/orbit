import * as React from 'react'
import { ListItem } from '../VirtualList/VirtualListItem'
import { ListItemNormalize } from './ListItemNormalize'

export const SearchResultListItem = React.memo((props: any) => {
  console.log('render search item', props.item)
  if (props.item && props.item.target) {
    switch (props.item.target) {
      case 'bit':
      case 'person-bit':
        return <ListItemNormalize {...props} />
      default:
        return <div>SearchResultListItem no result</div>
    }
  }
  return <ListItem {...props} />
})
