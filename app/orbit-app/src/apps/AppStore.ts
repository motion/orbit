import { react, ensure, always } from '@mcro/black'
import { AppConfig } from '@mcro/stores'
import { SelectionGroup } from './SelectionResults'
import { AppProps } from './AppProps'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { AppType } from '@mcro/models'

export class AppStore {
  props: AppProps & {
    appPageStore?: AppPageStore
  }

  selectionResults = null

  setResults = (results: SelectionGroup[]) => {
    this.selectionResults = results
  }

  // only update the selection store once this pane is active
  setSelectionResultsOnActive = react(
    () => always(this.selectionResults),
    async (_, { when }) => {
      await when(() => this.isActive)
      this.props.selectionStore.setResults(this.selectionResults)
    },
  )

  get isActive() {
    const { id, isActive, paneManagerStore } = this.props
    if (typeof isActive === 'boolean') {
      return isActive
    }
    if (typeof isActive === 'function') {
      return isActive()
    }
    if (paneManagerStore) {
      return paneManagerStore.activePane === id
    }
    return false
  }

  get appConfig(): AppConfig {
    if (this.props.appPageStore) {
      return this.props.appPageStore.state.appConfig
    }
    return null
  }

  get appType(): AppType {
    if (this.props.appPageStore) {
      return this.props.appPageStore.state.appType
    }
    return null
  }

  activeQuery = react(
    () => [this.isActive, this.props.queryStore.query],
    ([active, query]) => {
      ensure('active', active)
      return query
    },
    {
      defaultValue: this.props.queryStore.query,
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

  get maxHeight() {
    const { subPaneStore } = this.props
    if (subPaneStore) {
      return subPaneStore.maxHeight - subPaneStore.aboveContentHeight
    }
    return window.innerHeight - 50
  }
}
