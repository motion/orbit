import { ensure, react, always } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { SearchResultModel, SearchResult } from '@mcro/models'
import { App } from '@mcro/stores'
import { uniq } from 'lodash'
import { MarkType } from '../../stores/QueryStore/types'
import { AppProps } from '../AppProps'
import { GetItemProps } from '../../views/VirtualList/VirtualList'

type SearchState = {
  results: SearchResult[]
  finished?: boolean
  query: string
}

export class SearchStore {
  props: AppProps

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
  get resultsForVirtualList() {
    // convert our search results into something this components expects
    const items: any[] = []
    for (let result of this.searchState.results) {
      if (result.bits.length) {
        items.push({
          id: result.id,
          title: result.title,
          text: result.text,
          group: result.group,
          count: result.bitsTotalCount,
        })
        items.push(...result.bits)
      }
    }

    return items
  }

  getItemProps: GetItemProps = index => {
    const results = this.resultsForVirtualList
    const lastGroup = results.slice(0, index - 1).filter(result => !!result.group)

    if (
      results[index].group &&
      (index === 0 ||
        (lastGroup.length > 0 && lastGroup[lastGroup.length - 1].group !== results[index].group))
    ) {
      let separator: string
      if (results[index].group === 'last-day') {
        separator = 'Last Day'
      } else if (results[index].group === 'last-week') {
        separator = 'Last Week'
      } else if (results[index].group === 'last-month') {
        separator = 'Last Month'
      } else {
        separator = 'All Period'
      }
      return { separator }
    }
    return {}
    // const model = this.searchState.results[index]
    // if (model.target) {
    //   return getAppConfig(model)
    // }
    // return {
    //   appConfig: getAppConfig(index),
    //   appType: 'search',
    // } as ItemPropsMinimum
  }

  updateSearchHistoryOnSearch = react(
    () => this.activeQuery,
    async (query, { sleep }) => {
      ensure('has query', !!query)
      await sleep(2000)
      const { settingStore } = this.props
      // init
      if (!settingStore.values.recentSearches) {
        settingStore.update({ recentSearches: [query] })
        return
      }
      const recentSearches = uniq([...settingStore.values.recentSearches, query]).slice(0, 50)
      settingStore.update({
        recentSearches,
      })
    },
  )

  setSelection = react(
    () => always(this.searchState),
    () => {
      const searchBits = this.searchState.results.reduce(
        (bits, result) => [...bits, ...result.bits],
        [],
      )
      this.props.appStore.setResults([
        {
          type: 'column',
          // shouldAutoSelect: true,
          ids: searchBits.map(x => x.id),
        },
      ])
    },
  )

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
    ],
    async ([query], { when, setValue, idle, sleep }): Promise<SearchState> => {
      // if not on this pane, delay it a bit
      if (!this.isActive) {
        await sleep(750)
        await idle()
      }

      let results: SearchResult[] = []
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
      ]
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
        const searchOpts = {
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
        results = [...results, ...nextResults]
        setValue({
          results,
          query,
          finished: false,
        })
        return true
      }

      // do initial search
      await updateNextResults({
        maxBitsCount: 5,
        group: 'last-day',
        startIndex: 0,
        endIndex: take,
      })
      await updateNextResults({
        maxBitsCount: 5,
        group: 'last-week',
        startIndex: 0,
        endIndex: take,
      })
      await updateNextResults({
        maxBitsCount: 5,
        group: 'last-month',
        startIndex: 0,
        endIndex: take,
      })
      await updateNextResults({
        maxBitsCount: 5,
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
