import {
  AppBit,
  AppIcon,
  ensure,
  getUser,
  MarkType,
  react,
  saveUser,
  searchBits,
  SearchQuery,
  SearchState,
  SpaceIcon,
  useHook,
  useStoresSimple,
} from '@o/kit'
import { fuzzyFilter, ListItemProps } from '@o/ui'
import { uniq } from 'lodash'
import React from 'react'

// import { useActions } from '../../actions/Actions'

const itemProps = {
  iconBefore: true,
  iconSize: 42,
}

type SearchResults = {
  results: ListItemProps[]
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
      ...itemProps,
      identifier: 'apps',
    }
  }

  appToResult = (app: AppBit): ListItemProps => {
    return {
      key: `${app.id}`,
      title: app.name,
      ...itemProps,
      icon: <AppIcon app={app} />,
      group: 'Apps',
      extraData: {
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

  staticApps(): AppBit[] {
    return [
      {
        identifier: 'settings',
        name: 'Settings',
        colors: ['black', 'white'],
        target: 'app',
      },
      {
        identifier: 'apps',
        name: 'Manage Apps',
        colors: ['black', 'white'],
        target: 'app',
      },
    ]
  }

  get isHome() {
    const { appStore } = this.stores
    return appStore && appStore.app && appStore.app.tabDisplay === 'permanent'
  }

  getApps(query: string, all = false): ListItemProps[] {
    const apps = [
      ...this.stores.spaceStore.apps.filter(x => x.tabDisplay !== 'permanent'),
      ...this.staticApps(),
    ]
    if (query) {
      return apps.map(x => this.appToResult(x))
    }
    return [...apps.slice(0, all ? Infinity : 8)].map(x => this.appToResult(x))
  }

  getQuickResults(query: string, all = false) {
    // non editable apps don't search apps, just the Home app
    if (this.isHome === false) {
      return []
    }

    // TODO recent history
    return fuzzyFilter(query, [
      // {
      //   key: 'app-home',
      //   title: `${this.stores.spaceStore.activeSpace.name} Home`,
      //   subTitle: `10 apps`,
      //   icon: <SpaceIcon space={this.stores.spaceStore.activeSpace} />,
      //   ...itemProps,
      //   subType: 'home',
      // },
      ...this.getApps(query, all),
    ])
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
    async ([spaceId, query, app], { sleep, when, setValue }): Promise<SearchResults> => {
      ensure('app', !!app)

      if (this.stores.paneManagerStore) {
        await when(() => this.stores.paneManagerStore.activePane.type === 'search')
      }

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
        // todo fix type
        results = [
          ...results,
          ...nextResults.map(item => ({ item, group: 'Search Results', ...itemProps })),
        ]
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

      try {
        await loadMore({
          take: 10,
        })
        await loadMore({
          take: 10,
        })
        await loadMore({
          take: 100,
        })
      } catch (err) {
        if (err !== false) {
          console.error(err)
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
      defaultValue: { results: [], query: '', finished: false },
    },
  )
}
