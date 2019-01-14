import * as React from 'react'
import ListItem from '../ListItems/ListItem'
import { SortableElement } from 'react-sortable-hoc'
import { renderHighlightedText } from './renderHighlightedText'
import { ListItemProps } from '../ListItems/ListItemProps'
import { ResolvableModel } from '../../sources/types'

export type VirtualListItemProps = Partial<ListItemProps<ResolvableModel>> & {
  query?: string
  style?: Object
  width?: number
  realIndex: number
  ignoreSelection?: boolean
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
