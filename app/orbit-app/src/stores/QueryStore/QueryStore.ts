import { react } from '@mcro/black'
import { SourcesStore } from '../SourcesStore'
import { NLPStore } from './NLPStore'
import { QueryFilterStore } from './QueryFiltersStore'

export class QueryStore {
  props: {
    sourcesStore: SourcesStore
  }

  queryInstant = ''

  query = react(
    () => this.queryInstant,
    async (query, { sleep }) => {
      // update nlp
      this.nlpStore.setQuery(query)

      if (query === '') {
        return query
      }
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

  nlpStore = new NLPStore()

  queryFilters = new QueryFilterStore({
    queryStore: this,
    sourcesStore: this.props.sourcesStore,
    nlpStore: this.nlpStore,
  })

  willUnmount() {
    // TODO decorators don't change the type of classes, need to fix compiler errors somehow
    // @ts-ignore
    this.nlpStore.dispose()
    // @ts-ignore
    this.queryFilters.dispose()
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

  toggleLocationFilter(location: string) {
    if (this.queryInstant.includes(location) === false) {
      this.setQuery(`${this.queryInstant.trim()} in:${location}`)
    }
  }

  togglePersonFilter(person: string) {
    if (this.queryInstant.includes(person) === false) {
      this.setQuery(`${this.queryInstant.trim()} ${person}`)
    }
  }

  queryToggleFilter(str: string) {
    if (this.queryInstant.includes(str) === false) {
      this.setQuery(`${this.queryInstant.trim()} ${str}`)
    }
  }
}
