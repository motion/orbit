import * as React from 'react'
import { OrbitListProps, OrbitList } from './OrbitList'
import { useSelectableResults } from '../../hooks/useSelectableResults'

export default function SelectableList(props: OrbitListProps) {
  useSelectableResults(props)
  return <OrbitList {...props} />
}
