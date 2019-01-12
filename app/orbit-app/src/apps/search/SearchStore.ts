import { ensure, react, always } from '@mcro/black'
import { loadMany, observeMany } from '@mcro/model-bridge'
import {
  SearchResultModel,
  SearchQuery,
  IntegrationType,
  AppModel,
  SearchResult,
  AppType,
} from '@mcro/models'
import { uniq, flatten } from 'lodash'
import { MarkType } from '../../stores/QueryStore/types'
import { AppProps } from '../AppProps'
import { fuzzyQueryFilter } from '../../helpers'
import { OrbitItemProps } from '../../views/ListItems/OrbitItemProps'
import { normalizeItem } from '../../helpers/normalizeItem'

type SearchState = {
  results: OrbitItemProps<any>[]
  finished?: boolean
  query: string
}

const groupToName = {
  'last-day': 'Last Day',
  'last-week': 'Last Week',
  'last-month': 'Last Month',
  overall: 'Overall',
}

const searchGroupsToResults = (results: SearchResult[]): OrbitItemProps<any>[] => {
  const res = results.map(result => {
    const group = groupToName[result.group]
    const firstFew = result.bits.slice(0, 4).map(bit => ({
      ...normalizeItem(bit),
      group,
    }))
    const showMore =
      result.bitsTotalCount > 3
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

  get activeQuery() {
    return this.props.appStore.activeQuery
  }

  get isActive() {
    return this.props.appStore.isActive
  }

  get queryFilters() {
    return this.props.appStore.queryFilters
  }

  nextRows = { startIndex: 0, endIndex: 0 }
  curFindOptions = null

  get selectedItem() {
    return this.searchState.results[this.props.appStore.activeIndex]
  }

  /**
   * Virtual list has its own format of data representation, so convert our data to that format here.
   * Ideally we need to use our format in there, but if it is generic component we can use transformation as well.
   */
  // get resultsForVirtualList(): SearchResult[] {
  //   // convert our search results into something this components expects
  //   const items: { [group: string]: [any[], any[]] } = {}
  //   for (let result of this.searchState.results) {
  //     if (result.bits.length) {
  //       if (!items[result.group]) {
  //         items[result.group] = [[], []]
  //       }
  //       items[result.group][0].push(
  //         ...result.bits.map(bit => {
  //           return { ...bit, group: result.group }
  //         }),
  //       )
  //       items[result.group][1].push({
  //         target: 'search-group',
  //         id: result.id,
  //         title: result.title,
  //         text: result.text,
  //         group: result.group,
  //         count: result.bitsTotalCount,
  //       })
  //     }
  //   }

  //   return Object.keys(items).reduce((all, group) => {
  //     const [bits, subGroups] = items[group]
  //     all.push(...bits)
  //     all.push(...subGroups)
  //     return all
  //   }, [])
  // }

  updateSearchHistoryOnSearch = react(
    () => this.activeQuery,
    async (query, { sleep }) => {
      ensure('has query', !!query)
      await sleep(2000)
      const { settingStore } = this.props
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

  // setSelection = react(
  //   () => always(this.searchState),
  //   () => {
  //     const searchBits = this.searchState.results.reduce(
  //       (bits, result) => [...bits, ...result.bits],
  //       [],
  //     )
  //     this.props.appStore.setResults([
  //       {
  //         type: 'column',
  //         // shouldAutoSelect: true,
  //         indices: searchBits.map((_, index) => index),
  //       },
  //     ])
  //   },
  // )

  get isChanging() {
    return this.searchState.query !== this.activeQuery
  }

  hasQuery = () => {
    return !!this.activeQuery
  }

  hasQueryVal = react(this.hasQuery, _ => _)

  searchState = react(
    () => [
      this.props.appStore.activeQuery,
      this.queryFilters.activeFilters,
      this.queryFilters.exclusiveFilters,
      this.queryFilters.sortBy,
      this.queryFilters.dateState,
      always(this.props.spaceStore.apps),
    ],
    async ([query], { when, setValue, idle, sleep }): Promise<SearchState> => {
      // if not on this pane, delay it a bit
      if (!this.isActive) {
        await sleep(750)
        await idle()
      }

      // RESULTS
      let results: OrbitItemProps<any>[] = []

      // if typing, wait a bit
      const isChangingQuery = this.searchState.query !== query
      if (isChangingQuery) {
        // if no query, we dont need to debounce or wait for nlp
        if (query) {
          // wait for nlp to give us results
          await when(() => this.props.appStore.nlp.query === query)
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
      const baseFindOptions = {
        spaceId: 1, // todo: how do we can space id from store here?
        query: activeQuery,
        searchBy,
        sortBy,
        startDate,
        endDate,
        integrationFilters,
        peopleFilters,
        locationFilters,
      }

      const updateNextResults = async ({ maxBitsCount, group, startIndex, endIndex }) => {
        const searchOpts: SearchQuery = {
          ...baseFindOptions,
          group,
          maxBitsCount,
          skip: startIndex,
          take: Math.max(0, endIndex - startIndex),
        }
        const nextResults = await loadMany(SearchResultModel, { args: searchOpts })
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
      results = [
        ...fuzzyQueryFilter(
          activeQuery,
          this.props.spaceStore.apps.filter(x => x.type !== AppType.search),
          {
            key: 'name',
          },
        ).map(app => ({
          group: 'Apps',
          title: app.name,
          icon: app.type,
          appConfig: {
            id: '0',
            title: '',
            type: AppType.message,
          },
          onOpen: () => {
            console.log('selecting app...', app.type, app.id)
            this.props.paneManagerStore.setActivePane(app.id)
          },
        })),
      ]
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
