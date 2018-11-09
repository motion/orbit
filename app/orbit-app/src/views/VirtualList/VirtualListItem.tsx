import * as React from 'react'
import { OrbitListItem } from '../OrbitListItem'
import { handleClickLocation } from '../../helpers/handleClickLocation'
import { Bit } from '@mcro/models'
import { SortableElement } from 'react-sortable-hoc'
import { renderHighlightedText } from './renderHighlightedText'
import { ItemProps } from '../OrbitItemProps'

export type ListItemProps = Partial<ItemProps<any>> & {
  model: Bit
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
    console.log('render list item...', itemProps)
    return (
      <OrbitListItem
        model={model}
        index={realIndex}
        subtitleSpaceBetween={spaceBetween}
        searchTerm={query}
        onClickLocation={handleClickLocation}
        overflow="hidden"
        extraProps={{
          condensed: true,
          preventSelect: true,
        }}
        renderText={renderHighlightedText}
        ignoreSelection={ignoreSelection}
        {...itemProps}
      />
    )
  }
}

export const VirtualListItem = SortableElement(ListItem)
