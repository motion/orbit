import { SortableElement } from '@o/react-sortable-hoc'
import * as React from 'react'

import { rowItemCompare } from '../helpers/rowItemCompare'
import { GenericComponent } from '../types'
import { ListItem } from './ListItem'

export type VirtualListItemProps<Item> = {
  /** Used for key-mapping */
  id?: string
  key?: any

  /** Render the children in a custom way, used for media item types */
  ItemView?: GenericComponent<any>

  /** The item used for this view */
  item?: Item

  /** Extra styles */
  style?: Object

  /** Optionally set width of ListItem */
  width?: number

  /** Internal: used for virtualization */
  realIndex?: number

  /** Index of the ListItem */
  index: number
}

export class VirtualListItemInner extends React.Component<VirtualListItemProps<any>> {
  shouldComponentUpdate(prev) {
    return rowItemCompare(prev, this.props) === false
  }

  render() {
    const { realIndex, ItemView, ...rest } = this.props
    const View = ItemView || ListItem
    return <View index={realIndex} {...rest} />
  }
}

export const VirtualListItem = SortableElement(VirtualListItemInner)
