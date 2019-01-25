import { ensure, react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { AppStore } from '../../apps/AppStore'
import { StoreContext } from '../../contexts'
import { isEqualReferential } from '../../helpers/isEqualReferential'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Direction, SelectEvent, SelectionStore } from '../../stores/SelectionStore'
import { MergeContext } from '../MergeContext'
import { orbitItemsKey } from './orbitItemsKey'
import OrbitList, { OrbitHandleSelect, OrbitListProps } from './OrbitList'

export type SelectableListProps = OrbitListProps & {
  minSelected?: number
  defaultSelected?: number
  isSelectable?: boolean
}

type SelectContext = {
  onSelectItem?: OrbitHandleSelect
  onOpenItem?: OrbitHandleSelect
}

const SelectableContext = React.createContext({
  onSelectItem: (_a, _b) => console.log('no select event for onSelectItem'),
  onOpenItem: (_a, _b) => console.log('no select event for onOpenItem'),
} as SelectContext)

export function ProvideSelectableHandlers({
  children,
  ...rest
}: SelectContext & { children: any }) {
  return (
    <MergeContext Context={SelectableContext} value={rest}>
      {children}
    </MergeContext>
  )
}

// child of SelectionStore, more specifically for Orbit lists

class SelectableStore {
  props: {
    appStore?: AppStore<any>
    selectionStore?: SelectionStore
    itemsKey: string
    getItems: Function
  }
  listRef = null

  setListRef = ref => {
    this.listRef = ref
  }

  isActive = () => {
    if (this.props.appStore) {
      return this.props.appStore.isActive
    }
    return true
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
      const { selectionStore, appStore } = this.props
      if (appStore && !appStore.isActive) {
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

export default React.memo(function SelectableList(props: SelectableListProps) {
  const stores = useStoresSafe({ optional: ['selectionStore', 'appStore'] })
  const selectionStore = stores.selectionStore || useStore(SelectionStore, props)
  // TODO only calculate for the visible items (we can use listRef)
  const itemsKey = orbitItemsKey(props.items)
  const getItems = React.useCallback(() => props.items, [itemsKey])
  const selectableProps = React.useContext(SelectableContext)
  const selectableStore = useStore(SelectableStore, {
    selectionStore,
    appStore: stores.appStore,
    itemsKey,
    getItems,
  })

  // TODO clear selection when app window closes, we really need useReaction()
  // useReaction(
  //   () => !!App.peekState && !App.peekState.target,
  //   removedTarget => {
  //     ensure('removedTarget', removedTarget)
  //     selectionStore.clearSelected()
  //   },
  //   { deferFirstRun: true }
  // )

  React.useEffect(() => {
    if (typeof props.defaultSelected === 'number' && selectionStore) {
      // only update if its on -1, to allow them to customize it in other ways
      if (selectionStore.activeIndex === -1) {
        selectionStore.setActiveIndex(props.defaultSelected)
      }
    }

    return stores.shortcutStore.onShortcut(shortcut => {
      if (!selectableStore.isActive()) {
        return false
      }
      switch (shortcut) {
        case 'open':
          if (props.onOpen) {
            if (selectionStore) {
              props.onOpen(selectionStore.activeIndex, null)
            }
          }
          break
        case 'up':
        case 'down':
          if (selectionStore) {
            selectionStore.move(Direction[shortcut])
          }
          break
      }
    })
  }, [])

  return (
    <MergeContext Context={StoreContext} value={{ selectionStore }}>
      <OrbitList
        scrollToAlignment="center"
        itemsKey={itemsKey}
        forwardRef={selectableStore.setListRef}
        onSelect={selectableProps.onSelectItem}
        onOpen={selectableProps.onSelectItem}
        {...props}
      />
    </MergeContext>
  )
}, isEqualReferential)
