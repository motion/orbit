import { always, AppBit, AppIcon, ensure, getAppDefinition, getAppDefinitions, getUser, MarkType, react, saveUser, searchBits, SearchQuery, SearchState, SpaceIcon, useActiveApps, useActiveQuery, useActiveSpace, useAppBit, useHooks, useStoresSimple } from '@o/kit'
import { fuzzyFilter, ListItemProps, SimpleText } from '@o/ui'
import { uniq } from 'lodash'
import React from 'react'

type SearchResults = {
  results: ListItemProps[]
  finished?: boolean
  query: string
}

export class SearchStore {
  hooks = useHooks({
    stores: useStoresSimple,
    activeQuery: useActiveQuery,
    apps: useActiveApps,
    app: () => useAppBit()[0],
    space: () => useActiveSpace()[0],
  })

  searchState: SearchState | null = null

  get stores() {
    return this.hooks.stores
  }

  setSearchState(next: SearchState) {
    this.searchState = next
  }

  get searchedQuery() {
    return this.searchState ? this.searchState.query : ''
  }

  nextRows = { startIndex: 0, endIndex: 0 }
  curFindOptions = null

  updateSearchHistoryOnSearch = react(
    () => this.searchedQuery,
    async (query, _) => {
      ensure('has query', !!query)
      await _.sleep(2000)
      const user = await getUser()
      saveUser({
        settings: {
          ...user.settings,
          recentSearches: !user.settings.recentSearches
            ? [query]
            : uniq([...user.settings.recentSearches, query]).slice(0, 50),
        },
      })
    },
  )

  get isChanging() {
    return this.searchState && this.searchState.query !== this.searchedQuery
  }

  hasQuery = () => {
    return !!this.searchedQuery
  }

  hasQueryVal = react(this.hasQuery, _ => _)

  get homeItem() {
    return {
      title: this.hooks.space.name,
      icon: <SpaceIcon space={this.hooks.space} />,
      identifier: 'apps',
    }
  }

  appToResult = (app: AppBit, index: number): ListItemProps => {
    return {
      key: `${app.id}`,
      title: app.name,
      icon: <AppIcon identifier={app.identifier} colors={app.colors} />,
      after: (
        <SimpleText alpha={0.5} size={1.5}>
          ⌘ + {index + 2}
        </SimpleText>
      ),
      groupName: 'Apps',
      extraData: {
        id: `${app.id}`,
        identifier: 'message',
        icon: getAppDefinition(app.identifier) ? getAppDefinition(app.identifier).icon : '',
        title: `Open ${app.name}`,
        subTitle: 'Command: ⮐',
      },
    }
  }

  staticApps = react(
    () => always(this.hooks.apps),
    () => {
      console.log(getAppDefinitions())
      return []
    },
  )

  get isHome() {
    return this.hooks.app && this.hooks.app.tabDisplay === 'permanent'
  }

  get allApps() {
    return [...this.hooks.apps.filter(x => x.tabDisplay !== 'permanent'), ...this.staticApps].map(
      this.appToResult,
    )
  }

  getApps(query: string, all = false): ListItemProps[] {
    if (query || all) {
      return this.allApps
    }
    return this.allApps.slice(0, 8)
  }

  getQuickResults(query: string, all = false) {
    // non editable apps don't search apps, just the Home app
    if (this.isHome === false) {
      return []
    }

    // TODO recent history
    return fuzzyFilter(query, [...this.getApps(query, all)])
  }

  get results() {
    return this.state.results
  }

  state = react(
    () => [
      this.hooks.space.id,
      this.hooks.activeQuery,
      this.hooks.app,
      this.hooks.apps.map(x => x.id).join(' '),
    ],
    async ([spaceId, query, app], { sleep, when, setValue }): Promise<SearchResults> => {
      ensure('app', !!app)

      await sleep(120)

      // quick goto
      if (query[0] === '/') {
        const newQuery = query.slice(1)
        return {
          query: newQuery,
          results: this.getQuickResults(newQuery, true),
          finished: true,
        }
      }

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

      // pagination
      const take = 18

      // query builder pieces
      const {
        exclusiveFilters,
        activeFilters,
        activeQuery,
        dateState,
        sortBy,
      } = this.searchState.filters

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
          query: activeQuery,
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
        setValue({
          results,
          query,
          finished: false,
        })
        return true
      }

      // app search
      results = this.getQuickResults(activeQuery)
      setValue({ results, query, finished: false })

      await loadMore({
        take: 10,
      })
      await loadMore({
        take: 10,
      })
      await loadMore({
        take: 100,
      })

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
