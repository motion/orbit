import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { useSelectableResults } from '../../hooks/useSelectableResults'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitList, OrbitListProps } from './OrbitList'

export type SelectableListProps = OrbitListProps & {
  defaultSelected?: number
  isSelectable?: boolean
}

// TODO this could provide a selection store *if* not already in context to be more simple

export default function SelectableList(props: SelectableListProps) {
  useSelectableResults(props)

  const [ref, setRef] = React.useState({ store: null, list: null })
  const { appStore, selectionStore } = useStoresSafe()

  // handle scroll to row
  useObserver(() => {
    if (appStore && !appStore.isActive) {
      return
    }
    const index = selectionStore.activeIndex
    if (ref.list && typeof index === 'number' && index >= 0) {
      ref.list.scrollToRow(index)
    }
  })

  return (
    <OrbitList
      scrollToAlignment="center"
      forwardRef={(list, store) => {
        if (ref.store !== store) {
          setRef({ store, list })
        }
      }}
      {...props}
    />
  )
}
