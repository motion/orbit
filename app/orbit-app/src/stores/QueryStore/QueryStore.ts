import { react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { SourcesStore } from '../SourcesStore'
import { QueryFilterStore } from './QueryFiltersStore'
import { NLPStore } from './NLPStore'

export class QueryStore {
  props: {
    sourcesStore: SourcesStore
  }

  query = App.state.query

  nlpStore = new NLPStore()

  queryFilters = new QueryFilterStore({
    queryStore: this,
    sourcesStore: this.props.sourcesStore,
    nlpStore: this.nlpStore,
  })

  willUnmount() {
    this.nlpStore['subscriptions'].dispose()
    this.queryFilters['subscriptions'].dispose()
  }

  updateAppQuery = react(
    () => this.query,
    async (query, { sleep }) => {
      // debounce a bit for fast typer
      await sleep(40)
      // debounce even more on one letter queries, because who searcht that anyway
      if (App.state.query.length === 0 && query.length === 1) {
        await sleep(50)
      }
      App.setState({ query })
    },
  )

  externalChangeAppQuery = react(
    () => App.state.query,
    query => {
      ensure('is diff', query !== this.query)
      console.log('external query update')
      this.query = query
    },
  )

  hasQuery = react(() => !!this.query.length, _ => _)

  clearQuery = () => {
    this.query = ''
    this.queryFilters.resetAllFilters()
  }

  setQuery = value => {
    this.query = value
  }

  onChangeQuery = e => {
    this.query = e.target.value
  }
}
