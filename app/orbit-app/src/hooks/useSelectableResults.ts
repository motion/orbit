import { useEffect } from 'react'
import { useComputed } from 'mobx-react-lite'
import { useStoresSafe } from './useStoresSafe'
import { OrbitListProps } from '../views/Lists/OrbitList'
import { Direction } from '../stores/SelectionStore'

export function useSelectableResults(props: Partial<OrbitListProps> & { isActive?: boolean }) {
  const { appStore, shortcutStore, selectionStore } = useStoresSafe()
  const isActive = useComputed(() =>
    typeof props.isActive === 'boolean' ? props.isActive : !!appStore.isActive,
  )

  useEffect(
    () => {
      if (isActive) {
        if (props.items) {
          appStore.setResults([{ type: 'column', indices: props.items.map((_, index) => index) }])
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
