import { react } from '@o/use-store'

import { NLPStore } from './NLPStore/NLPStore'
import { QueryFilterStore, SourceDesc } from './QueryFilterStore'

export type QueryCommand = 'enter'

export const ignoreFirstWord = (q: string) => {
  const spaceIndex = q.indexOf(' ')
  if (spaceIndex > -1) {
    return q.slice(spaceIndex + 1)
  }
  return ''
}

export class QueryStore {
  queryInstant = ''
  prefixFirstWord = false

  lastCommand: { name: QueryCommand; at: number } = {
    name: null,
    at: Date.now(),
  }

  setLastCommand = (name: QueryCommand) => {
    this.lastCommand = { name, at: Date.now() }
  }

  setQuery = (value: string) => {
    this.queryInstant = value
  }

  get queryWithoutPrefix() {
    if (this.prefixFirstWord) {
      return ignoreFirstWord(this.queryInstant)
    }
    return this.queryInstant
  }

  queryFull = react(
    () => this.queryInstant,
    async (query, { sleep }) => {
      if (query === '') return ''
      // debounce super short queries more because they are less often + in hot path
      await sleep(query.length <= 2 ? 100 : 50)
      return query
    },
    {
      defaultValue: '',
    },
  )

  query = react(() => this.queryFull, () => this.queryWithoutPrefix, {
    defaultValue: '',
  })

  updateNLPOnQuery = react(
    () => this.queryFull,
    next => {
      this.nlpStore.setQuery(next)
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
