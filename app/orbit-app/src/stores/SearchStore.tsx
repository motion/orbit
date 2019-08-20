import { always, appToListItem, createStoreContext, ensure, MarkType, react, searchBits, SearchQuery, SearchState, useActiveSpace, useAppBit, useHooks, useStoresSimple } from '@o/kit'
import { fuzzyFilter, ListItemProps } from '@o/ui'

import { appsCarouselStore } from '../pages/OrbitPage/OrbitAppsCarousel'

type SearchResults = {
  results: ListItemProps[]
  finished?: boolean
  query: string
}

export class SearchStoreStore {
  hooks = useHooks(() => ({
    stores: useStoresSimple(),
    app: useAppBit()[0],
    space: useActiveSpace()[0],
  }))

  searchState: SearchState | null = null

  // we sync TO here not from here
  selectedItem: ListItemProps | null = null
  setSelectedItem(next: ListItemProps) {
    this.selectedItem = next
  }

  get stores() {
    return this.hooks.stores
  }

  get apps() {
    return appsCarouselStore.apps.filter(
      x => x.identifier !== 'searchResults' && x.identifier !== 'bit',
    )
  }

  setSearchState(next: SearchState) {
    this.searchState = next
  }

  get query() {
    return (this.searchState && this.searchState.queryFull) || ''
  }

  lastQuery = react(() => this.query, {
    delayValue: true,
  })

  get isChanging() {
    return this.searchState && this.searchState.query !== this.query
  }

  hasQuery = () => {
    return !!this.query
  }

  get allApps() {
    return this.apps.map(appToListItem)
  }

  getApps(query: string, all = false): ListItemProps[] {
    if (query || all) {
      return this.allApps
    }
    return this.allApps.slice(0, 8)
  }

  getQuickResults(query: string, all = false) {
    return fuzzyFilter(query, [...this.getApps(query, all)])
  }

  get results() {
    return this.state.results
  }

  lastResults = react(
    () => this.state,
    async (state, { sleep }) => {
      ensure('state', !!state)
      await sleep(200)
      return state.results
    },
    {
      lazy: true,
    },
  )

  keyFor = (item: ListItemProps) => {
    return (
      item.key ||
      (item.item && item.item.id) ||
      (() => {
        throw new Error(`No valid key`)
      })()
    )
  }

  state = react(
    () => [this.hooks.space.id, this.query, this.hooks.app, always(this.apps), !!this.searchState],
    async ([spaceId, query, app], { sleep, when, setValue }): Promise<SearchResults> => {
      ensure('app', !!app)
      ensure('this.searchState', !!this.searchState)

      const isItemFiltering = this.query[0] === '/'
      const isBeginningItemFilter = this.lastQuery === '' && isItemFiltering

      if (!isBeginningItemFilter) {
        await sleep(120)
      }

      // RESULTS
      let results: ListItemProps[] = []
      let resultsKeyMap: { [key: string]: boolean } = {}

      // only use this to add to results, so we can de-dupe using resultsKeyMap
      const addResults = (next: ListItemProps[]) => {
        for (const item of next) {
          const key = this.keyFor(item)
          if (resultsKeyMap[key]) continue
          resultsKeyMap[key] = true
          results.push(item)
        }
        results = [...results]
      }

      if (!isItemFiltering) {
        addResults(this.getQuickResults(query))
      }

      // keep the previous results in memory and filter down fuzzy
      if (query.length) {
        let lastResults = this.lastResults ? this.lastResults : []

        if (isItemFiltering) {
          lastResults = lastResults.filter(x => x.groupName !== 'Apps')
        }

        addResults(
          fuzzyFilter(query, lastResults, {
            threshold: -300,
            keys: ['title', 'item.title'],
          }),
        )
      }

      // quick return from search
      setValue({ results, query, finished: false })

      await sleep(50)

      // if typing, wait a bit
      const isChangingQuery = this.state.query !== query
      if (isChangingQuery) {
        // short queries we dont need to wait
        if (query.length > 3) {
          // wait for nlp to give us results
          await when(() => this.stores.queryStore!.nlpStore.nlp.query === query)
        }
      }

      // query build
      const { exclusiveFilters, activeFilters, dateState, sortBy } = this.searchState!.filters
      // filters
      const peopleFilters = activeFilters.filter(x => x.type === MarkType.Person).map(x => x.text)
      const appFilters = [
        // these come from the text string
        ...activeFilters.filter(x => x.type === MarkType.App).map(x => x.text),
        // these come from the button bar
        ...Object.keys(exclusiveFilters).filter(x => exclusiveFilters[x]),
      ]
      const locationFilters = activeFilters
        .filter(x => x.type === MarkType.Location)
        .map(x => x.text)
      const { startDate, endDate } = dateState
      const searchQuery = query[0] === '/' ? query.slice(1) : query

      /** We can load pages piece by piece with this */
      let total = 0
      async function addSearchResults({ take }: { take: number }) {
        const args: SearchQuery = {
          spaceId,
          query: searchQuery,
          sortBy,
          startDate,
          endDate,
          appFilters,
          peopleFilters,
          locationFilters,
          skip: total + take,
          take,
        }
        total += take
        const nextResults = await searchBits(args)
        await sleep(50)
        if (!nextResults.length) return false
        const next: ListItemProps[] = nextResults.map(item => ({
          item,
          groupName: 'Search Results',
        }))
        addResults(next)
        setValue({
          results,
          query,
          finished: false,
        })
        return true
      }

      // split into chunks to avoid heavy work
      // react concurrent + react window lazy loading could do this work better
      for (const take of [10, 10, 20, 20]) {
        const success = await addSearchResults({
          take,
        })
        if (!success) break
      }

      // finished
      return {
        query,
        results,
        finished: true,
      }
    },
    {
      log: false,
      defaultValue: { results: [], query: '', finished: false },
    },
  )
}

export const SearchStore = createStoreContext(SearchStoreStore)
