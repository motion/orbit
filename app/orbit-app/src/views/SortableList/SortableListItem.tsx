import * as React from 'react'
import { OrbitListItem } from '../OrbitListItem'
import { handleClickLocation } from '../../helpers/handleClickLocation'
import { Bit } from '@mcro/models'
import { SortableElement } from 'react-sortable-hoc'
import { renderHighlightedText } from './renderHighlightedText'

type ListItemProps = {
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
    const { model, realIndex, query, ignoreSelection, ...props } = this.props
    return (
      <OrbitListItem
        // pane="docked-search"
        // subPane="search"
        model={model}
        index={realIndex}
        subtitleSpaceBetween={spaceBetween}
        isExpanded
        searchTerm={query}
        onClickLocation={handleClickLocation}
        overflow="hidden"
        extraProps={{
          condensed: true,
          preventSelect: true,
        }}
        renderText={renderHighlightedText}
        ignoreSelection={ignoreSelection}
        {...props}
      />
    )
  }
}

export const SortableListItem = SortableElement(ListItem)
