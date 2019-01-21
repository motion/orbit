import { ensure, react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { AppStore } from '../../apps/AppStore'
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

class SelectableStore {
  props: {
    appStore?: AppStore<any>
    selectionStore?: SelectionStore
  }
  listRef = null

  setListRef = ref => {
    this.listRef = ref
  }

  // handle scroll to row
  handleSelection = react(
    () => {
      const { selectionStore, appStore } = this.props
      if (appStore && !appStore.isActive) {
        return
      }
      const { activeIndex, selectEvent } = selectionStore
      if (selectEvent === SelectEvent.click) {
        return
      }
      return activeIndex
    },
    activeIndex => {
      ensure('activeIndex', typeof activeIndex === 'number' && activeIndex >= 0)
      ensure('list', !!this.listRef)
      this.listRef.scrollToRow(activeIndex)
    },
  )
}

export default function SelectableList(props: SelectableListProps) {
  const stores = useStoresSafe({ optional: ['selectionStore', 'appStore'] })
  const selectionStore = stores.selectionStore || useStore(SelectionStore, props)
  const selectableStore = useStore(SelectableStore, { selectionStore, appStore: stores.appStore })

  console.log('rendering selectable list...', props)

  useSelectableResults(props, selectionStore)

  return (
    <MergeContext Context={StoreContext} value={{ selectionStore }}>
      <OrbitList scrollToAlignment="center" forwardRef={selectableStore.setListRef} {...props} />
    </MergeContext>
  )
}
