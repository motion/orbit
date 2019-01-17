import { always, ensure, react } from '@mcro/black'
import { AppType } from '@mcro/models'
import { useHook } from '@mcro/use-store'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { AppProps } from './AppProps'
import { SelectionGroup } from './SelectionResults'

export class AppStore<Type extends AppType> {
  props: AppProps<Type>
  stores = useHook(() => useStoresSafe({ optional: ['selectionStore', 'subPaneStore'] }))

  toolbar = null
  selectionResults = null

  setResults = (results: SelectionGroup[]) => {
    this.selectionResults = results
  }

  // only update the selection store once this pane is active
  setSelectionResultsOnActive = react(
    () => always(this.selectionResults),
    async (_, { when }) => {
      ensure('this.stores.selectionStore', !!this.stores.selectionStore)
      await when(() => this.isActive)
      this.stores.selectionStore.setResults(this.selectionResults)
    },
  )

  get isActive() {
    const { id, isActive } = this.props
    if (typeof isActive === 'boolean') {
      return isActive
    }
    if (typeof isActive === 'function') {
      return isActive()
    }
    if (this.stores.paneManagerStore) {
      return this.stores.paneManagerStore.activePane.id === id
    }
    return false
  }

  activeQuery = react(
    () => [this.isActive, this.stores.queryStore.query],
    ([active, query]) => {
      ensure('active', active)
      return query
    },
    {
      defaultValue: this.stores.queryStore.query,
      deferFirstRun: true,
      onlyUpdateIfChanged: true,
    },
  )

  get nlp() {
    return this.stores.queryStore.nlpStore.nlp
  }

  get queryFilters() {
    return this.stores.queryStore.queryFilters
  }

  get activeIndex() {
    if (!this.stores.selectionStore) {
      return -1
    }
    return this.stores.selectionStore.activeIndex
  }

  get spaceStore() {
    return this.stores.spaceStore
  }

  get queryStore() {
    return this.stores.queryStore
  }

  get paneNode() {
    return this.stores.subPaneStore.paneNode
  }

  get getHoverSettler() {
    return this.stores.selectionStore.getHoverSettler
  }

  get toggleSelected() {
    if (this.stores.selectionStore) {
      return this.stores.selectionStore.toggleSelected
    }
  }

  get maxHeight() {
    const { subPaneStore } = this.stores
    if (subPaneStore) {
      return subPaneStore.maxHeight
    }
    return window.innerHeight - 50
  }

  setToolbar = toolbar => {
    this.toolbar = toolbar
  }
}
