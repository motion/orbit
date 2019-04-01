import { Bit } from '@o/models'
import {
  Center,
  Direction,
  MergeContext,
  SelectableList,
  SelectableListProps,
  SubTitle,
  Text,
  useGet,
  useSelectableStore,
  useVisiblityContext,
  View,
} from '@o/ui'
import { mergeDefined } from '@o/utils'
import React, { createContext, useCallback, useContext, useEffect } from 'react'
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

// technically, these are "non overridable", whereas the ListPropsContext is overrideable
// what we should do is make this a standard pattern with a nice utility for it in UI

type SelectionContextType = {
  onSelectItem?: HandleOrbitSelect
  onOpenItem?: HandleOrbitSelect
}

const SelectionContext = createContext<SelectionContextType>({
  onSelectItem: () => console.log('no select event for onSelectItem'),
  onOpenItem: () => console.log('no select event for onOpenItem'),
})

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
  const { items, onSelect, onOpen, placeholder, getItemProps, query, ...restProps } = props
  const { shortcutStore } = useStoresSimple()
  const selectableProps = useContext(SelectionContext)
  const getItemPropsGet = useGet(getItemProps || nullFn)
  const isActive = useIsAppActive()
  const selectableStore = props.selectableStore || useSelectableStore(restProps)
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
  }, [onOpen])

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
      if (visibility.visible === false) {
        return
      }
      if (!selectableStore.rows) {
        selectableStore.setRows(getItems())
      }
      const item = getItems()[index]
      const appProps = getAppProps(toListItemProps(item))

      // TODO make this all `else if`, likely

      if (onSelect) {
        onSelect(index, appProps, eventType)
      }
      selectableStore.setActiveIndex(index)
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
  const isInactive = !(typeof props.isActive === 'boolean' ? props.isActive : isActive)

  return (
    <HighlightActiveQuery query={query}>
      {hasItems && (
        <SelectableList
          disableMeasure={isInactive}
          items={filtered.results}
          ItemView={ListItem}
          {...restProps}
          getItemProps={getItemPropsInner}
          onSelect={onSelectInner}
          onOpen={onOpenInner}
          selectableStore={selectableStore}
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
