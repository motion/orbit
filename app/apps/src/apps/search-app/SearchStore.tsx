import { loadOne, save } from '@o/bridge'
import { AppIcon, MarkType, OrbitListItemProps, searchBits, SearchState, SpaceIcon, useStoresSimple } from '@o/kit'
import { AppBit, SearchQuery, UserModel } from '@o/models'
import { ensure, react, useHook } from '@o/use-store'
import { uniq } from 'lodash'
import React from 'react'
// import { useActions } from '../../actions/Actions'

type SearchResults = {
  results: OrbitListItemProps[]
  finished?: boolean
  query: string
}

export class SearchStore {
  stores = useHook(useStoresSimple)
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
      const user = await loadOne(UserModel, {})
      save(UserModel, {
        ...user,
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
    }
  }

  appToResult = (app: AppBit) => {
    return {
      title: app.name,
      slim: true,
      iconBefore: true,
      icon: <AppIcon app={app} />,
      group: 'Apps',
      appProps: {
        icon: `orbit-${app.identifier}-full`,
        identifier: 'message',
        title: `Open ${app.name}`,
      },
      onOpen: () => {
        this.stores.paneManagerStore.setActivePane(`${app.id}`)
      },
    }
  }

  getApps(query: string): OrbitListItemProps[] {
    const { appStore } = this.stores

    // non editable apps don't search apps, just the Home app
    if (appStore && appStore.app && appStore.app.editable === true) {
      return []
    }

    const apps = this.stores.spaceStore.apps.filter(x => x.editable !== false)

    if (query) {
      return apps.map(this.appToResult)
    }

    return [
      this.homeItem,
      ...apps.slice(0, Math.min(apps.length - 1, 5)).map(this.appToResult),
      {
        title: 'Add app...',
        icon: 'orbit-custom-full',
        slim: true,
        iconBefore: true,
        identifier: 'message',
        onOpen: () => {
          console.warn('TODO restore this')
          // this.actions.setupNewApp
        },
      },
    ]
  }

  getQuickResults(query: string) {
    // TODO recent history
    return [...this.getApps(query)].filter(
      x => x.title.toLowerCase().indexOf(query.toLowerCase()) === 0,
    )
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
        const nextResults = await searchBits(args)
        if (!nextResults.length) {
          return false
        }
        results = [...results, ...nextResults]
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
