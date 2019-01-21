import { useObserver } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
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
  const key = useRef(null)

  useObserver(() => {
    if (isActive()) {
      const nextKey = orbitItemsKey(props.items)
      if (nextKey !== key.current) {
        key.current = nextKey
        console.log('setting selection', props.items)
        selectionStore.setResults([
          { type: 'column', indices: props.items.map((_, index) => index) },
        ])
      }
    }
  }, 'useSelectableResults')

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
