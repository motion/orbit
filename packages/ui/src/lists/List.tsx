import { isDefined, selectDefined } from '@o/utils'
import { pick } from 'lodash'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { HotKeys, HotKeysProps } from 'react-hotkeys'

import { Button } from '../buttons/Button'
import { Center } from '../Center'
import { splitCollapseProps } from '../Collapsable'
import { createContextualProps } from '../helpers/createContextualProps'
import { useFilter, UseFilterProps } from '../hooks/useFilter'
import { useGet, useGetFn } from '../hooks/useGet'
import { Section, SectionSpecificProps } from '../Section'
import { useShareStore } from '../Share'
import { useShortcutStore } from '../Shortcut'
import { Sizes } from '../Space'
import { HighlightProvide } from '../text/HighlightText'
import { SubTitle } from '../text/SubTitle'
import { Text } from '../text/Text'
import { Omit } from '../types'
import { View } from '../View/View'
import { useVisibility } from '../Visibility'
import { ListItem, ListItemProps } from './ListItem'
import { HandleSelection, ListItemSimpleProps } from './ListItemSimple'
import { Direction, selectablePropKeys, SelectableProps, useSelectableStore } from './SelectableStore'
import { VirtualList, VirtualListProps } from './VirtualList'

// TODO round out, we can likely import models
type BitLike = {
  title?: string
  body?: string
  [key: string]: any
}

export type ListProps = SectionSpecificProps &
  /** Override the onOpen/onSelect */
  Omit<VirtualListProps<BitLike | ListItemProps>, 'onOpen' | 'onSelect'> &
  Omit<Partial<UseFilterProps<any>>, 'items'> & {
    /** Make list expand to parent height */
    flex?: number

    /** Callback on selection change with an array of rows */
    onSelect?: (rows: any[], indices: number[]) => any

    /** Callback on double-click or keyboard enter, with array of rows */
    onOpen?: (rows: any[], indices: number[]) => any

    /** Item to show when list has no elements passed in */
    placeholder?: React.ReactNode

    /** On selection, automatically update Share with selection */
    shareable?: boolean | string

    /** Shows a delete action next to item, calls onDelete when pressed */
    deletable?: boolean

    /** Called on pressing delete action */
    onDelete?: (row: any, index: number) => any

    /** Allows double click on title to edit, calls onEdit when user hits "enter" or clicks away */
    editable?: boolean

    /** Called on when `editable` and after editing a title */
    onEdit?: (item: any, nextTitle: string) => any

    /** Adds padding */
    pad?: Sizes
  }

export function toListItemProps(props?: any): ListItemSimpleProps & { item?: any } {
  if (!props) {
    return null
  }
  if (props.target) {
    return { item: props }
  }
  return props
}

const Context = createContextualProps<ListProps>()
export const ListPassProps = Context.PassProps
export const useListProps = Context.useProps

export type HandleOrbitSelect = (index: number, extraData: any) => any

const nullFn = () => null

