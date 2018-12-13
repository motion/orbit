import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { SelectionStore } from '../stores/SelectionStore'
import { useContext } from 'react'
import { StoreContext } from '@mcro/black'
import { MergeContext } from '../views/MergeContext'

export type SelectionManagerProps = {
  onClearSelection?: Function
}

export const SelectionManager = (props: SelectionManagerProps & { children: React.ReactNode }) => {
  const { queryStore } = useContext(StoreContext)
  const selectionStore = useStore(SelectionStore, {
    ...props,
    queryStore,
  })

  return (
    <MergeContext Context={StoreContext} value={{ selectionStore }}>
      {props.children}
    </MergeContext>
  )
}
