import React, { useEffect } from 'react'
import { useStore } from '@mcro/use-store'
import { SelectionStore } from '../stores/SelectionStore'
import { MergeContext } from '../views/MergeContext'
import { useComputed, observer } from 'mobx-react-lite'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { StoreContext } from '../contexts'

export type SelectionManagerProps = {
  paneId?: number
  onClearSelection?: Function
}

export const SelectionManager = observer(
  (props: SelectionManagerProps & { children: React.ReactNode }) => {
    const { paneManagerStore, shortcutStore } = useStoresSafe()
    const selectionStore = useStore(SelectionStore, props)
    const isActive = useComputed(() => paneManagerStore.activePane === props.paneId)

    useEffect(
      () => {
        if (isActive) {
          console.log('setting active selection pane', props.paneId)
          shortcutStore.setActiveSelectionStore(selectionStore)
        }
      },
      [isActive],
    )

    return (
      <MergeContext Context={StoreContext} value={{ selectionStore }}>
        {props.children}
      </MergeContext>
    )
  },
)
