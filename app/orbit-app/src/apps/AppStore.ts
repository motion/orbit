import { react, ensure } from '@mcro/black'
import { App, AppConfig } from '@mcro/stores'
import { SelectionGroup } from './SelectionResults'
import { AppProps } from './AppProps'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { AppType } from '@mcro/models'

export class AppStore {
  props: AppProps & {
    viewStore?: AppPageStore
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
    if (typeof this.props.isActive === 'boolean') {
      return this.props.isActive
    }
    if (this.props.paneManagerStore) {
      return this.props.paneManagerStore.activePane === this.props.id
    }
    return false
  }

  get appConfig(): AppConfig {
    if (this.props.viewStore) {
      return this.props.viewStore.state.appConfig
    }
    return null
  }

  get appType(): AppType {
    if (this.props.viewStore) {
      return this.props.viewStore.state.appType
    }
    return null
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

  get maxHeight() {
    const { subPaneStore } = this.props
    if (subPaneStore) {
      return subPaneStore.maxHeight - subPaneStore.aboveContentHeight
    }
    return window.innerHeight - 50
  }
}
