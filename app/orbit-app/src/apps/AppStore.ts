import { QueryStore } from '../stores/QueryStore/QueryStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { SelectionStore } from '../stores/SelectionStore'
import { react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { SelectionGroup } from './SelectionResults'
import { SubPaneStore } from '../components/SubPaneStore'

export class AppStore {
  props: {
    id: string
    title: string
    queryStore: QueryStore
    paneManagerStore?: PaneManagerStore
    selectionStore: SelectionStore
    subPaneStore?: SubPaneStore
  }

  selectionResults = null

  setResults = (results: SelectionGroup[]) => {
    this.selectionResults = results
  }

  // only update the selection store once this pane is active
  setSelectionResultsOnActive = react(
    () => this.selectionResults && Math.random(),
    async (_, { when }) => {
      await when(() => this.isActive)
      this.props.selectionStore.setResults(this.selectionResults)
    },
  )

  get isActive() {
    if (!this.props.paneManagerStore) {
      return true
    } else {
      return this.props.paneManagerStore.activePane === this.props.id
    }
  }

  activeQuery = react(
    () => [this.isActive, App.state.query],
    ([active, query]) => {
      ensure('active', active)
      return query
    },
    {
      defaultValue: App.state.query,
      onlyUpdateIfChanged: true,
    },
  )

  get nlp() {
    return this.props.queryStore.nlpStore.nlp
  }

  get queryFilters() {
    return this.props.queryStore.queryFilters
  }

  get activeIndex() {
    return this.props.selectionStore.activeIndex
  }

  get queryStore() {
    return this.props.queryStore
  }

  get paneNode() {
    return this.props.subPaneStore.paneNode
  }

  get getHoverSettler() {
    return this.props.selectionStore.getHoverSettler
  }

  get toggleSelected() {
    return this.props.selectionStore.toggleSelected
  }
}
