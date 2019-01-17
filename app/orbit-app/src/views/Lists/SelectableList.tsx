import * as React from 'react'
import { OrbitListProps, OrbitList } from './OrbitList'
import { useSelectableResults } from '../../hooks/useSelectableResults'

export type SelectableListProps = OrbitListProps & {
  defaultSelected?: number
  isSelectable?: boolean
}

// TODO this could provide a selection store *if* not already in context to be more simple

export default function SelectableList(props: SelectableListProps) {
  useSelectableResults(props)
  return <OrbitList {...props} />
}
