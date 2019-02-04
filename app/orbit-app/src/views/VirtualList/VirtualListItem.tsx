import * as React from 'react'
import { SortableElement } from 'react-sortable-hoc'
import { GenericComponent } from '../../types'
import ListItem, { ListItemProps } from '../ListItems/ListItem'

export type VirtualListItemProps<Item> = ListItemProps & {
  ItemView?: GenericComponent<any>
  item?: Item
  query?: string
  style?: Object
  width?: number
  realIndex?: number
  index: number
}

class VirtualListItemInner extends React.PureComponent<VirtualListItemProps<any>> {
  render() {
    const { realIndex, ItemView, ...rest } = this.props
    const View = ItemView || ListItem
    return <View index={realIndex} {...rest} />
  }
}

export default SortableElement(VirtualListItemInner)

// export default memo(function VirtualListItem(props: VirtualListItemProps<any>) {
//   return <SortableVirtualListItem {...props} />
// }, isEqualDeep)
