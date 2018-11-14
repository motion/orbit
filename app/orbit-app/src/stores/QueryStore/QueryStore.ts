import { react } from '@mcro/black'
import { SourcesStore } from '../SourcesStore'
import { QueryFilterStore } from './QueryFiltersStore'
import { NLPStore } from './NLPStore'

export class QueryStore {
  props: {
    sourcesStore: SourcesStore
  }

  queryInstant = ''

  query = react(
    () => this.queryInstant,
    async (query, { sleep }) => {
      await sleep(50)
      // debounce super short queries more because they are less often + in hot path
      if (query.length <= 2) {
        await sleep(50)
      }
      return query
    },
    {
      defaultValue: '',
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

  hasQuery = react(() => !!this.queryInstant.length, _ => _)

  clearQuery = () => {
    this.queryInstant = ''
    this.queryFilters.resetAllFilters()
  }

  setQuery = value => {
    this.queryInstant = value
  }

  onChangeQuery = e => {
    this.queryInstant = e.target.value
  }
}
