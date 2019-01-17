import React from 'react'
import { useStore } from '@mcro/use-store'
import { SelectionStore } from '../stores/SelectionStore'
import { MergeContext } from '../views/MergeContext'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../contexts'

export type SelectionManagerProps = {
  paneId?: number
  onClearSelection?: Function
}

export const SelectionManager = observer(
  (props: SelectionManagerProps & { children: React.ReactNode }) => {
    const selectionStore = useStore(SelectionStore, props)

    return (
      <MergeContext Context={StoreContext} value={{ selectionStore }}>
        {props.children}
      </MergeContext>
    )
  },
)
