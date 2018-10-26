import * as React from 'react'
import { OrbitListItem } from '../OrbitListItem'
import { handleClickLocation } from '../../helpers/handleClickLocation'
import { renderListItemChildren } from './renderListItemChildren'
import { Bit } from '@mcro/models'
import { SortableElement } from 'react-sortable-hoc'
import { ItemProps } from '../OrbitItemProps'

type ListItemProps = {
  model: Bit
  query?: string
  style?: Object
  cache?: any
  parent?: any
  width?: number
  realIndex: number
  ignoreSelection?: boolean
  itemProps?: ItemProps<any>
}

const spaceBetween = <div style={{ flex: 1 }} />

const hideSlack = {
  title: true,
  people: true,
}

export class ListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { model, realIndex, query, ignoreSelection, itemProps } = this.props
    const isConversation = model.integration === 'slack'
    return (
      <OrbitListItem
        // pane="docked-search"
        // subPane="search"
        index={realIndex}
        model={model}
        hide={isConversation ? hideSlack : null}
        subtitleSpaceBetween={spaceBetween}
        isExpanded
        searchTerm={query}
        onClickLocation={handleClickLocation}
        maxHeight={isConversation ? 380 : 200}
        overflow="hidden"
        extraProps={{
          minimal: true,
          preventSelect: true,
        }}
        ignoreSelection={ignoreSelection}
        {...itemProps}
      >
        {renderListItemChildren}
      </OrbitListItem>
    )
  }
}

export const SortableListItem = SortableElement(ListItem)
