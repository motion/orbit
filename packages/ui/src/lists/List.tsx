import { CSSPropertySet } from '@o/css'
import { Bit } from '@o/models'
import { isDefined, mergeDefined } from '@o/utils'
import React, { createContext, memo, useCallback, useContext, useEffect, useMemo } from 'react'

import { Center } from '../Center'
import { Config } from '../helpers/configure'
import { createContextualProps } from '../helpers/createContextualProps'
import { useFilter, UseFilterProps } from '../hooks/useFilter'
import { useGet, useGetFn } from '../hooks/useGet'
import { Section, SectionSpecificProps } from '../Section'
import { useShareStore } from '../Share'
import { useShortcutStore } from '../Shortcut'
import { HighlightProvide } from '../text/HighlightText'
import { SubTitle } from '../text/SubTitle'
import { Text } from '../text/Text'
import { View } from '../View/View'
import { useVisibility } from '../Visibility'
import { ListItem, ListItemProps } from './ListItem'
import { ListItemSimpleProps } from './ListItemSimple'
import { Direction, useSelectableStore } from './SelectableStore'
import { VirtualList, VirtualListProps } from './VirtualList'

export type ListProps = SectionSpecificProps &
  VirtualListProps<Bit | ListItemProps> &
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

export function toListItemProps(props?: any): ListItemSimpleProps & { item?: any } {
  if (!props) {
    return null
  }
  if (props.target) {
    return { item: props }
  }
  return props
}

// extra props if we need to hook into select events
type ListExtraProps = {
  onSelectItem?: HandleOrbitSelect
  onOpenItem?: HandleOrbitSelect
}
const listContextProps = createContextualProps<ListExtraProps>()
export const PassExtraListProps = listContextProps.PassProps
const useListExtraProps = listContextProps.useProps

export type HandleOrbitSelect = (index: number, extraData: any) => any

const nullFn = () => null

export const List = memo((allProps: ListProps) => {
  const {
    flex = 1,
    titleBorder = true,
    bordered,
    title,
    subTitle,
    icon,
    beforeTitle,
    afterTitle,
    ...listProps
  } = allProps
  // const { getShareMenuItemProps } = useShareMenu()
  const extraProps = useContext(ListPropsContext)
  const props = extraProps ? mergeDefined(extraProps, listProps) : listProps
  const getProps = useGet(props)
  const { items, onOpen, placeholder, getItemProps, search, shareable, ...restProps } = props
  const shareStore = useShareStore()
  const shortcutStore = useShortcutStore()
  const { onOpenItem, onSelectItem } = useListExtraProps({})
  const getItemPropsGet = useGet(getItemProps || nullFn)
  const visibility = useVisibility()
  const getVisibility = useGet(visibility)
  const filtered = useFilter({
    search: props.search,
    searchable: props.searchable,
    items: items || [],
    sortBy: props.sortBy,
    filterKey: props.filterKey,
    removePrefix: props.removePrefix,
    groupByLetter: props.groupByLetter,
    groupMinimum: props.groupMinimum,
  })
  const filteredGetItemProps = useGetFn(filtered.getItemProps || nullFn)
  const getItems = useGet(filtered.results)

  const onSelectInner = useCallback(
    (selectedRows, selectedIndices) => {
      if (shareable) {
        shareStore.setSelected(selectedRows)
      }
      if (onSelectItem) {
        const appProps = Config.propsToItem(toListItemProps(selectedRows[0]))
        onSelectItem(selectedIndices[0], appProps)
      }
      const onSelect = getProps().onSelect
      if (onSelect) {
        onSelect(selectedRows)
      }
    },
    [shareable, onSelectItem],
  )

  // wrap select with extra functionality
  const selectableStore = useSelectableStore({
    ...props,
    onSelect: onSelectInner,
  })

  useEffect(() => {
    if (!shortcutStore) return
    return shortcutStore.onShortcut(shortcut => {
      if (getVisibility() !== true) {
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
          selectableStore && selectableStore.move(Direction.up)
          break
        case 'down':
          selectableStore && selectableStore.move(Direction.down)
          break
      }
    })
  }, [onOpen, shortcutStore, shortcutStore, selectableStore])

  const getItemPropsInner = useCallback((a, b, c) => {
    // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
    const normalized = toListItemProps(a)
    const itemExtraProps = getItemPropsGet()(a, b, c)
    const filterExtraProps = filteredGetItemProps(a, b, c)
    // const shareProps = props.shareable && getShareMenuItemProps(a, b, c)
    return { ...normalized, ...itemExtraProps, ...filterExtraProps }
  }, [])

  const onOpenInner = useCallback(
    index => {
      const appProps = Config.propsToItem(toListItemProps(getItems()[index]))
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
  const hasSectionProps = isDefined(title, subTitle, bordered, icon, beforeTitle, afterTitle)

  const words = useMemo(() => (props.search ? props.search.split(' ') : []), [props.search])

  const children = (
    <HighlightProvide
      value={{
        words,
        maxChars: 500,
        maxSurroundChars: 80,
      }}
    >
      {hasResults && (
        <VirtualList
          disableMeasure={visibility === false}
          items={filtered.results}
          ItemView={ListItem}
          {...restProps}
          getItemProps={getItemPropsInner}
          onOpen={onOpenInner}
          onSelect={onSelectInner}
          selectableStore={selectableStore}
        />
      )}
      {showPlaceholder && (placeholder || <ListPlaceholder {...allProps} />)}
    </HighlightProvide>
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
})

function ListPlaceholder(props: ListProps) {
  return (
    <View flex={1} minHeight={200} position="relative">
      <Center alignItems="center">
        <View>
          <SubTitle>No results</SubTitle>
          {!!props.search && (
            <Text ellipse size={0.95} alpha={0.6}>
              "{props.search}"
            </Text>
          )}
        </View>
      </Center>
    </View>
  )
}

// @ts-ignore
List.accepts = {
  surfaceProps: true,
}
