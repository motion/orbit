import * as React from 'react'
import { GroupedSearchItem } from './GroupedSearchItem'
import { ListItemProps, ListItem } from '../VirtualList/VirtualListItem'
import { ListItemNormalize } from './ListItemNormalize'

export const SearchResultListItem = React.memo((props: ListItemProps) => {
  if (props.item && props.item.target) {
    switch (props.item.target) {
      case 'search-group':
        const { item, realIndex, query, ...rest } = props
        return <GroupedSearchItem item={item} index={realIndex} query={query} {...rest} />
      case 'bit':
      case 'person-bit':
        return <ListItemNormalize {...props} />
      default:
        return <div>SearchResultListItem no result</div>
    }
  }
  return <ListItem {...props} />
})
