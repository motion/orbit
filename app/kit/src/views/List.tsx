import { CSSPropertySet } from '@o/css'
import { Bit } from '@o/models'
import {
  Center,
  createContextualProps,
  Direction,
  Searchable,
  Section,
  SectionSpecificProps,
  SelectableStore,
  SubTitle,
  Text,
  useGet,
  useVisiblity,
  View,
  VirtualList,
  VirtualListProps,
} from '@o/ui'
import { isAnyDefined, mergeDefined } from '@o/utils'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { getAppProps } from '../helpers/getAppProps'
import { useActiveQuery } from '../hooks/useActiveQuery'
import { useActiveQueryFilter } from '../hooks/useActiveQueryFilter'
import { UseFilterProps } from '../hooks/useFilteredList'
import { useStoresSimple } from '../hooks/useStores'
import { AppProps } from '../types/AppProps'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { ListItem, OrbitListItemProps } from './ListItem'

export type ListProps = SectionSpecificProps &
  VirtualListProps<Bit | OrbitListItemProps> &
  Partial<UseFilterProps<any>> & {
    isActive?: boolean
    search?: string
    onSelect?: HandleOrbitSelect
    onOpen?: HandleOrbitSelect
    placeholder?: React.ReactNode
    shareable?: boolean
    flex?: CSSPropertySet['flex']
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

export function SearchableList(props: ListProps) {
  return (
    <Searchable>
      {({ searchBar, searchTerm }) => (
        <>
          <View pad={props.padInner || 'sm'}>{searchBar}</View>
          <List {...props} search={searchTerm} />
        </>
      )}
    </Searchable>
  )
}

export function List({
  flex = 1,
  titleBorder = true,
  bordered,
  title,
  subTitle,
  icon,
  beforeTitle,
  afterTitle,
  ...listProps
}: ListProps) {
  // const { getShareMenuItemProps } = useShareMenu()
  const extraProps = useContext(ListPropsContext)
  const props = extraProps ? mergeDefined(extraProps, listProps) : listProps
  const getProps = useGet(props)
  const { items, onOpen, placeholder, getItemProps, search, shareable, ...restProps } = props
  const internalRef = useRef<SelectableStore>(null)
  const selectableStoreRef = listProps.selectableStoreRef || internalRef
  const { shortcutStore, spaceStore } = useStoresSimple()
  const { onOpenItem, onSelectItem } = useProps({})
  const getItemPropsGet = useGet(getItemProps || nullFn)
  const visibility = useVisiblity()
  const getVisibility = useGet(visibility)
  const filtered = useActiveQueryFilter({
    searchable: props.searchable,
    items: items || [],
    sortBy: props.sortBy,
    search: props.search,
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
      if (getVisibility() == false) {
        return
      }
      const selectableStore = selectableStoreRef.current
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
      if (shareable) {
        spaceStore.currentSelection = selectedRows
      }
      if (onSelectItem) {
        const appProps = getAppProps(toListItemProps(selectedRows[0]))
        onSelectItem(selectedIndices[0], appProps)
      }
      const onSelect = getProps().onSelect
      if (onSelect) {
        onSelect(selectedRows)
      }
    },
    [shareable, onSelectItem],
  )

  const getItemPropsInner = useCallback((a, b, c) => {
    // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
    const normalized = toListItemProps(a)
    const itemExtraProps = getItemPropsGet()(a, b, c)
    const filterExtraProps = filteredGetItemPropsGet()(a, b, c)
    // const shareProps = props.shareable && getShareMenuItemProps(a, b, c)
    return { ...normalized, ...itemExtraProps, ...filterExtraProps }
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

  const noQuery = typeof search === 'undefined' || search.length === 0
  const hasResults = !!filtered.results.length
  const showPlaceholder = noQuery && !hasResults

  const hasSectionProps = isAnyDefined(
    title,
    subTitle,
    bordered,
    icon,
    beforeTitle,
    afterTitle,
    titleBorder,
  )

  const children = (
    <HighlightActiveQuery query={search}>
      {hasResults && (
        <VirtualList
          disableMeasure={visibility === false}
          items={filtered.results}
          ItemView={ListItem}
          {...restProps}
          getItemProps={getItemPropsInner}
          onOpen={onOpenInner}
          onSelect={onSelectInner}
          selectableStoreRef={selectableStoreRef}
        />
      )}
      {showPlaceholder && (placeholder || <ListPlaceholder />)}
    </HighlightActiveQuery>
  )

  if (!hasSectionProps) {
    return children
  }

  return (
    <Section
      background="transparent"
      flex={flex || 1}
      title={title}
      subTitle={subTitle}
      bordered={bordered}
      icon={icon}
      beforeTitle={beforeTitle}
      afterTitle={afterTitle}
      titleBorder={titleBorder}
    >
      {children}
    </Section>
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

List.accepts = {
  surfaceProps: true,
}
