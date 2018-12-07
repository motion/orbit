import * as React from 'react'
import { GroupedSearchItem } from './GroupedSearchItem'
import { ListItemProps } from '../VirtualList/VirtualListItem'
import { ListItemNormalize } from './ListItemNormalize'

export const SearchResultListItem = React.memo((props: ListItemProps) => {
  switch (props.model.target) {
    case 'search-group':
      const { model, realIndex, query, ...rest } = props
      const item = model as any
      return <GroupedSearchItem item={item} index={realIndex} query={query} {...rest} />
    case 'bit':
    case 'person-bit':
      return <ListItemNormalize {...props} />
    default:
      return <div>SearchResultListItem no result</div>
  }
})
