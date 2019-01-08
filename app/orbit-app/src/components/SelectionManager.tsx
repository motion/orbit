import React, { useEffect } from 'react'
import { useStore } from '@mcro/use-store'
import { SelectionStore } from '../stores/SelectionStore'
import { useContext } from 'react'
import { StoreContext } from '@mcro/black'
import { MergeContext } from '../views/MergeContext'

export type SelectionManagerProps = {
  pane: string
  onClearSelection?: Function
}

export const SelectionManager = (props: SelectionManagerProps & { children: React.ReactNode }) => {
  const { queryStore } = useContext(StoreContext)
  const selectionStore = useStore(SelectionStore, {
    onClearSelection: props.onClearSelection,
    queryStore,
  })

  //  update shortcutStore active selectionStore
  const { paneManagerStore, shortcutStore } = React.useContext(StoreContext)
  useEffect(
    () => {
      if (paneManagerStore.activePane === props.pane) {
        console.log('setting active selection pane', props.pane)
        shortcutStore.setActiveSelectionStore(selectionStore)
      }
    },
    [props.pane],
  )

  return (
    <MergeContext Context={StoreContext} value={{ selectionStore }}>
      {props.children}
    </MergeContext>
  )
}
