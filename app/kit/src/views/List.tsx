import { Bit, PersonBit } from '@mcro/models'
import {
  Center,
  Direction,
  MergeContext,
  ProvideSelectionStore,
  SelectableList,
  SelectableListProps,
  SubTitle,
  Text,
  useSelectionStore,
  View,
} from '@mcro/ui'
import { useStoreDebug } from '@mcro/use-store'
import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { getAppConfig } from '../helpers/getAppConfig'
import { useStoresSimple } from '../helpers/useStores'
import { useIsAppActive } from '../hooks/useIsAppActive'
import { Omit } from '../types'
import { AppConfig } from '../types/AppConfig'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { ListItem, OrbitListItemProps } from './ListItem'

export type SearchableItem = Bit | PersonBit

export type Item = SearchableItem | OrbitListItemProps

export function toListItemProps(props: any): OrbitListItemProps {
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
  items?: Item[]
  onSelect?: HandleOrbitSelect
  onOpen?: HandleOrbitSelect
  query?: string
  placeholder?: React.ReactNode
}

export function List(props: ListProps) {
  useStoreDebug()

  const { shortcutStore } = useStoresSimple()
  const { items } = props
  const isRowLoaded = useCallback(x => x.index < items.length, [items])
  const isActive = useIsAppActive()
  const selectableProps = useContext(SelectionContext)

  // !TODO
  // @ts-ignore
  const selectionStore = useSelectionStore({ ...props, isActive })

  useEffect(() => {
    return shortcutStore.onShortcut(shortcut => {
      if (!selectionStore.isActive) {
        return false
      }
      switch (shortcut) {
        case 'open':
          if (props.onOpen) {
            props.onOpen(selectionStore.activeIndex, null)
          }
          break
        case 'up':
        case 'down':
          selectionStore.move(Direction[shortcut])
          break
      }
    })
  }, [])

  const getItemProps = useCallback(
    (item, index, items) => {
      // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
      const normalized = toListItemProps(item)
      const extraProps = (props.getItemProps && props.getItemProps(item, index, items)) || null
      return { ...normalized, ...extraProps }
    },
    [props],
  )
  const onSelect = useCallback(
    (index, eventType) => {
      const appConfig = getAppConfig(toListItemProps(items[index]))
      if (props.onSelect) {
        props.onSelect(index, appConfig, eventType)
      }
      if (selectionStore) {
        selectionStore.toggleSelected(index, eventType)
      }
      if (selectableProps && selectableProps.onSelectItem) {
        selectableProps.onSelectItem(index, appConfig, eventType)
      }
    },
    [props, selectableProps],
  )
  const onOpen = useCallback(
    (index, eventType) => {
      const appConfig = getAppConfig(toListItemProps(items[index]))
      if (props.onOpen) {
        props.onOpen(index, appConfig)
      }
      if (selectableProps && selectableProps.onOpenItem) {
        selectableProps.onOpenItem(index, appConfig, eventType)
      }
    },
    [props, selectableProps],
  )

  const hasItems = !!props.items.length

  return (
    <ProvideSelectionStore selectionStore={selectionStore}>
      <HighlightActiveQuery>
        {hasItems && (
          <SelectableList
            allowMeasure={isActive}
            items={items}
            ItemView={ListItem}
            isRowLoaded={isRowLoaded}
            {...props}
            getItemProps={getItemProps}
            onSelect={onSelect}
            onOpen={onOpen}
          />
        )}
        {!hasItems &&
          (props.placeholder || (
            <View flex={1} minHeight={200} position="relative">
              <Center alignItems="center">
                <View>
                  <SubTitle>No results</SubTitle>
                  {!!props.query && (
                    <Text ellipse size={0.95} alpha={0.6}>
                      "{props.query}"
                    </Text>
                  )}
                </View>
              </Center>
            </View>
          ))}
      </HighlightActiveQuery>
    </ProvideSelectionStore>
  )
}
