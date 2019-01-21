import { useComputed } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Direction, SelectionStore } from '../stores/SelectionStore'
import { orbitItemsKey } from '../views/Lists/OrbitList'
import { SelectableListProps } from '../views/Lists/SelectableList'
import { useStoresSafe } from './useStoresSafe'

export function useSelectableResults(props: SelectableListProps, selectionStore: SelectionStore) {
  // TODO appStore should be moved up one to be configurable via props (just call props.onSelection here)
  const { appStore, shortcutStore } = useStoresSafe({ optional: ['appStore'] })
  const isActive = () => {
    if (typeof props.isSelectable === 'boolean') {
      return props.isSelectable
    }
    if (appStore) {
      return appStore.isActive
    }
    return true
  }

  useComputed(
    () => {
      selectionStore.setResults([{ type: 'column', indices: props.items.map((_, index) => index) }])
    },
    [orbitItemsKey(props.items)],
  )

  useEffect(() => {
    if (
      typeof props.defaultSelected === 'number' &&
      selectionStore &&
      selectionStore.activeIndex === -1
    ) {
      selectionStore.setActiveIndex(props.defaultSelected)
    }

    return shortcutStore.onShortcut(shortcut => {
      if (!isActive()) {
        return false
      }
      console.log('shortcut handle', shortcut)
      switch (shortcut) {
        case 'open':
          if (props.onOpen) {
            if (selectionStore) {
              props.onOpen(selectionStore.activeIndex, 'key')
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
}
