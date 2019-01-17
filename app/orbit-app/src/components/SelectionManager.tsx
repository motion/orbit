import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { StoreContext } from '../contexts'
import { SelectionStore } from '../stores/SelectionStore'
import { MergeContext } from '../views/MergeContext'

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
