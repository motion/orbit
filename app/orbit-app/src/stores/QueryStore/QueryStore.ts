import { react } from '@mcro/black'
import { SourcesStore } from '../SourcesStore'
import { QueryFilterStore } from './QueryFiltersStore'
import { NLPStore } from './NLPStore'

export class QueryStore {
  props: {
    sourcesStore: SourcesStore
  }

  query = ''

  queryDebounced = react(
    () => this.query,
    async (query, { sleep }) => {
      await sleep(50)
      // debounce super short queries more because they are less often + in hot path
      if (query.length <= 2) {
        await sleep(50)
      }
      return query
    },
  )

  nlpStore = new NLPStore({
    queryStore: this,
  })

  queryFilters = new QueryFilterStore({
    queryStore: this,
    sourcesStore: this.props.sourcesStore,
    nlpStore: this.nlpStore,
  })

  willUnmount() {
    this.nlpStore['subscriptions'].dispose()
    this.queryFilters['subscriptions'].dispose()
  }

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
