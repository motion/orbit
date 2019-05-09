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
  useActiveApp,
  useHooks,
  useStoresSimple,
} from '@o/kit'
import { Space } from '@o/models'
import { fuzzyFilter, ListItemProps, SimpleText } from '@o/ui'
import { uniq } from 'lodash'
import React from 'react'

type SearchResults = {
  results: ListItemProps[]
  finished?: boolean
  query: string
}

export class SearchStore {
  props: {
    apps: AppBit[]
    space: Space
  }

  hooks = useHooks({
    stores: useStoresSimple,
    activeApp: useActiveApp,
  })

  searchState: SearchState | null = null

  get stores() {
    return this.hooks.stores
  }

  get activeApp() {
    return this.hooks.activeApp
  }

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
      title: this.props.space.name,
      icon: <SpaceIcon space={this.props.space} />,
      identifier: 'apps',
    }
  }

  appToResult = (app: AppBit, index: number): ListItemProps => {
    return {
      key: `${app.id}`,
      title: app.name,
      icon: <AppIcon app={app} />,
      after: (
        <SimpleText alpha={0.5} size={1.5}>
          ⌘ + {index + 2}
        </SimpleText>
      ),
      group: 'Apps',
      extraData: {
        id: `${app.id}`,
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
    return this.activeApp && this.activeApp.tabDisplay === 'permanent'
  }

  get allApps() {
    return [...this.props.apps.filter(x => x.tabDisplay !== 'permanent'), ...this.staticApps()].map(
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
    return fuzzyFilter(query, [
      // {
      //   key: 'app-home',
      //   title: `${this.stores.spaceStore.activeSpace.name} Home`,
      //   subTitle: `10 apps`,
      //   icon: <SpaceIcon space={this.stores.spaceStore.activeSpace} />,
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
      this.props.space.id,
      this.activeQuery,
      this.activeApp,
      this.props.apps.map(x => x.id).join(' '),
    ],
    async ([spaceId, query, app], { sleep, when, setValue }): Promise<SearchResults> => {
      console.log('got app', app)
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
        results = [...results, ...nextResults.map(item => ({ item, group: 'Search Results' }))]
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
