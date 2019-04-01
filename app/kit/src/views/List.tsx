import { Bit } from '@o/models'
import {
  Center,
  createContextualProps,
  Direction,
  SelectableStore,
  SubTitle,
  Text,
  useGet,
  useVisiblityContext,
  View,
  VirtualList,
  VirtualListProps,
} from '@o/ui'
import { mergeDefined } from '@o/utils'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { getAppProps } from '../helpers/getAppProps'
import { useActiveQuery } from '../hooks/useActiveQuery'
import { useActiveQueryFilter } from '../hooks/useActiveQueryFilter'
import { UseFilterProps } from '../hooks/useFilteredList'
import { useShareMenu } from '../hooks/useShareMenu'
import { useStoresSimple } from '../hooks/useStores'
import { Omit } from '../types'
import { AppProps } from '../types/AppProps'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { ListItem, OrbitListItemProps } from './ListItem'

export type ListProps = Omit<VirtualListProps<Bit | OrbitListItemProps>, 'selectableStoreRef'> &
  Partial<UseFilterProps<any>> & {
    isActive?: boolean
    query?: string
    onSelect?: HandleOrbitSelect
    onOpen?: HandleOrbitSelect
    placeholder?: React.ReactNode
    searchable?: boolean
    shareable?: boolean
  }

// TODO use creaetPropsContext
export const ListPropsContext = createContext(null as Partial<ListProps>)

export function toListItemProps(props?: any): OrbitListItemProps {
  if (!props) {
    return null
  }
  if (props.target) {
    return { item: props }
  }
  return props
}

// extra props if we need to hook into select events
const { PassProps, useProps } = createContextualProps<{
  onSelectItem?: HandleOrbitSelect
  onOpenItem?: HandleOrbitSelect
}>()
export const PassExtraListProps = PassProps

export type HandleOrbitSelect = (
  index: number,
  appProps: AppProps,
  eventType?: 'click' | 'key',
) => any

const nullFn = () => null

export function List(rawProps: ListProps) {
  const { getShareMenuItemProps } = useShareMenu()
  const extraProps = useContext(ListPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
  const {
    items,
    onSelect,
    onOpen,
    placeholder,
    getItemProps,
    query,
    shareable,
    ...restProps
  } = props
  const selectableStoreRef = useRef<SelectableStore>(null)
  const { shortcutStore, spaceStore } = useStoresSimple()
  const { onOpenItem, onSelectItem } = useProps({})
  const getItemPropsGet = useGet(getItemProps || nullFn)
  const visibility = useVisiblityContext()
  const filtered = useActiveQueryFilter({
    searchable: props.searchable,
    items: items || [],
    sortBy: props.sortBy,
    query: props.query,
    filterKey: props.filterKey,
    removePrefix: props.removePrefix,
    groupByLetter: props.groupByLetter,
    groupMinimum: props.groupMinimum,
  })
  const filteredGetItemPropsGet = useGet(filtered.getItemProps || nullFn)
  const getItems = useGet(filtered.results)

  useEffect(() => {
    if (!shortcutStore) return
    const selectableStore = selectableStoreRef.current
    if (!selectableStore) return
    return shortcutStore.onShortcut(shortcut => {
      console.log('down down', selectableStore)
      if (visibility.visible == false) {
        return
      }
      switch (shortcut) {
        case 'open':
          console.log('todo open', selectableStore.active)
          // const item = getItems()[]
          // if (item && item.onOpen) {
          //   console.log('TODO open')
          //   // item.onOpen(selStore.activeIndex, null)
          // }
          // if (onOpen) {
          //   console.log('TODO open')
          //   // onOpen(selStore.activeIndex, null)
          // }
          break
        case 'up':
          selectableStore.move(Direction.up)
          break
        case 'down':
          selectableStore.move(Direction.down)
          break
      }
    })
  }, [onOpen, shortcutStore, shortcutStore, selectableStoreRef, visibility])

  const onSelectRows = useCallback(
    (selectedRows, keys) => {
      if (shareable) {
        spaceStore.currentSelection = selectedRows
      }
      if (props.onSelectRows) {
        props.onSelectRows(selectedRows, keys)
      }
    },
    [props.items, props.onSelectRows, shareable],
  )

  const getItemPropsInner = useCallback((a, b, c) => {
    // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
    const normalized = toListItemProps(a)
    const itemExtraProps = getItemPropsGet()(a, b, c)
    const filterExtraProps = filteredGetItemPropsGet()(a, b, c)
    const shareProps = props.shareable && getShareMenuItemProps(a, b, c)
    return { ...normalized, ...itemExtraProps, ...filterExtraProps, ...shareProps }
  }, [])

  const onSelectInner = useCallback(
    (index, eventType) => {
      const selectableStore = selectableStoreRef.current
      if (!selectableStore.rows) {
        selectableStore.setRows(getItems())
      }
      const item = getItems()[index]
      const appProps = getAppProps(toListItemProps(item))
      if (onSelect) {
        onSelect(index, appProps, eventType)
      }
      selectableStore.setActiveIndex(index)
      if (onSelectItem) {
        onSelectItem(index, appProps, eventType)
      }
    },
    [onSelect, onSelectItem],
  )

  const onOpenInner = useCallback(
    (index, eventType) => {
      const appProps = getAppProps(toListItemProps(getItems()[index]))
      if (onOpen) {
        onOpen(index, appProps)
      }
      if (onOpenItem) {
        onOpenItem(index, appProps, eventType)
      }
    },
    [onOpen, onOpenItem],
  )

  const hasItems = !!filtered.results.length

  return (
    <HighlightActiveQuery query={query}>
      {hasItems && (
        <VirtualList
          disableMeasure={visibility.visible === false}
          items={filtered.results}
          ItemView={ListItem}
          {...restProps}
          getItemProps={getItemPropsInner}
          onSelect={onSelectInner}
          onOpen={onOpenInner}
          onSelectRows={onSelectRows}
          selectableStoreRef={selectableStoreRef}
        />
      )}
      {!hasItems && (placeholder || <ListPlaceholder />)}
    </HighlightActiveQuery>
  )
}

function ListPlaceholder() {
  const query = useActiveQuery()
  return (
    <View flex={1} minHeight={200} position="relative">
      <Center alignItems="center">
        <View>
          <SubTitle>No results</SubTitle>
          {!!query && (
            <Text ellipse size={0.95} alpha={0.6}>
              "{query}"
            </Text>
          )}
        </View>
      </Center>
    </View>
  )
}
