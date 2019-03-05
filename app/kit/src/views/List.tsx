import { Bit } from '@mcro/models'
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
  useMemoGetValue,
  useSelectionStore,
  View,
} from '@mcro/ui'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { getAppConfig } from '../helpers/getAppConfig'
import { useActiveQuery } from '../hooks/useActiveQuery'
import { useStoresSimple } from '../hooks/useStores'
import { Omit } from '../types'
import { AppConfig } from '../types/AppConfig'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { ListItem, OrbitListItemProps } from './ListItem'

export function toListItemProps(props?: any): OrbitListItemProps {
  if (!props) {
    return null
  }
  if (props.target) {
    return { item: props }
  }
  return props
}

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
  appConfig: AppConfig,
  eventType?: 'click' | 'key',
) => any)

export type ListProps = Omit<SelectableListProps, 'onSelect' | 'onOpen' | 'items'> & {
  isActive?: boolean
  query?: string
  items?: (Bit | OrbitListItemProps)[]
  onSelect?: HandleOrbitSelect
  onOpen?: HandleOrbitSelect
  placeholder?: React.ReactNode
}

const nullFn = () => null

export function List(rawProps: ListProps) {
  const { items, onSelect, onOpen, placeholder, getItemProps, query, ...props } = rawProps
  const { shortcutStore } = useStoresSimple()
  const isRowLoaded = useCallback(x => x.index < items.length, [items])
  const selectableProps = useContext(SelectionContext)
  const getItemPropsGetter = useMemoGetValue(getItemProps || nullFn)
  const getItems = useMemoGetValue(items)
  let selectionStore: SelectionStore | null = null
  const selectionStoreRef = useRef<SelectionStore | null>(null)

  useEffect(
    () => {
      return shortcutStore.onShortcut(shortcut => {
        if (selectionStore && !selectionStore.isActive) {
          return false
        }
        switch (shortcut) {
          case 'open':
            if (onOpen) {
              onOpen(selectionStore.activeIndex, null)
            }
            break
          case 'up':
          case 'down':
            selectionStore.move(Direction[shortcut])
            break
        }
      })
    },
    [onOpen],
  )

  // only update this on props.items change....
  // a bit risky but otherwise this is really  hard
  const getItemPropsInner = useCallback((item, index, items) => {
    // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
    const normalized = toListItemProps(item)
    const extraProps = getItemPropsGetter()(item, index, items)
    return { ...normalized, ...extraProps }
  }, [])

  const onSelectInner = useCallback(
    (index, eventType) => {
      const appConfig = getAppConfig(toListItemProps(getItems()[index]))
      if (onSelect) {
        onSelect(index, appConfig, eventType)
      }
      if (selectionStoreRef.current) {
        selectionStoreRef.current.setSelected(index, eventType)
      }
      if (selectableProps && selectableProps.onSelectItem) {
        selectableProps.onSelectItem(index, appConfig, eventType)
      }
    },
    [onSelect, selectableProps],
  )

  const onOpenInner = useCallback(
    (index, eventType) => {
      const appConfig = getAppConfig(toListItemProps(getItems()[index]))
      if (onOpen) {
        onOpen(index, appConfig)
      }
      if (selectableProps && selectableProps.onOpenItem) {
        selectableProps.onOpenItem(index, appConfig, eventType)
      }
    },
    [onOpen, selectableProps],
  )

  selectionStore = useSelectionStore(props)
  selectionStoreRef.current = selectionStore

  const hasItems = !!items.length

  return (
    <ProvideSelectionStore selectionStore={selectionStore}>
      <HighlightActiveQuery query={query}>
        {hasItems && (
          <SelectableList
            allowMeasure={props.isActive}
            items={items}
            ItemView={ListItem}
            isRowLoaded={isRowLoaded}
            {...props}
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
