import { SortableContainer, SortableContainerProps } from '@o/react-sortable-hoc'
import React, { createContext, RefObject, useContext } from 'react'
import { useDefaultProps } from '../hooks/useDefaultProps'
import { GenericComponent, Omit } from '../types'
import { DynamicList, DynamicListControlled, DynamicListProps } from './DynamicList'
import { HandleSelection } from './ListItem'
import { VirtualListItem, VirtualListItemProps } from './VirtualListItem'

export type VirtualListProps<A> = SortableContainerProps &
  Omit<DynamicListProps, 'children' | 'itemCount' | 'itemData'> & {
    onSelect?: HandleSelection
    onOpen?: HandleSelection
    itemProps?: Partial<VirtualListItemProps<any>>
    ItemView?: GenericComponent<VirtualListItemProps<any>>
    sortable?: boolean
    listRef?: RefObject<DynamicListControlled>
    items: A[]
    getItemProps?: GetItemProps<A> | null | false
  }

export type GetItemProps<A> = (
  item: A,
  index: number,
  items: A[],
) => Partial<VirtualListItemProps<A>> | null

const SortableList = SortableContainer(DynamicList, { withRef: true })

export function VirtualList(rawProps: VirtualListProps<any>) {
  const defaultProps = useContext(VirtualListDefaultProps)
  const props = useDefaultProps(defaultProps, rawProps)
  const { ItemView, onSelect, onOpen, sortable, getItemProps, items, ...dynamicListProps } = props

  return (
    <SortableList
      itemCount={items.length}
      itemData={items}
      shouldCancelStart={isRightClick}
      {...dynamicListProps}
    >
      {({ index, style }) => {
        const item = items[index]
        return (
          <VirtualListItem
            key={(item && (item.id || item.key)) || index}
            ItemView={ItemView}
            onSelect={onSelect}
            onOpen={onOpen}
            disabled={!sortable}
            {...itemProps(props, index)}
            {...itemProps}
            {...getItemProps && getItemProps(item, index, items)}
            {...item}
            index={index}
            realIndex={index}
            style={style}
          />
        )
      }}
    </SortableList>
  )
}

export const VirtualListDefaultProps = createContext<Partial<VirtualListProps<any>>>({})

const isRightClick = e =>
  (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
  (e.buttons === 2 && e.button === 2) // Regular mouse or macOS double-finger tap

const getSeparatorProps = ({ items }: VirtualListProps<any>, index: number) => {
  const model = items[index]
  if (!model || !model.group) {
    return null
  }
  if (index === 0 || model.group !== items[index - 1].group) {
    return { separator: `${model.group}` }
  }
  return null
}

const itemProps = (
  props: VirtualListProps<any>,
  index: number,
): Partial<VirtualListItemProps<any>> => {
  return getSeparatorProps(props, index)
}
