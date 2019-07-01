import { react } from '@o/use-store'

import { NLPStore } from './NLPStore/NLPStore'
import { QueryFilterStore, SourceDesc } from './QueryFilterStore'

export class QueryStore {
  queryInstant = ''
  ignorePrefix = false

  get queryParsed() {
    if (this.ignorePrefix) {
      return this.queryInstant.slice(this.queryInstant.indexOf(' ') + 1)
    }
    return this.queryInstant
  }

  query = react(
    () => this.queryParsed,
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

  setIgnorePrefix(next: boolean = true) {
    this.ignorePrefix = next
  }

  nlpStore = new NLPStore()

  queryFilters = new QueryFilterStore({
    queryStore: this,
    nlpStore: this.nlpStore,
  })

  setSources(sources: SourceDesc[]) {
    this.queryFilters.setSources(sources)
  }

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

  onChangeQuery = (next: string) => {
    this.queryInstant = next
  }

  toggleLocationFilter(location: string) {
    if (this.queryInstant.includes(location) === false) {
      this.setQuery(`${this.queryInstant.trim()} in:${location}`)
    }
  }

  queryToggleFilter(str: string) {
    if (this.queryInstant.includes(str) === false) {
      this.setQuery(`${this.queryInstant.trim()} ${str}`)
    }
  }
}
