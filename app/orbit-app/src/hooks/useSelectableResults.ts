import { useObserver } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Direction } from '../stores/SelectionStore'
import { SelectableListProps } from '../views/Lists/SelectableList'
import { useStoresSafe } from './useStoresSafe'

export function useSelectableResults(props: SelectableListProps) {
  const { appStore, shortcutStore, selectionStore } = useStoresSafe({
    optional: ['selectionStore'],
  })
  const isActive = useObserver(() =>
    typeof props.isSelectable === 'boolean' ? props.isSelectable : !!appStore.isActive,
  )

  useEffect(
    () => {
      if (isActive) {
        if (props.items) {
          appStore.setResults([{ type: 'column', indices: props.items.map((_, index) => index) }])
        }

        if (
          typeof props.defaultSelected === 'number' &&
          selectionStore &&
          selectionStore.activeIndex === -1
        ) {
          selectionStore.setActiveIndex(props.defaultSelected)
        }

        return shortcutStore.onShortcut(shortcut => {
          console.log('shortcut handle', shortcut)
          switch (shortcut) {
            case 'open':
              if (props.onOpen) {
                if (selectionStore) {
                  props.onOpen(
                    selectionStore.activeIndex /* TODO have appStore.getAppConfig(index) */,
                  )
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
      }
    },
    [isActive],
  )
}
