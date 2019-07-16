import { appToListItem, createStoreContext, ensure, MarkType, react, searchBits, SearchQuery, SearchState, useActiveSpace, useAppBit, useHooks, useStoresSimple } from '@o/kit'
import { fuzzyFilter, ListItemProps } from '@o/ui'

import { appsCarouselStore } from '../pages/OrbitPage/OrbitAppsCarousel'

type SearchResults = {
  results: ListItemProps[]
  finished?: boolean
  query: string
}

class Search {
  hooks = useHooks(() => ({
    stores: useStoresSimple(),
    app: useAppBit()[0],
    space: useActiveSpace()[0],
  }))

  searchState: SearchState | null = null

  get stores() {
    return this.hooks.stores
  }

  get apps() {
    return appsCarouselStore.apps.filter(x => x.identifier !== 'bit')
  }

  setSearchState(next: SearchState) {
    this.searchState = next
  }

  get searchedQuery() {
    const query = (this.searchState && this.searchState.query) || ''
    return query[0] === '/' ? query.slice(1) : query
  }

  // updateSearchHistoryOnSearch = react(
  //   () => this.searchedQuery,
  //   async (query, _) => {
  //     ensure('has query', !!query)
  //     await _.sleep(2000)
  //     const user = await getUser()
  //     saveUser({
  //       settings: {
  //         ...user.settings,
  //         recentSearches: !user.settings!.recentSearches
  //           ? [query]
  //           : uniq([...user.settings!.recentSearches, query]).slice(0, 50),
  //       },
  //     })
  //   },
  // )

  get isChanging() {
    return this.searchState && this.searchState.query !== this.searchedQuery
  }

  hasQuery = () => {
    return !!this.searchedQuery
  }

  hasQueryVal = react(this.hasQuery, _ => _)

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

  lastState = react(
    () => this.state,
    async (next, { sleep }) => {
      await sleep(200)
      return next
    },
    {
      lazy: true,
    },
  )

  state = react(
    () => [
      this.hooks.space.id,
      this.searchedQuery,
      this.hooks.app,
      this.apps.map(x => x.id).join(' '),
      !!this.searchState,
    ],
    async ([spaceId, query, app], { sleep, when, setValue }): Promise<SearchResults> => {
      ensure('app', !!app)
      ensure('this.searchState', !!this.searchState)
      const lastResults = this.lastState ? this.lastState.results : []

      await sleep(120)

      // RESULTS
      let results: ListItemProps[] = fuzzyFilter(query, lastResults)

      // if typing, wait a bit
      const isChangingQuery = this.state.query !== query
      if (isChangingQuery) {
        // short queries we dont need to wait
        if (query.length > 3) {
          // wait for nlp to give us results
          await when(() => this.stores.queryStore!.nlpStore.nlp.query === query)
        }
      }

      // pagination
      const take = 18

      // query builder pieces
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
      let total = 0

      /** We can load pages piece by piece with this */
      async function loadMore(props: { take: number }) {
        const args: SearchQuery = {
          spaceId,
          query,
          sortBy,
          startDate,
          endDate,
          appFilters,
          peopleFilters,
          locationFilters,
          skip: total + props.take,
          take: take,
        }
        total += take
        const nextResults = await searchBits(args)
        if (!nextResults.length) {
          return false
        }
        const next: ListItemProps[] = nextResults.map(item => ({
          item,
          groupName: 'Search Results',
        }))
        results = [...results, ...next]
        console.log('results', results)
        setValue({
          results,
          query,
          finished: false,
        })
        return true
      }

      // app search
      results = this.getQuickResults(query)
      setValue({ results, query, finished: false })

      // split into chunks to avoid heavy work
      // react concurrent + react window lazy loading could do this work better
      for (const take of [10, 10, 20, 20]) {
        await loadMore({
          take,
        })
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

export const SearchStore = createStoreContext(Search)