import {
  AppBit,
  AppIcon,
  ensure,
  getUser,
  MarkType,
  OrbitListItemProps,
  react,
  saveUser,
  searchBits,
  SearchQuery,
  SearchState,
  sleep,
  SpaceIcon,
  useHook,
  useStoresSimple,
} from '@o/kit'
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

  nextRows = { startIndex: 0, endIndex: 0 }
  curFindOptions = null

  updateSearchHistoryOnSearch = react(
    () => this.activeQuery,
    async (query, { sleep }) => {
      ensure('has query', !!query)
      await sleep(2000)
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

  appToResult = (app: AppBit): OrbitListItemProps => {
    return {
      key: `${app.id}`,
      title: app.name,
      iconBefore: true,
      icon: <AppIcon app={app} />,
      group: 'Apps',
      appProps: {
        icon: `orbit-${app.identifier}-full`,
        identifier: 'message',
        title: `Open ${app.name}`,
        subTitle: 'Command: ⮐',
      },
      onOpen: () => {
        this.stores.queryStore.clearQuery()
        this.stores.paneManagerStore.setActivePane(`${app.id}`)
      },
    }
  }

  staticApps() {
    return [
      {
        id: 'settings',
        identifier: 'settings',
        name: 'Settings',
        colors: ['black', 'white'],
        target: 'app',
      },
      {
        id: 'apps',
        identifier: 'apps',
        name: 'Manage Apps',
        colors: ['black', 'white'],
        target: 'app',
      },
    ]
  }

  get isHome() {
    const { appStore } = this.stores
    return appStore && appStore.app && appStore.app.tabDisplay !== 'permanent'
  }

  getApps(query: string, all = false): OrbitListItemProps[] {
    const apps = [
      ...this.stores.spaceStore.apps.filter(x => x.tabDisplay !== 'permanent'),
      ...this.staticApps(),
    ]

    if (query) {
      return apps.map(this.appToResult)
    }

    return [
      ...apps.slice(0, all ? Infinity : 8).map(this.appToResult),
      {
        title: 'New app...',
        iconBefore: true,
        identifier: 'message',
        onOpen: async () => {
          // @ts-ignore
          this.stores.newAppStore.setShowCreateNew(true)
          await sleep(10)
          this.stores.paneManagerStore.setActivePane('createApp')
        },
      },
    ]
  }

  getQuickResults(query: string, all = false) {
    // non editable apps don't search apps, just the Home app
    if (this.isHome) {
      return []
    }

    // TODO recent history
    return [
      {
        key: 'app-home',
        title: `${this.stores.spaceStore.activeSpace.name} Home`,
        subtitle: `10 apps`,
        icon: <SpaceIcon space={this.stores.spaceStore.activeSpace} />,
        iconBefore: true,
        subType: 'home',
      },
      ...this.getApps(query, all).filter(
        x => `${x.title}`.toLowerCase().indexOf(query.toLowerCase()) === 0,
      ),
    ]
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
      } = this.searchState.queryFilters

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

      if (activeQuery[0] === '/') {
        const query = activeQuery.slice(1)
        return {
          query,
          results: this.getQuickResults(query, true),
          finished: true,
        }
      }

      // app search
      results = this.getQuickResults(activeQuery)
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
