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

export type HandleOrbitSelect = (index: number, appProps: AppProps) => any

const nullFn = () => null

export function List(rawProps: ListProps) {
  const { getShareMenuItemProps } = useShareMenu()
  const extraProps = useContext(ListPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
  const { items, onOpen, placeholder, getItemProps, query, shareable, ...restProps } = props
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
    return shortcutStore.onShortcut(shortcut => {
      if (visibility.getVisible() == false) {
        return
      }
      const selectableStore = selectableStoreRef.current
      console.log('down down', selectableStore)
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
          selectableStore && selectableStore.move(Direction.up)
          break
        case 'down':
          selectableStore && selectableStore.move(Direction.down)
          break
      }
    })
  }, [onOpen, shortcutStore, shortcutStore, selectableStoreRef, visibility])

  const onSelectInner = useCallback(
    (selectedRows, selectedIndices) => {
      console.log('selceting an imte', selectedRows, onSelectItem)
      if (shareable) {
        spaceStore.currentSelection = selectedRows
      }
      if (onSelectItem) {
        const appProps = getAppProps(toListItemProps(selectedRows[0]))
        onSelectItem(selectedIndices[0], appProps)
      }
      if (props.onSelect) {
        props.onSelect(selectedRows)
      }
    },
    [props.onSelect, shareable, onSelectItem],
  )

  const getItemPropsInner = useCallback((a, b, c) => {
    // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
    const normalized = toListItemProps(a)
    const itemExtraProps = getItemPropsGet()(a, b, c)
    const filterExtraProps = filteredGetItemPropsGet()(a, b, c)
    const shareProps = props.shareable && getShareMenuItemProps(a, b, c)
    return { ...normalized, ...itemExtraProps, ...filterExtraProps, ...shareProps }
  }, [])

  const onOpenInner = useCallback(
    index => {
      const appProps = getAppProps(toListItemProps(getItems()[index]))
      if (onOpen) {
        onOpen(index, appProps)
      }
      if (onOpenItem) {
        onOpenItem(index, appProps)
      }
    },
    [onOpen, onOpenItem],
  )

  const hasItems = !!filtered.results.length

  return (
    <HighlightActiveQuery query={query}>
      {hasItems && (
        <VirtualList
          disableMeasure={visibility.getVisible() === false}
          items={filtered.results}
          ItemView={ListItem}
          {...restProps}
          getItemProps={getItemPropsInner}
          onOpen={onOpenInner}
          onSelect={onSelectInner}
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
