import { useStore } from '@mcro/use-store'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { StoreContext } from '../../contexts'
import { useSelectableResults } from '../../hooks/useSelectableResults'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { SelectEvent, SelectionStore } from '../../stores/SelectionStore'
import { MergeContext } from '../MergeContext'
import { OrbitList, OrbitListProps } from './OrbitList'

export type SelectableListProps = OrbitListProps & {
  defaultSelected?: number
  isSelectable?: boolean
}

// TODO this could provide a selection store *if* not already in context to be more simple

export default function SelectableList(props: SelectableListProps) {
  const stores = useStoresSafe()
  const selectionStore = stores.selectionStore || useStore(SelectionStore, props)

  useSelectableResults(props, selectionStore)

  const [ref, setRef] = React.useState({ store: null, list: null })

  // handle scroll to row
  useObserver(() => {
    if (stores.appStore && !stores.appStore.isActive) {
      return
    }
    const { activeIndex, selectEvent } = selectionStore
    if (selectEvent === SelectEvent.click) {
      return
    }
    if (ref.list && typeof activeIndex === 'number' && activeIndex >= 0) {
      ref.list.scrollToRow(activeIndex)
    }
  })

  return (
    <MergeContext Context={StoreContext} value={{ selectionStore }}>
      <OrbitList
        scrollToAlignment="center"
        forwardRef={(list, store) => {
          if (ref.store !== store) {
            setRef({ store, list })
          }
        }}
        {...props}
      />
    </MergeContext>
  )
}
