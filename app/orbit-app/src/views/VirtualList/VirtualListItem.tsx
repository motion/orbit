import * as React from 'react'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { SortableElement } from 'react-sortable-hoc'
import { renderHighlightedText } from './renderHighlightedText'
import { OrbitItemProps } from '../ListItems/OrbitItemProps'
import { normalizeItem } from '../../helpers/normalizeItem'
import { ResolvableModel } from '../../sources/types'
import { getNormalPropsForListItem } from '../ListItems/ListItemNormalize'

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
    const normalizedItem = normalizeItem(rest)
    return (
      <OrbitListItem
        index={realIndex}
        subtitleSpaceBetween={spaceBetween}
        renderText={renderHighlightedText}
        {...getNormalPropsForListItem(normalizedItem)}
        {...rest}
      />
    )
  }
}

export const VirtualListItem = SortableElement(ListItem)
