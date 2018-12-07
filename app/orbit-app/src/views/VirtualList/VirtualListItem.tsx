import * as React from 'react'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { handleClickLocation } from '../../helpers/handleClickLocation'
import { SortableElement } from 'react-sortable-hoc'
import { renderHighlightedText } from './renderHighlightedText'
import { OrbitItemProps } from '../ListItems/OrbitItemProps'
import { normalizeItem } from '../../helpers/normalizeItem'
import { ResolvableModel } from '../../sources/types'
import { getNormalPropsForListItem } from '../ListItems/ListItemNormalize'

export type ListItemProps = Partial<OrbitItemProps<ResolvableModel>> & {
  model: ResolvableModel
  query?: string
  style?: Object
  cache?: any
  parent?: any
  width?: number
  realIndex: number
  ignoreSelection?: boolean
}

const spaceBetween = <div style={{ flex: 1 }} />

export class ListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { model, realIndex, query, ignoreSelection, ...itemProps } = this.props
    const normalizedItem = normalizeItem(model)
    return (
      <OrbitListItem
        index={realIndex}
        subtitleSpaceBetween={spaceBetween}
        searchTerm={query}
        onClickLocation={handleClickLocation}
        renderText={renderHighlightedText}
        ignoreSelection={ignoreSelection}
        {...itemProps}
        {...getNormalPropsForListItem(normalizedItem)}
      />
    )
  }
}

export const VirtualListItem = SortableElement(ListItem)
