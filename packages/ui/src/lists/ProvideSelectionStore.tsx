import { useStore } from '@mcro/use-store'
import React from 'react'
import { configure } from '../helpers/configure'
import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { MergeContext } from '../helpers/MergeContext'
import { useStores } from '../helpers/useStores'
import { Omit } from '../types'
import { SelectableListProps } from './SelectableList'
import { SelectionStore } from './SelectionStore'

export type SelectionStoreProps = Omit<SelectableListProps, 'items'> & {
  isActive?: boolean
}

export type SelectionGroup = {
  shouldAutoSelect?: boolean
  items: { id?: any; index: number }[]
  type: 'row' | 'column'
  startIndex?: number
}

export enum Direction {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export type MovesMap = {
  index: number
  id: any
  shouldAutoSelect?: boolean
  moves?: Direction[]
}

export enum SelectEvent {
  key = 'key',
  click = 'click',
}

// either uses one above it or uses a new one
// for now its dangerous, conditional hooks
// todo make it less dangerous
// though, you shouldn't probably be changing this out in context
export function useSelectionStore(props: SelectionStoreProps) {
  const stores = useStores({ optional: ['selectionStore', 'appStore'] })
  const selectionStore = props.createNewSelectionStore
    ? useStore(SelectionStore, props)
    : props.selectionStore || stores.selectionStore || useStore(SelectionStore, props)
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
