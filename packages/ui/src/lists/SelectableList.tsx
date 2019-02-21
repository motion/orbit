import { ensure, react, useStore } from '@mcro/use-store'
import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { configure } from '../helpers/configure'
import { MergeContext } from '../helpers/MergeContext'
import { useStores } from '../helpers/useStores'
import { getItemsKey } from './helpers'
import { HandleSelection } from './ListItem'
import { SelectEvent } from './ProvideSelectionStore'
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

// child of SelectionStore, more specifically for Orbit lists

class SelectableStore {
  props: {
    selectionStore?: SelectionStore
    itemsKey: string
    getItems: Function
  }
  listRef = null

  setListRef = ref => {
    this.listRef = ref
  }

  updateSelectionResults = react(
    () => this.props.itemsKey,
    () => {
      this.props.selectionStore.setResults([
        { type: 'column', indices: this.props.getItems().map((_, index) => index) },
      ])
    },
  )

  // handle scroll to row
  handleSelection = react(
    () => {
      const { selectionStore } = this.props
      if (selectionStore && !selectionStore.isActive) {
        return
      }
      const { activeIndex, selectEvent } = selectionStore
      if (selectEvent === SelectEvent.click) {
        return
      }
      return activeIndex
    },
    activeIndex => {
      ensure('activeIndex', typeof activeIndex === 'number' && activeIndex >= 0)
      ensure('list', !!this.listRef)
      this.listRef.scrollToRow(activeIndex)
    },
  )
}

export function SelectableList({ items, createNewSelectionStore, ...props }: SelectableListProps) {
  const stores = useStores({ optional: ['selectionStore', 'appStore'] })
  const selectionStore = createNewSelectionStore
    ? useStore(SelectionStore, props)
    : props.selectionStore || stores.selectionStore || useStore(SelectionStore, props)

  // TODO only calculate for the visible items (we can use listRef)
  const itemsKey = getItemsKey(items)
  const getItems = useCallback(() => items, [itemsKey])
  const selectableStore = useStore(SelectableStore, {
    selectionStore,
    itemsKey,
    getItems,
  })
  const selectableProps = useContext(SelectableListContext)

  useEffect(() => {
    if (typeof props.defaultSelected === 'number' && selectionStore) {
      // only update if its on -1, to allow them to customize it in other ways
      if (selectionStore.activeIndex === -1) {
        selectionStore.setActiveIndex(props.defaultSelected)
      }
    }
  }, [])

  const onSelect = useCallback(
    (index, eventType, element) => {
      if (props.onSelect) {
        return props.onSelect(index, eventType, element)
      }
      if (selectionStore) {
        selectionStore.toggleSelected(index, eventType)
      }
      if (selectableProps && selectableProps.onSelectItem) {
        selectableProps.onSelectItem(index, eventType, element)
      }
    },
    [selectableProps, props.onSelect],
  )

  return (
    <MergeContext Context={configure.StoreContext} value={{ selectionStore }}>
      {/* Be sure these props are memoed */}
      <VirtualList
        items={items}
        scrollToAlignment="center"
        // itemsKey={itemsKey}
        forwardRef={selectableStore.setListRef}
        onOpen={selectableProps && selectableProps.onSelectItem}
        {...props}
        // overwrite props explicitly
        onSelect={onSelect}
      />
    </MergeContext>
  )
}
