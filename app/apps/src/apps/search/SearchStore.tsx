import { loadMany } from '@mcro/bridge'
import { AppIcon, MarkType, OrbitListItemProps, SearchState, SpaceIcon, useStoresSimple } from '@mcro/kit'
import { AppBit, SearchQuery, SearchResultModel } from '@mcro/models'
import { ensure, react, useHook } from '@mcro/use-store'
import { uniq } from 'lodash'
import React from 'react'
// import { useActions } from '../../actions/Actions'
import { searchGroupsToResults } from './searchGroupsToResults'

type SearchResults = {
  results: OrbitListItemProps[]
  finished?: boolean
  query: string
}

export class SearchStore {
  stores = useHook(useStoresSimple)
  // actions = useHook(useActions)
  searchState: SearchState | null = null

  setSearchState(next: SearchState) {
    this.searchState = next
  }

  get activeQuery() {
    return this.searchState ? this.searchState.query : ''
  }

  get queryFilters() {
    return this.stores.queryStore.queryFilters
  }

  nextRows = { startIndex: 0, endIndex: 0 }
  curFindOptions = null

  updateSearchHistoryOnSearch = react(
    () => this.activeQuery,
    async (query, { sleep }) => {
      ensure('has query', !!query)
      await sleep(2000)
      const { settingStore } = this.stores
      // init
      if (!settingStore.values) {
        return
      }
      if (!settingStore.values.recentSearches) {
        settingStore.update({ recentSearches: [query] })
        return
      }
      const recentSearches = uniq([...settingStore.values.recentSearches, query]).slice(0, 50)
      // TODO need to have recently opened as well so we can use that for search
      settingStore.update({
        recentSearches,
      })
    },
  )

  get isChanging() {
    return this.searchState && this.searchState.query !== this.activeQuery
  }

  hasQuery = () => {
    return !!this.activeQuery
  }

  hasQueryVal = react(this.hasQuery, _ => _)

  get homeItem() {
    return {
      title: this.stores.spaceStore.activeSpace.name,
      icon: <SpaceIcon space={this.stores.spaceStore.activeSpace} />,
      iconBefore: true,
      identifier: 'apps',
      group: 'Home',
    }
  }

  getApps(query: string): OrbitListItemProps[] {
    // only show apps search results when on home
    const { appStore } = this.stores
    if (appStore && appStore.app && appStore.app['pinned'] !== true) {
      console.warn('this should check editable but its not being set in ensureModels')
      return []
    }

    // const spaceName = this.stores.spaceStore.activeSpace.name
    const apps = this.stores.spaceStore.apps.filter(x => x.editable !== false)
    const searchedApps =
      (query && apps.filter(x => ~x.name.toLowerCase().indexOf(query.toLowerCase()))) || []

    const appToResult = (app: AppBit) => {
      return {
        title: app.name,
        slim: true,
        iconBefore: true,
        icon: <AppIcon app={app} />,
        group: 'Apps',
        appConfig: {
          icon: `orbit-${app.identifier}-full`,
          identifier: 'message',
          title: `Open ${app.name}`,
        },
        onOpen: () => {
          this.stores.paneManagerStore.setActivePane(`${app.id}`)
        },
      }
    }

    if (query) {
      return searchedApps.map(appToResult)
    }

    return [
      this.homeItem,
      ...apps.slice(0, Math.min(apps.length - 1, 5)).map(appToResult),
      {
        title: 'Create new app...',
        icon: 'orbit-custom-full',
        slim: true,
        iconBefore: true,
        // group: 'Home',
        appConfig: {
          identifier: 'message',
          title: `Create new app`,
        },
        onOpen: () => {
          console.warn('TODO restore this')
          // this.actions.setupNewApp
        },
      },
    ]
  }

  getQuickResults(query: string) {
    // TODO recent history
    return [...this.getApps(query)]
  }

  get results() {
    return this.state.results
  }

  state = react(
    () => [
      this.stores.spaceStore.activeSpace.id,
      this.activeQuery,
      this.stores.appStore.app,
      this.stores.spaceStore.apps.map(x => x.id).join(' '),
    ],
    async ([spaceId, query, app], { when, setValue }): Promise<SearchResults> => {
      ensure('app', !!app)

      if (this.stores.paneManagerStore) {
        await when(() => this.stores.paneManagerStore.activePane.type === 'search')
      }

      // RESULTS
      let results: OrbitListItemProps[] = []

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
        searchBy,
      } = this.queryFilters

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

      const updateNextResults = async ({ maxBitsCount, group, startIndex, endIndex }) => {
        const args: SearchQuery = {
          spaceId,
          query: activeQuery,
          searchBy,
          sortBy,
          startDate,
          endDate,
          appFilters,
          peopleFilters,
          locationFilters,
          group,
          maxBitsCount,
          skip: startIndex,
          take: Math.max(0, endIndex - startIndex),
        }
        const nextResults = await loadMany(SearchResultModel, { args })
        results = [...results, ...searchGroupsToResults(nextResults)]
        setValue({
          results,
          query,
          finished: false,
        })
        return true
      }

      // app search
      results = [...this.getQuickResults(activeQuery)]
      setValue({ results, query, finished: false })

      await updateNextResults({
        maxBitsCount: 2,
        group: 'last-day',
        startIndex: 0,
        endIndex: take,
      })
      await updateNextResults({
        maxBitsCount: 2,
        group: 'last-week',
        startIndex: 0,
        endIndex: take,
      })
      await updateNextResults({
        maxBitsCount: 2,
        group: 'last-month',
        startIndex: 0,
        endIndex: take,
      })
      await updateNextResults({
        maxBitsCount: 100,
        group: 'overall',
        startIndex: 0,
        endIndex: take,
      })

      // finished
      return {
        query,
        results,
        finished: true,
      }
    },
    {
      defaultValue: { results: [], query: '', finished: false },
    },
  )
}
