import { ensure, useReaction } from '@o/use-store'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { configure } from '../helpers/configure'
import { MergeContext } from '../helpers/MergeContext'
import { HandleSelection } from './ListItem'
import { SelectEvent, useSelectionStore } from './ProvideSelectionStore'
import { SelectionStore } from './SelectionStore'
import { VirtualList, VirtualListProps } from './VirtualList'

export type SelectableListProps = VirtualListProps<any> & {
  minSelected?: number
  defaultSelected?: number
  isSelectable?: boolean
  selectionStore?: SelectionStore
  createNewSelectionStore?: boolean
}

type SelectContext = {
  onSelectItem?: HandleSelection
  onOpenItem?: HandleSelection
}

const SelectableListContext = createContext({
  onSelectItem: (_a, _b) => console.log('no select event for onSelectItem'),
  onOpenItem: (_a, _b) => console.log('no select event for onOpenItem'),
} as SelectContext)

export function ProvideSelectableHandlers({
  children,
  ...rest
}: SelectContext & { children: any }) {
  return (
    <MergeContext Context={SelectableListContext} value={rest}>
      {children}
    </MergeContext>
  )
}

export function SelectableList({
  items,
  createNewSelectionStore,
  getItemProps,
  ...props
}: SelectableListProps) {
  const selectionStore = useSelectionStore(props)
  const selectableProps = useContext(SelectableListContext)
  const listRef = useRef(null)

  useEffect(
    () => {
      selectionStore.setOriginalItems(items)
      selectionStore.setSelectionResults([
        {
          type: 'column' as 'column',
          items: items.map(({ id }, index) => ({ id, index })),
        },
      ])
    },
    [items],
  )

  useEffect(() => {
    if (typeof props.defaultSelected === 'number' && selectionStore) {
      // only update if its on -1, to allow them to customize it in other ways
      if (selectionStore.activeIndex === -1) {
        selectionStore.setActiveIndex(props.defaultSelected)
      }
    }
  }, [])

  useReaction(
    () => selectionStore.activeIndex,
    activeIndex => {
      ensure('activeIndex', typeof activeIndex === 'number' && activeIndex >= 0)
      ensure('has list', !!listRef.current)
      ensure('is active', selectionStore.isActive)
      ensure('used key', selectionStore.selectEvent === SelectEvent.key)
      listRef.current.scrollToRow(activeIndex)
    },
  )

  const onSelect = useCallback(
    (index, eventType, element) => {
      if (props.onSelect) {
        return props.onSelect(index, eventType, element)
      }
      if (selectionStore) {
        selectionStore.setSelected(index, eventType)
      }
      if (selectableProps && selectableProps.onSelectItem) {
        selectableProps.onSelectItem(index, eventType, element)
      }
    },
    [selectableProps, props.onSelect],
  )

  return (
    <MergeContext Context={configure.StoreContext} value={{ selectionStore }}>
      <VirtualList
        items={items}
        forwardRef={x => (listRef.current = x)}
        onOpen={selectableProps && selectableProps.onSelectItem}
        getItemProps={getItemProps}
        {...props}
        // overwrite props explicitly
        onSelect={onSelect}
      />
    </MergeContext>
  )
}
