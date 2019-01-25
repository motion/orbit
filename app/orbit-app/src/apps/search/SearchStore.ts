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
import { capitalize, flatten, uniq } from 'lodash'
import { fuzzyQueryFilter } from '../../helpers'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { MarkType } from '../../stores/QueryStore/types'
import { OrbitListItemProps } from '../../views/ListItems/OrbitListItem'
import { AppProps } from '../AppProps'

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
  props: AppProps<AppType.search>
  stores = useHook(useStoresSafe)

  get activeQuery() {
    return this.stores.appStore.activeQuery
  }

  get isActive() {
    return this.stores.appStore.isActive
  }

  get queryFilters() {
    return this.stores.appStore.queryFilters
  }

  nextRows = { startIndex: 0, endIndex: 0 }
  curFindOptions = null

  get selectedItem() {
    return this.searchState.results[this.stores.appStore.activeIndex]
  }

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

  getAppsResults(query: string) {
    const apps = fuzzyQueryFilter(
      query,
      this.stores.spaceStore.apps.filter(x => x.type !== AppType.search),
      {
        key: 'name',
      },
    ).map(app => {
      const icon = `orbit${capitalize(app.type)}`
      return {
        group: 'Apps',
        title: app.name,
        icon,
        type: AppType.message,
        titleProps: null,
        appConfig: {
          title: `Open ${app.name}`,
          icon: null,
        },
        onOpen: () => {
          console.log('selecting app...', app.type, app.id)
          this.stores.paneManagerStore.setActivePane(app.id)
        },
      }
    })

    // TODO show only if they have more apps
    // TODO count how many apps
    if (apps.length) {
      apps.push({
        group: 'Apps',
        title: 'All apps...',
        icon: null,
        titleProps: {
          fontWeight: 300,
        },
        type: AppType.message,
        appConfig: {
          title: 'All apps',
          icon: 'grid48',
        },
        onOpen: () => {
          this.stores.paneManagerStore.setActivePaneByType('apps')
        },
      })
    }

    return apps
  }

  private getQuickResults(query: string) {
    return [...this.getAppsResults(query)]
  }

  searchState = react(
    () => [
      this.stores.spaceStore.activeSpace.id,
      this.stores.appStore.activeQuery,
      this.queryFilters.activeFilters,
      this.queryFilters.exclusiveFilters,
      this.queryFilters.sortBy,
      this.queryFilters.dateState,
      this.stores.spaceStore.apps.map(x => x.id).join(' '),
    ],
    async ([spaceId, query], { when, setValue }): Promise<SearchState> => {
      // RESULTS
      let results: OrbitListItemProps[] = []

      // if typing, wait a bit
      const isChangingQuery = this.searchState.query !== query
      if (isChangingQuery) {
        // short queries we dont need to wait
        if (query.length > 3) {
          // wait for nlp to give us results
          await when(() => this.stores.appStore.nlp.query === query)
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
        maxBitsCount: 2,
        group: 'overall',
        startIndex: 0,
        endIndex: take,
      })

      // wait for active before loading more than one page of results
      /* if (!this.isActive) {
        await when(() => this.isActive)
      }

      // infinite scroll
      this.nextRows = null
      while (true) {
        // wait for load more event
        await whenChanged(() => this.nextRows)
        const updated = await updateNextResults(this.nextRows)
        if (!updated) {
          break
        }
      } */

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

  get quickResultsOffset() {
    return 0
  }

  // todo
  // I don't think someone is going to scroll more than 1000 items? Or even 100...
  remoteRowCount = 1000

  loadMore = ({ startIndex, stopIndex }) => {
    this.nextRows = { startIndex, endIndex: stopIndex }
  }
}
