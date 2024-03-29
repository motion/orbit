import { appToListItem, ensure, MarkType, react, searchBits, SearchQuery, SearchState, useActiveClientApps, useActiveSpace, useAppBit, useHooks, useStoresSimple } from '@o/kit'
import { ListItemProps } from '@o/ui'

type SearchResults = {
  results: ListItemProps[]
  finished?: boolean
  query: string
}

export class SearchStore {
  hooks = useHooks(() => ({
    stores: useStoresSimple(),
    apps: useActiveClientApps(),
    app: useAppBit()[0],
    space: useActiveSpace()[0],
  }))

  searchState: SearchState | null = null

  get stores() {
    return this.hooks.stores
  }

  setSearchState(next: SearchState) {
    this.searchState = next
  }

  get searchedQuery() {
    return this.searchState ? this.searchState.query.replace('/', '') : ''
  }

  get isChanging() {
    return this.searchState && this.searchState.query !== this.searchedQuery
  }

  hasQuery = () => {
    return !!this.searchedQuery
  }

  get allApps() {
    return this.hooks.apps.map(appToListItem)
  }

  get results() {
    return this.state.results
  }

  state = react(
    () => [
      this.hooks.space.id,
      this.searchedQuery,
      this.hooks.app,
      this.hooks.apps.map(x => x.id).join(' '),
      !!this.searchState,
    ],
    async ([spaceId, query, app], { sleep, when, setValue }): Promise<SearchResults> => {
      ensure('app', !!app)
      ensure('this.searchState', !!this.searchState)

      await sleep(100)

      // RESULTS
      let results: ListItemProps[] = []

      // if typing, wait a bit
      const isChangingQuery = this.state.query !== query
      if (isChangingQuery) {
        // short queries we dont need to wait
        if (query.length > 3) {
          // wait for nlp to give us results
          await when(() => this.stores.queryStore.nlpStore.nlp.query === query)
        }
      }

      // query builder pieces
      const { exclusiveFilters, activeFilters, dateState, sortBy } = this.searchState.filters

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

      const loadMore = async props => {
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
          take: props.take,
        }
        total += props.take
        const nextResults = await searchBits(args)
        if (!nextResults.length) {
          return false
        }
        const next: ListItemProps[] = nextResults.map(item => ({
          item,
          groupName: 'Search Results',
        }))
        results = [...results, ...next]
        setValue({
          results,
          query,
          finished: false,
        })
        return true
      }

      // split into chunks to avoid heavy work
      // react concurrent + react window lazy loading could do this work better
      if (
        await loadMore({
          take: 8,
        })
      ) {
        if (
          await loadMore({
            take: 10,
          })
        ) {
          await loadMore({
            take: 50,
          })
        }
      }

      // finished
      return {
        query,
        results,
        finished: true,
      }
    },
    {
      // log: false,
      defaultValue: { results: [], query: '', finished: false },
    },
  )
}
