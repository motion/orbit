import { ensure, react } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { SearchResultModel, Bit } from '@mcro/models'
import { App } from '@mcro/stores'
import { uniq } from 'lodash'
import { MarkType } from '../../stores/QueryStore/types'
import { AppProps } from '../AppProps'
import { GetItemProps } from '../../views/VirtualList/VirtualList'

type SearchState = { results: Bit[]; finished?: boolean; query: string }

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

  getItemProps: GetItemProps = index => {
    if (!index || index % 5 === 0) {
      return {
        separator: 'This Week',
      }
    }
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
    () => this.searchState && Math.random(),
    () => {
      this.props.appStore.setResults([
        {
          type: 'column',
          // shouldAutoSelect: true,
          ids: this.searchState.results.map(x => x.id),
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
      App.state.query,
      this.queryFilters.activeFilters,
      this.queryFilters.exclusiveFilters,
      this.queryFilters.sortBy,
      this.queryFilters.dateState,
    ],
    async (_, { whenChanged, when, setValue, idle, sleep }): Promise<SearchState> => {
      const query = App.state.query

      // if not on this pane, delay it a bit
      if (!this.isActive) {
        await sleep(750)
        await idle()
      }

      let results = []
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
        query: activeQuery,
        searchBy,
        sortBy,
        startDate,
        endDate,
        integrationFilters,
        peopleFilters,
        locationFilters,
      }

      const updateNextResults = async ({ startIndex, endIndex }) => {
        const searchOpts = {
          ...baseFindOptions,
          skip: startIndex,
          take: Math.max(0, endIndex - startIndex),
        }
        const nextResults = await loadMany(SearchResultModel, { args: searchOpts })
        if (!nextResults) {
          return false
        }
        results = [
          ...results,
          { type: 'summary', title: 'Something', body: 'Lorem ipsum' },
          ...nextResults,
        ]
        setValue({
          results,
          query,
          finished: false,
        })
        return true
      }

      // do initial search
      await updateNextResults({ startIndex: 0, endIndex: take })

      // wait for active before loading more than one page of results
      if (!this.isActive) {
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

  get quickResultsOffset() {
    return 0
  }

  // todo
  remoteRowCount = 1000

  loadMore = ({ startIndex, stopIndex }) => {
    this.nextRows = { startIndex, endIndex: stopIndex }
  }
}