export const List = memo((allProps: ListProps) => {
  const [collapseProps, allListProps] = splitCollapseProps(allProps)
  const props = useListProps(allListProps)
  const {
    flex = 1,
    titleBorder = true,
    bordered,
    title,
    subTitle,
    icon,
    beforeTitle,
    afterTitle,
    backgrounded,
    elevation,
    titleScale = 0.9,
    ...listProps
  } = props
  const getProps = useGet(props)
  const {
    items,
    onOpen,
    placeholder,
    getItemProps,
    query: search,
    shareable,
    deletable,
    onDelete,
    editable,
    onEdit,
    onSelect: _ignoreOnSelect,
    padding,
    ...restProps
  } = listProps
  const shareStore = useShareStore()
  const shortcutStore = useShortcutStore()
  const getItemPropsGet = useGet(getItemProps || nullFn)
  const visibility = useVisibility()
  const getVisibility = useGet(visibility)
  const filtered = useFilter(props as any)
  const filteredGetItemProps = useGetFn(filtered.getItemProps || nullFn)
  const getItems = useGet(filtered.results)
  const selection = useRef<[any[], number[]]>([[], []])

  const onSelectInner: SelectableProps['onSelect'] = useCallback(
    (selectedRows: any[], selectedIndices: number[]) => {
      selection.current = [selectedRows, selectedIndices]

      if (shareable) {
        shareStore.setSelected(shareable, selectedRows)
      }
      const onSelect = getProps().onSelect
      if (onSelect) {
        onSelect(selectedRows, selectedIndices)
      }
    },
    [shareable],
  )

  // wrap select with extra functionality
  const selectableStore = useSelectableStore({
    ...pick(props, selectablePropKeys),
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
          if (onOpen) {
            onOpen(...selection.current)
          }
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

  const getItemPropsRaw: VirtualListProps['getItemProps'] = (a, b, c) => {
    // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
    const normalized = toListItemProps(a)
    const itemExtraProps = getItemPropsGet()(normalized, b, c)
    const filterExtraProps = filteredGetItemProps(a, b, c)
    const deleteProps: ListItemProps = deletable
      ? {
          after: (
            <>
              {itemExtraProps && itemExtraProps.after}
              <Button
                chromeless
                circular
                icon="cross"
                opacity={0.65}
                onMouseDown={e => {
                  e.stopPropagation()
                }}
                onClick={() => {
                  if (window.confirm(`Are you sure you'd like to delete?`)) {
                    onDelete(a, b)
                  }
                }}
              />
            </>
          ),
        }
      : null

    const onEditCb = useCallback(title => onEdit(a, title), [onEdit])

    const itemProps = {
      editable,
      onEdit: onEdit ? onEditCb : undefined,
      ...normalized,
      ...itemExtraProps,
      ...filterExtraProps,
      ...deleteProps,
    }
    return itemProps
  }
  const getItemPropsInner = useCallback(getItemPropsRaw, [deletable, editable, onEdit])

  const onOpenInner: HandleSelection = useCallback(
    index => {
      if (onOpen) {
        onOpen([getItems()[index]], [index])
      }
    },
    [onOpen],
  )

  const noQuery = typeof search === 'undefined' || search.length === 0
  const hasResults = !!filtered.results.length
  const showPlaceholder = noQuery && !hasResults
  const hasSectionProps = isDefined(title, subTitle, bordered, icon, beforeTitle, afterTitle)

  const words = useMemo(() => (props.query ? props.query.split(' ') : []), [props.query])
  const highlightValue = useMemo(
    () => ({
      words,
      maxChars: 500,
      maxSurroundChars: 80,
    }),
    [words],
  )

  const children = (
    <HighlightProvide value={highlightValue}>
      {hasResults && (
        <VirtualList
          items={filtered.results}
          ItemView={ListItem}
          {...restProps}
          getItemProps={getItemPropsInner}
          onOpen={onOpenInner}
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
      flex={selectDefined(flex, 1)}
      title={title}
      subTitle={subTitle}
      bordered={bordered}
      icon={icon}
      beforeTitle={beforeTitle}
      afterTitle={afterTitle}
      titleBorder={titleBorder}
      backgrounded={backgrounded}
      elevation={elevation}
      titleScale={titleScale}
      titlePadding
      padding={padding}
      {...collapseProps}
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
          {!!props.query && (
            <Text ellipse size={0.95} alpha={0.6}>
              "{props.query}"
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

export const ListShortcuts = memo(({ keyMap, handlers, ...props }: Partial<HotKeysProps>) => {
  const shortcutStore = useShortcutStore()

  const innerHandlers = useMemo(() => {
    const emit = key => {
      shortcutStore.emit(key)
    }
    return {
      up: () => emit('up'),
      down: () => emit('down'),
      ...handlers,
    }
  }, [handlers])

  return (
    <HotKeys
      keyMap={{
        down: 'down',
        up: 'up',
        ...keyMap,
      }}
      style={hotKeyStyle}
      handlers={innerHandlers}
      {...props}
    />
  )
})

const hotKeyStyle = {
  flex: 'inherit',
}
