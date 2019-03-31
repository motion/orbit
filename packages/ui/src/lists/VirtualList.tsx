import { SortableContainer, SortableContainerProps } from '@o/react-sortable-hoc'
import { omit } from 'lodash'
import React, { createContext, RefObject, useCallback, useContext } from 'react'
import { Config } from '../helpers/configure'
import { useDefaultProps } from '../hooks/useDefaultProps'
import { useGet } from '../hooks/useGet'
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
    getItemProps?: (item: A, index: number, items: A[]) => Record<string, any> | null | false
  }

const SortableList = SortableContainer(DynamicList, { withRef: true })

export function VirtualList(rawProps: VirtualListProps<any>) {
  const defaultProps = useContext(VirtualListDefaultProps)
  const props = useDefaultProps(defaultProps, rawProps)
  const getProps = useGet(props)
  const dynamicListProps = omit(
    props,
    'ItemView',
    'onSelect',
    'onOpen',
    'sortable',
    'getItemProps',
    'items',
  )

  const keyMapper = useCallback(index => {
    const { items } = getProps()
    return Config.getItemKey(items[index], index)
  }, [])

  const getRow = useCallback(({ index, style }) => {
    const { ItemView, onSelect, sortable, items, getItemProps, onOpen } = getProps()
    const item = items[index]
    const key = Config.getItemKey(item, index)
    return (
      <VirtualListItem
        key={key}
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
        {...style}
      />
    )
  }, [])

  return (
    <SortableList
      itemCount={props.items.length}
      itemData={props.items}
      shouldCancelStart={isRightClick}
      keyMapper={keyMapper}
      lockAxis="y"
      {...dynamicListProps}
    >
      {getRow}
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
