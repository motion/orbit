import * as React from 'react'
import OrbitListItem from '../ListItems/OrbitListItem'
import { SortableElement } from 'react-sortable-hoc'
import { renderHighlightedText } from './renderHighlightedText'
import { OrbitItemProps } from '../ListItems/OrbitItemProps'
import { ResolvableModel } from '../../sources/types'

export type ListItemProps = Partial<OrbitItemProps<ResolvableModel>> & {
  query?: string
  style?: Object
  width?: number
  realIndex: number
  ignoreSelection?: boolean
}

const spaceBetween = <div style={{ flex: 1 }} />

export class ListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { realIndex, style, ...rest } = this.props
    return (
      <OrbitListItem
        index={realIndex}
        subtitleSpaceBetween={spaceBetween}
        renderText={renderHighlightedText}
        {...rest}
      />
    )
  }
}

export const VirtualListItem = SortableElement(ListItem)
