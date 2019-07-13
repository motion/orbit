import { appToListItem, ensure, getUser, MarkType, react, saveUser, searchBits, SearchQuery, SearchState, useActiveClientApps, useActiveSpace, useAppBit, useHooks, useSearchState, useStore, useStoresSimple } from '@o/kit'
import { FullScreen, FullScreenProps, fuzzyFilter, List, ListItemProps, SubTitle, View } from '@o/ui'
import { uniq } from 'lodash'
import React, { memo, useMemo } from 'react'

import { useAppsCarousel } from './OrbitAppsCarousel'

export const OrbitSearchResults = memo(() => {
  const carousel = useAppsCarousel()
  const searchStore = useStore(SearchStore)
  useSearchState({
    onChange: state => {
      console.log('got state', state)
      searchStore.setSearchState(state)
    },
  })
  const carouselProps: FullScreenProps = carousel.zoomedIn
    ? {
        transform: {
          rotateY: '-10deg',
          scale: 0.7,
          x: -100,
        },
      }
    : {
        transform: {
          rotateY: '7deg',
          scale: 0.9,
          x: 0,
        },
      }
  return (
    <View
      perspective="1000px"
      position="absolute"
      top="-10%"
      bottom="-10%"
      left={0}
      zIndex={1000}
      width="44%"
      transition="all ease 400ms"
      background="linear-gradient(to right, #000 15%, transparent)"
      opacity={carousel.zoomedIn ? 0 : 1}
    >
      <FullScreen
        transition="all ease 400ms"
        transformOrigin="left center"
        paddingTop="5%"
        paddingBottom="5%"
        paddingRight="10%"
        {...carouselProps}
      >
        <List
          alwaysSelected
          shareable
          selectable
          query={searchStore.searchedQuery}
          itemProps={useMemo(
            () => ({
              iconBefore: true,
              iconSize: 42,
            }),
            [],
          )}
          items={searchStore.results}
          Separator={ListSeparatorLarge}
        />
      </FullScreen>
    </View>
  )
})

function ListSeparatorLarge(props: { children: string }) {
  return (
    <View padding={[38, 8, 16]}>
      <SubTitle>{props.children}</SubTitle>
    </View>
  )
}

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

  get allApps() {
    return this.hooks.apps.map(appToListItem)
  }

  getApps(query: string, all = false): ListItemProps[] {
    if (query || all) {
      return this.allApps
    }
    return this.allApps.slice(0, 8)
  }

  getQuickResults(query: string, all = false) {
    // TODO recent history
    return fuzzyFilter(query, [...this.getApps(query, all)])
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

      await sleep(120)

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
      results = this.getQuickResults(query)
      setValue({ results, query, finished: false })

      // split into chunks to avoid heavy work
      // react concurrent + react window lazy loading could do this work better
      if (
        await loadMore({
          take: 12,
        })
      ) {
        if (
          await loadMore({
            take: 10,
          })
        ) {
          await loadMore({
            take: 100,
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
      log: false,
      defaultValue: { results: [], query: '', finished: false },
    },
  )
}
