import { SortableElement } from '@o/react-sortable-hoc'
import * as React from 'react'
import { shouldComponentUpdate } from 'react-window'
import { GenericComponent } from '../types'
import { ListItem, ListItemProps } from './ListItem'

export type VirtualListItemProps<Item> = ListItemProps & {
  //  for keymapper
  id?: string
  //  for keymapper
  key?: any
  ItemView?: GenericComponent<any>
  item?: Item
  query?: string
  style?: Object
  width?: number
  realIndex?: number
  index: number
}

export class VirtualListItemInner extends React.Component<VirtualListItemProps<any>> {
  shouldComponentUpdate = shouldComponentUpdate.bind(this)

  render() {
    const { realIndex, ItemView, ...rest } = this.props
    const View = ItemView || ListItem
    return <View index={realIndex} {...rest} />
  }
}

export const VirtualListItem = SortableElement(VirtualListItemInner)
