import * as React from 'react'
import ListItem, { ListItemProps } from '../ListItems/ListItem'
import { SortableElement } from 'react-sortable-hoc'
import { renderHighlightedText } from './renderHighlightedText'

export type VirtualListItemProps = ListItemProps & {
  query?: string
  style?: Object
  width?: number
  realIndex: number
}

const spaceBetween = <div style={{ flex: 1 }} />

class VirtualListItemInner extends React.PureComponent<VirtualListItemProps> {
  render() {
    const { realIndex, style, ...rest } = this.props
    return (
      <ListItem
        index={realIndex}
        subtitleSpaceBetween={spaceBetween}
        renderText={renderHighlightedText}
        {...rest}
      />
    )
  }
}

export default SortableElement(VirtualListItemInner)
