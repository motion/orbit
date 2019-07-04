import { react } from '@o/use-store'

import { NLPStore } from './NLPStore/NLPStore'
import { QueryFilterStore, SourceDesc } from './QueryFilterStore'

export class QueryStore {
  queryInstant = ''
  prefixFirstWord = false

  setQuery = (value: string) => {
    this.queryInstant = value
  }

  get queryFull() {
    return this.queryInstant
  }

  get queryWithoutPrefix() {
    if (this.prefixFirstWord) {
      const spaceIndex = this.queryInstant.indexOf(' ')
      if (spaceIndex > -1) {
        return this.queryInstant.slice(spaceIndex + 1)
      }
      return ''
    }
    return this.queryInstant
  }

  query = react(
    () => [this.queryWithoutPrefix, this.queryInstant],
    async ([query], { sleep }) => {
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

  setPrefixFirstWord(next: boolean = true) {
    this.prefixFirstWord = next
  }

  nlpStore = new NLPStore()

  queryFilters = new QueryFilterStore({
    queryStore: this,
    nlpStore: this.nlpStore,
  })

  setSources(sources: SourceDesc[]) {
    this.queryFilters.setSources(sources)
  }

  dispose() {
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

  clearPrefix() {
    // if we had a query prefix active
    if (this.prefixFirstWord) {
      // remove the prefix we were using on enter
      this.setQuery(this.queryWithoutPrefix)
      this.prefixFirstWord = false
    } else {
      // otherwise clear the searched app query
      this.clearQuery()
    }
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
