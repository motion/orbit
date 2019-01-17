import { useEffect } from 'react'
import { useComputed } from 'mobx-react-lite'
import { useStoresSafe } from './useStoresSafe'
import { Direction } from '../stores/SelectionStore'
import { SelectableListProps } from '../views/Lists/SelectableList'

export function useSelectableResults(props: SelectableListProps) {
  const { appStore, shortcutStore, selectionStore } = useStoresSafe()
  const isActive = useComputed(
    () => (typeof props.isSelectable === 'boolean' ? props.isSelectable : !!appStore.isActive),
    [props.isSelectable],
  )

  useEffect(
    () => {
      if (isActive) {
        if (props.items) {
          appStore.setResults([{ type: 'column', indices: props.items.map((_, index) => index) }])
        }

        if (typeof props.defaultSelected === 'number' && selectionStore.activeIndex === -1) {
          selectionStore.setActiveIndex(props.defaultSelected)
        }

        return shortcutStore.onShortcut(shortcut => {
          console.log('shortcut handle', shortcut)
          switch (shortcut) {
            case 'open':
              if (props.onOpen) {
                props.onOpen(
                  selectionStore.activeIndex /* TODO have appStore.getAppConfig(index) */,
                )
              }
              break
            case 'up':
            case 'down':
              selectionStore.move(Direction[shortcut])
          }
        })
      }
    },
    [isActive],
  )
}
