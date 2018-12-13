import { react, ensure, always } from '@mcro/black'
import { SelectionGroup } from './SelectionResults'
import { AppProps } from './AppProps'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { AppType, AppConfig } from '@mcro/models'

export class AppStore<Type extends AppType> {
  props: AppProps<Type> & {
    appPageStore?: AppPageStore
  }

  toolbar = null
  selectionResults = null

  setResults = (results: SelectionGroup[]) => {
    this.selectionResults = results
  }

  // only update the selection store once this pane is active
  setSelectionResultsOnActive = react(
    () => always(this.selectionResults),
    async (_, { when }) => {
      ensure('this.props.selectionStore', !!this.props.selectionStore)
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
    return this.props.appConfig
  }

  get appType(): AppType {
    if (this.props.appPageStore) {
      return this.props.appPageStore.state.appConfig.type
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
    if (!this.props.selectionStore) {
      return -1
    }
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
      return subPaneStore.maxHeight
    }
    return window.innerHeight - 50
  }

  setToolbar = toolbar => {
    this.toolbar = toolbar
  }
}
