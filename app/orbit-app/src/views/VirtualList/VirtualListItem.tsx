import * as React from 'react'
import { SortableElement } from 'react-sortable-hoc'
import ListItem, { ListItemProps } from '../ListItems/ListItem'
import { renderHighlightedText } from './renderHighlightedText'

export type VirtualListItemProps<Item> = ListItemProps & {
  item?: Item
  query?: string
  style?: Object
  width?: number
  realIndex?: number
}

const spaceBetween = <div style={{ flex: 1 }} />

class VirtualListItemInner extends React.PureComponent<VirtualListItemProps<any>> {
  render() {
    const { realIndex, style, item, ...rest } = this.props
    return (
      <ListItem
        index={realIndex}
        subtitleSpaceBetween={spaceBetween}
        renderText={renderHighlightedText}
        {...item}
        {...rest}
      />
    )
  }
}

export default SortableElement(VirtualListItemInner)
