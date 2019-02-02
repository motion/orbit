import { ensure, react } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import {
  AppType,
  IntegrationType,
  SearchQuery,
  SearchResult,
  SearchResultModel,
} from '@mcro/models'
import { useHook } from '@mcro/use-store'
import { flatten, uniq } from 'lodash'
import React from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { AppIcon } from '../views/AppIcon'
import { OrbitListItemProps } from '../views/ListItems/OrbitListItem'
import { PaneManagerStore } from './PaneManagerStore'
import { MarkType } from './QueryStore/types'

type SearchState = {
  results: OrbitListItemProps[]
  finished?: boolean
  query: string
}

const groupToName = {
  'last-day': 'Last Day',
  'last-week': 'Last Week',
  'last-month': 'Last Month',
  overall: 'Overall',
}

const searchGroupsToResults = (results: SearchResult[]) => {
  const res = results.map(result => {
    const group = groupToName[result.group]
    const max = 6
    const firstFew = result.bits.slice(0, max).map(bit => ({
      item: bit,
      group,
    }))
    const showMore =
      result.bitsTotalCount > max - 1
        ? [
            {
              title: result.title,
              subtitle: result.text,
              group,
            },
          ]
        : []
    return [...firstFew, ...showMore]
  })
  return flatten(res)
}

export class SearchStore {
  props: {
    paneManagerStore?: PaneManagerStore
  }
  stores = useHook(useStoresSafe)

  get activeQuery() {
    return this.stores.queryStore.query
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
    return this.searchState.query !== this.activeQuery
  }

  hasQuery = () => {
    return !!this.activeQuery
  }

  hasQueryVal = react(this.hasQuery, _ => _)

  get homeItem() {
    return {
      title: `Apps`,
      subtitle: `${this.stores.spaceStore.apps
        .map(x => x.name)
        .slice(0, 2)
        .join(', ')}`,
      icon: 'orbit-apps-full',
      iconBefore: true,
      type: AppType.apps,
      group: this.stores.spaceStore.activeSpace.name,
    }
  }

  getAppsResults(query: string): OrbitListItemProps[] {
    const apps = this.stores.spaceStore.apps.filter(x => x.type !== AppType.search)
    const searchedApps =
      (query && apps.filter(x => x.name.toLowerCase().indexOf(query.toLowerCase()) === 0)) || []

    const appToResult = app => {
      return {
        title: app.name,
        slim: true,
        iconBefore: true,
        icon: <AppIcon app={app} />,
        group: this.stores.spaceStore.activeSpace.name,
        appConfig: {
          type: AppType.message,
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

    return [this.homeItem, ...apps.slice(0, 2).map(appToResult)]
  }

  private getQuickResults(query: string) {
    // TODO recent history
    return [...this.getAppsResults(query)]
  }

  searchState = react(
    () => [
      this.stores.spaceStore.activeSpace.id,
      this.stores.queryStore.query,
      this.queryFilters.activeFilters,
      this.queryFilters.exclusiveFilters,
      this.queryFilters.sortBy,
      this.queryFilters.dateState,
      this.stores.spaceStore.apps.map(x => x.id).join(' '),
    ],
    async ([spaceId, query], { when, setValue }): Promise<SearchState> => {
      if (this.props.paneManagerStore) {
        console.log('wait...', this.props.paneManagerStore.activePane.type === 'search')
        await when(() => this.props.paneManagerStore.activePane.type === 'search')
        console.log('wait...', this.props.paneManagerStore.activePane.type === 'search')
      }

      // RESULTS
      let results: OrbitListItemProps[] = []

      // if typing, wait a bit
      const isChangingQuery = this.searchState.query !== query
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

      const integrationFilters = [
        // these come from the text string
        ...activeFilters.filter(x => x.type === MarkType.Integration).map(x => x.text),
        // these come from the button bar
        ...Object.keys(exclusiveFilters).filter(x => exclusiveFilters[x]),
      ] as IntegrationType[]

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
          integrationFilters,
          peopleFilters,
          locationFilters,
          group,
          maxBitsCount,
          skip: startIndex,
          take: Math.max(0, endIndex - startIndex),
        }
        const nextResults = await loadMany(SearchResultModel, { args })
        if (!nextResults) {
          return false
        }
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
