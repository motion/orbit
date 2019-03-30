import { useStore } from '@o/use-store'
import React, { useEffect } from 'react'
import { configure } from '../helpers/configure'
import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { MergeContext } from '../helpers/MergeContext'
import { useStoresSimple } from '../helpers/useStores'
import { Omit } from '../types'
import { SelectableListProps } from './SelectableList'
import { SelectionStore } from './SelectionStore'

export type SelectionStoreProps = Omit<SelectableListProps, 'items'> & {
  // TODO this is hacky can we remove? we have VisibleContext
  isActive?: boolean
}

// either uses one above it or uses a new one
// for now its dangerous, conditional hooks
// todo make it less dangerous
// though, you shouldn't probably be changing this out in context
export function useSelectionStore(props: SelectionStoreProps): SelectionStore {
  const stores = useStoresSimple()
  const existingStore = props.selectionStore || stores.selectionStore
  const selectionStore = props.createNewSelectionStore
    ? useStore(SelectionStore, props)
    : existingStore || useStore(SelectionStore, props)

  useEffect(
    () => {
      if (existingStore) {
        existingStore.setChildProps(props)
      }
    },
    [props.minSelected, props.onSelect, props.defaultSelected],
  )

  return selectionStore
}

export const ProvideSelectionStore = memoIsEqualDeep(
  ({ children, selectionStore }: { selectionStore: SelectionStore; children: any }) => {
    return (
      <MergeContext Context={configure.StoreContext} value={{ selectionStore }}>
        {children}
      </MergeContext>
    )
  },
)
