import { always, appToListItem, createUsableStore, ensure, MarkType, react, searchBits, SearchQuery, SearchState } from '@o/kit'
import { Space } from '@o/models'
import { fuzzyFilter, ListItemProps } from '@o/ui'

import { appsCarouselStore } from '../pages/OrbitPage/OrbitAppsCarouselStore'
import { queryStore } from './stores'

type SearchResults = {
  results: ListItemProps[]
  finished?: boolean
  query: string
}

class SearchStoreStore {
  searchState: SearchState | null = null

  activeSpace: Space | null = null
  setActiveSpace(space: Space) {
    this.activeSpace = space
  }

  // we sync TO here not from here
  selectedItem: ListItemProps | null = null
  setSelectedItem(next: ListItemProps) {
    this.selectedItem = next
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

  getQuickResults(query: string): ListItemProps[] {
    let results: ListItemProps[] = []

    const appsFiltered = fuzzyFilter(query, this.allApps)

    if (query.length > 0) {
      results = appsFiltered
    } else {
      const appResults = appsFiltered.slice(0, 7)
      if (appsFiltered.length > 8) {
        results = [
          ...appResults,
          {
            key: 'all-apps',
            title: `More apps (${appResults.length - appsFiltered.length})...`,
            extraData: {
              appIdentifier: 'apps',
            },
          },
        ]
      } else {
        results = appResults
      }
    }

    // TODO recent history
    return results
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
        throw new Error(`No valid key: ${JSON.stringify(item, null, 2)}`)
      })()
    )
  }

  state = react(
    () => [
      this.activeSpace ? this.activeSpace.id : undefined,
      this.query,
      always(this.apps),
      !!this.searchState,
    ],
    async ([spaceId, query], { sleep, when, setValue }): Promise<SearchResults> => {
      ensure('spaceId', !!spaceId)
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
          await when(() => queryStore.nlpStore.nlp.query === query)
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

export const SearchStore = createUsableStore(SearchStoreStore)
window['searchStore'] = SearchStore
