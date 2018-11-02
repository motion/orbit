import { QueryStore } from '../stores/QueryStore/QueryStore'
import { SubPaneStore } from '../components/SubPaneStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { SelectionStore } from '../stores/SelectionStore'
import { react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'

export class AppStore {
  props: {
    id: string
    title: string
    queryStore: QueryStore
    subPaneStore: SubPaneStore
    paneManagerStore: PaneManagerStore
    selectionStore: SelectionStore
  }

  get setResults() {
    return this.props.selectionStore.setResults
  }

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.id
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
}
