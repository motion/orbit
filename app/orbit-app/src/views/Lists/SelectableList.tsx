import * as React from 'react'
import { useSelectableResults } from '../../hooks/useSelectableResults'
import { OrbitList, OrbitListProps } from './OrbitList'

export type SelectableListProps = OrbitListProps & {
  defaultSelected?: number
  isSelectable?: boolean
}

// TODO this could provide a selection store *if* not already in context to be more simple

export default function SelectableList(props: SelectableListProps) {
  useSelectableResults(props)
  return <OrbitList {...props} />
}
