import { isDefined, selectDefined } from '@o/utils'
import { pick } from 'lodash'
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { Center } from '../Center'
import { splitCollapseProps } from '../Collapsable'
import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { ProvideHighlight } from '../Highlight'
import { useFilter, UseFilterProps } from '../hooks/useFilter'
import { useGet, useGetFn } from '../hooks/useGet'
import { ListSeparator } from '../ListSeparator'
import { Section, SectionProps, SectionSpecificProps } from '../Section'
import { useShareStore } from '../Share'
import { useShortcutStore } from '../Shortcut'
import { SubTitle } from '../text/SubTitle'
import { Text } from '../text/Text'
import { View } from '../View/View'
import { useVisibility } from '../Visibility'
import { ListItem } from './ListItem'
import { HandleSelection, ListItemProps, ListItemSimpleProps } from './ListItemViewProps'
import { PropsContext, useListProps } from './ListPropsContext'
import {
  Direction,
  selectablePropKeys,
  SelectableProps,
  SelectableStore,
  SelectableStoreProvider,
  useCreateSelectableStore,
} from './SelectableStore'
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

    /** Padding */
    padding?: SectionProps['padding']

    /** Callback on selection change with an array of rows */
    onSelect?: (rows: any[], indices: number[]) => any

    /** Callback on double-click or keyboard enter, with array of rows */
    onOpen?: (rows: any[], indices: number[]) => any

    /** Item to show when list has no elements passed in */
    placeholder?: React.ReactNode

    /** Change the default placeholders text */
    placeholderText?: string

    /** On selection, automatically update Share with selection */
    shareable?: boolean | string

    /** Called on pressing delete action */
    onDelete?: (row: any, index: number) => any

    /** Called on when `editable` and after editing a title */
    onEdit?: (item: any, nextTitle: string) => any
  }

function toListItemProps(props?: any): ListItemSimpleProps & { item?: any } {
  if (!props) {
    return null
  }
  if (props.target) {
    return { item: props }
  }
  return props
}

const nullFn = () => null

export const List = memoIsEqualDeep(
  forwardRef<SelectableStore, ListProps>((allProps, ref) => {
    const [collapseProps, allListProps] = splitCollapseProps(allProps)
    const { onSelect: extraOnSelect, itemProps: extraItemProps } =
      useContext(PropsContext.Context) || ({} as ListProps)
    const props = useListProps(allListProps)
    const getProps = useGet(props)
    const {
      // split out props for section + other areas
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
      items,
      onOpen,
      placeholder,
      getItemProps,
      query: search,
      shareable,
      onEdit,
      onSelect: _ignoreOnSelect,
      padding,
      droppable,
      onDrop,
      onDelete,
      Separator = ListSeparator,
      separatorProps,
      itemProps,
      ...restProps
    } = props
    const shareStore = useShareStore()
    const shortcutStore = useShortcutStore()
    const getItemPropsGet = useGet(getItemProps || nullFn)
    const visibility = useVisibility()
    const getVisibility = useGet(visibility)
    const filtered = useFilter(props)
    const filteredGetItemProps = useGetFn(filtered.getItemProps || (nullFn as any))
    const getItems = useGet(filtered.results)
    const getShareable = useGet(shareable)
    const selection = useRef<[any[], number[]]>([[], []])
    const finalItemProps = useMemo(() => ({ ...itemProps, ...extraItemProps }), [
      itemProps,
      extraItemProps,
    ])

    const onSelectInner: SelectableProps['onSelect'] = useCallback(
      (selectedRows: any[], selectedIndices: number[]) => {
        selection.current = [selectedRows, selectedIndices]
        if (getShareable()) {
          shareStore.setSelected(getShareable(), selectedRows)
        }
        const onSelect = getProps().onSelect
        if (onSelect) {
          onSelect(selectedRows, selectedIndices)
        }
        if (extraOnSelect) {
          extraOnSelect(selectedRows, selectedIndices)
        }
      },
      [],
    )

    // wrap select with extra functionality
    const selectableStore = useCreateSelectableStore({
      ...pick(props, selectablePropKeys),
      items: filtered.results,
      onSelect: onSelectInner,
    })

    useImperativeHandle(ref, () => selectableStore, [])

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

    /**
     * We control some of the item props
     */
    const getItemPropsRaw: VirtualListProps['getItemProps'] = (item, index, c) => {
      // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
      const normalized = toListItemProps(item)
      const itemExtraProps = getItemPropsGet()(item, index, c)
      const filterExtraProps = filteredGetItemProps(item, index, c)
      const itemProps = {
        onDelete: onDelete ? () => onDelete(item, index) : undefined,
        onEdit: onEdit ? title => onEdit(item, title) : undefined,
        ...normalized,
        ...itemExtraProps,
        // @ts-ignore
        ...filterExtraProps,
      }
      return itemProps
    }
    const getItemPropsInner = useCallback(getItemPropsRaw, [onEdit, onDelete])

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

    let children = (
      <SelectableStoreProvider value={selectableStore}>
        {hasResults && (
          <VirtualList
            items={filtered.results}
            ItemView={ListItem}
            Separator={Separator}
            {...restProps}
            itemProps={finalItemProps}
            getItemProps={getItemPropsInner}
            onOpen={onOpenInner}
            selectableStore={selectableStore}
            separatorProps={separatorProps}
          />
        )}
        {showPlaceholder && (placeholder || <ListPlaceholder {...allProps} />)}
        <style
          dangerouslySetInnerHTML={{
            __html: `
.selectable-mouse-down * {
  user-select: none !important;
}

            `,
          }}
        />
      </SelectableStoreProvider>
    )

    // highlighting if its defined
    if (isDefined(props.query)) {
      children = (
        <ProvideHighlight
          {...useMemo(
            () => ({
              query: props.query || '',
              maxChars: 500,
              maxSurroundChars: 80,
            }),
            [props.query],
          )}
        >
          {children}
        </ProvideHighlight>
      )
    }

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
        droppable={droppable}
        onDrop={onDrop as any}
        {...collapseProps}
      >
        {children}
      </Section>
    )
  }),
  {
    simpleCompareKeys: {
      items: true,
    },
  },
)

List.defaultProps = {
  searchable: true,
}

function ListPlaceholder(props: ListProps) {
  return (
    <View flex={1} minHeight={200} position="relative">
      <Center alignItems="center">
        <View>
          <SubTitle>{props.placeholderText || 'No results'}</SubTitle>
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
