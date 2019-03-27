import { Bit } from '@o/models'
import {
  Center,
  Direction,
  MergeContext,
  ProvideSelectionStore,
  SelectableList,
  SelectableListProps,
  SelectionStore,
  SubTitle,
  Text,
  useRefGetter,
  useSelectionStore,
  View,
} from '@o/ui'
import { mergeDefined } from '@o/utils'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { getAppProps } from '../helpers/getAppProps'
import { useActiveQuery } from '../hooks/useActiveQuery'
import { useActiveQueryFilter } from '../hooks/useActiveQueryFilter'
import { UseFilterProps } from '../hooks/useFilteredList'
import { useIsAppActive } from '../hooks/useIsAppActive'
import { useShareMenu } from '../hooks/useShareMenu'
import { useStoresSimple } from '../hooks/useStores'
import { Omit } from '../types'
import { AppProps } from '../types/AppProps'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { ListItem, OrbitListItemProps } from './ListItem'

export type ListProps = Omit<SelectableListProps, 'onSelect' | 'onOpen' | 'items'> &
  Partial<UseFilterProps<any>> & {
    isActive?: boolean
    query?: string
    items?: (Bit | OrbitListItemProps)[]
    onSelect?: HandleOrbitSelect
    onOpen?: HandleOrbitSelect
    placeholder?: React.ReactNode
    searchable?: boolean
    shareable?: boolean
  }

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

// technically, these are "non overridable", whereas the ListPropsContext is overrideable
// what we should do is make this a standard pattern with a nice utility for it in UI

type SelectionContextType = {
  onSelectItem?: HandleOrbitSelect
  onOpenItem?: HandleOrbitSelect
}
const SelectionContext = createContext({
  onSelectItem: (_a, _b) => console.log('no select event for onSelectItem'),
  onOpenItem: (_a, _b) => console.log('no select event for onOpenItem'),
} as SelectionContextType)
export function ProvideSelectionContext({
  children,
  ...rest
}: SelectionContextType & { children: any }) {
  return (
    <MergeContext Context={SelectionContext} value={rest}>
      {children}
    </MergeContext>
  )
}

export type HandleOrbitSelect = ((
  index: number,
  appProps: AppProps,
  eventType?: 'click' | 'key',
) => any)

const nullFn = () => null

export function List(rawProps: ListProps) {
  const { getShareMenuItemProps } = useShareMenu()
  const extraProps = useContext(ListPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
  const { items, onSelect, onOpen, placeholder, getItemProps, query, ...restProps } = props
  const { shortcutStore } = useStoresSimple()
  const isRowLoaded = useCallback(x => x.index < items.length, [items])
  const selectableProps = useContext(SelectionContext)
  const getItemPropsGet = useRefGetter(getItemProps || nullFn)
  const isActive = useIsAppActive()

  const selectionStore = useSelectionStore(restProps)
  const selectionStoreRef = useRef<SelectionStore | null>(null)
  selectionStoreRef.current = selectionStore

  const filtered = useActiveQueryFilter({
    searchable: props.searchable,
    items: props.items || [],
    sortBy: props.sortBy,
    query: props.query,
    filterKey: props.filterKey,
    removePrefix: props.removePrefix,
    groupByLetter: props.groupByLetter,
    groupMinimum: props.groupMinimum,
  })
  const filteredGetItemPropsGet = useRefGetter(filtered.getItemProps || nullFn)

  const getItems = useRefGetter(filtered.results)

  useEffect(
    () => {
      if (!shortcutStore) return
      return shortcutStore.onShortcut(shortcut => {
        const selStore = selectionStoreRef.current
        if (selStore && !selStore.isActive) {
          return false
        }
        switch (shortcut) {
          case 'open':
            const item = getItems()[selStore.activeIndex]
            if (item && item.onOpen) {
              item.onOpen(selStore.activeIndex, null)
            }
            if (onOpen) {
              onOpen(selStore.activeIndex, null)
            }
            break
          case 'up':
          case 'down':
            selStore.move(Direction[shortcut])
            break
        }
      })
    },
    [onOpen],
  )

  const getItemPropsInner = useCallback((a, b, c) => {
    // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
    const normalized = toListItemProps(a)
    const extraProps = getItemPropsGet()(a, b, c)
    const filterExtraProps = filteredGetItemPropsGet()(a, b, c)
    const shareProps = props.shareable && getShareMenuItemProps(a, b, c)
    return { ...normalized, ...extraProps, ...filterExtraProps, ...shareProps }
  }, [])

  const onSelectInner = useCallback(
    (index, eventType) => {
      const selStore = selectionStoreRef.current
      if (selStore && !selStore.isActive) {
        return false
      }
      const appProps = getAppProps(toListItemProps(getItems()[index]))
      if (onSelect) {
        onSelect(index, appProps, eventType)
      }
      if (selectionStoreRef.current) {
        selectionStoreRef.current.setSelected(index, eventType)
      }
      if (selectableProps && selectableProps.onSelectItem) {
        selectableProps.onSelectItem(index, appProps, eventType)
      }
    },
    [onSelect, selectableProps],
  )

  const onOpenInner = useCallback(
    (index, eventType) => {
      const appProps = getAppProps(toListItemProps(getItems()[index]))
      if (onOpen) {
        onOpen(index, appProps)
      }
      if (selectableProps && selectableProps.onOpenItem) {
        selectableProps.onOpenItem(index, appProps, eventType)
      }
    },
    [onOpen, selectableProps],
  )

  const hasItems = !!filtered.results.length

  return (
    <ProvideSelectionStore selectionStore={selectionStore}>
      <HighlightActiveQuery query={query}>
        {hasItems && (
          <SelectableList
            allowMeasure={typeof props.isActive === 'boolean' ? props.isActive : isActive}
            items={filtered.results}
            ItemView={ListItem}
            isRowLoaded={isRowLoaded}
            {...restProps}
            getItemProps={getItemPropsInner}
            onSelect={onSelectInner}
            onOpen={onOpenInner}
          />
        )}
        {!hasItems && (placeholder || <ListPlaceholder />)}
      </HighlightActiveQuery>
    </ProvideSelectionStore>
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
