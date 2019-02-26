import { useStoreSimple } from '@mcro/use-store'
import React from 'react'
import { configure } from '../helpers/configure'
import { MergeContext } from '../helpers/MergeContext'
import { Omit } from '../types'
import { SelectableListProps } from './SelectableList'
import { SelectionStore } from './SelectionStore'

export type SelectionStoreProps = Omit<SelectableListProps, 'items'> & {
  isActive?: boolean
}

export type SelectionGroup = {
  name?: string
  shouldAutoSelect?: boolean
  indices: number[]
  items?: any[] // optionally store full items...
  type: 'row' | 'column'
  startIndex?: number
  [key: string]: any
}

export enum Direction {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export type MovesMap = {
  index: number
  shouldAutoSelect?: boolean
  moves?: Direction[]
}

export enum SelectEvent {
  key = 'key',
  click = 'click',
}

export function useSelectionStore(props: SelectionStoreProps) {
  return useStoreSimple(SelectionStore, props)
}

export function ProvideSelectionStore({
  children,
  selectionStore,
}: {
  selectionStore: SelectionStore
  children: any
}) {
  return (
    <MergeContext Context={configure.StoreContext} value={{ selectionStore }}>
      {children}
    </MergeContext>
  )
}
