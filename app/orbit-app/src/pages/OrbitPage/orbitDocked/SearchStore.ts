import { ensure, react } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { SearchResultModel, Bit, SearchPinnedResultModel } from '@mcro/models'
import { App } from '@mcro/stores'
import { AppsStore } from '../../../stores/AppsStore'
import { PaneManagerStore } from '../PaneManagerStore'
import { NLPStore } from './NLPStore'
import { MarkType } from './nlpStore/types'
import { QueryStore } from './QueryStore'
import { SearchFilterStore } from './SearchFilterStore'
import { SelectionGroup, SelectionStore } from './SelectionStore'
import { SettingStore } from '../../../stores/SettingStore'
import { uniq } from 'lodash'

const TYPE_DEBOUNCE = 200

type SearchState = { results: Bit[]; finished?: boolean; query: string }

export class SearchStore {
  props: {
    paneManagerStore: PaneManagerStore
    selectionStore: SelectionStore
    appsStore: AppsStore
    queryStore: QueryStore
    settingStore: SettingStore
  }

  nextRows = { startIndex: 0, endIndex: 0 }
  curFindOptions = null
  nlpStore = new NLPStore()
  searchFilterStore = new SearchFilterStore({
    queryStore: this.props.queryStore,
    appsStore: this.props.appsStore,
    nlpStore: this.nlpStore,
    searchStore: this,
  })

  willUnmount() {
    // @ts-ignore
    this.nlpStore.subscriptions.dispose()
    // @ts-ignore
    this.searchFilterStore.subscriptions.dispose()
  }

  setSelectionHandler = react(
    () => this.results && this.isActive && Math.random(),
    () => {
      ensure('is active', this.isActive)
      this.props.selectionStore.setResults(this.results)
    },
  )

  get selectedItem() {
    return this.searchState.results[this.props.selectionStore.activeIndex]
  }

  activeQuery = react(
    () => [this.isActive, App.state.query],
    ([active, query]) => {
      ensure('active', active)
      return query
    },
    {
      defaultValue: App.state.query,
      onlyUpdateIfChanged: true,
    },
  )

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

  // aggregated results for selection store
  results = react(
    () => {
      this.activeQuery
      this.quickSearchState
      this.searchState
      return Math.random()
    },
    async (_, { when, setValue }) => {
      const { activeQuery, quickSearchState, searchState } = this
      console.log('update the selection store...', activeQuery)
      // two stage so we do quick search faster
      await when(() => activeQuery === quickSearchState.query)
      let res = [
        { type: 'row', shouldAutoSelect: true, items: quickSearchState.results } as SelectionGroup,
      ]
      setValue(res)
      await when(() => activeQuery === searchState.query)
      return [
        ...res,
        { type: 'column', shouldAutoSelect: true, items: searchState.results } as SelectionGroup,
      ]
    },
  )

  get isChanging() {
    return this.searchState.query !== this.activeQuery
  }

  get isActive() {
    return this.props.paneManagerStore.activePane === 'search'
  }

  hasQuery = () => {
    return !!this.activeQuery
  }

  hasQueryVal = react(this.hasQuery, _ => _)

  searchState = react(
    () => {
      // update to query or filter changes
      App.state.query
      this.searchFilterStore.activeFilters
      this.searchFilterStore.exclusiveFilters
      this.searchFilterStore.sortBy
      this.searchFilterStore.dateState
      return Math.random()
    },
    async (_, { whenChanged, when, setValue, idle, sleep }): Promise<SearchState> => {
      const query = App.state.query
      console.log('SEARCH STATE REACT', this.isActive, query)

      // if not on this pane, delay it a bit
      if (!this.isActive) {
        await idle()
        await sleep(500)
        console.log('done now lets do something')
      }

      let results = []
      // if typing, wait a bit
      const isChangingQuery = this.searchState.query !== query
      if (isChangingQuery) {
        // if no query, we dont need to debounce or wait for nlp
        if (query) {
          // wait for nlp to give us results
          await when(() => this.nlpStore.nlp.query === query)
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
      } = this.searchFilterStore

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
        results = [...results, ...nextResults]
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

  searchResultsLength = react(
    () => this.searchState.results.length + this.quickSearchState.results.length,
    _ => _,
    {
      defaultValue: 0,
    },
  )

  hasSearchResults = react(() => !!this.searchResultsLength, _ => _, { defaultValue: false })

  // todo
  remoteRowCount = 1000

  loadMore = ({ startIndex, stopIndex }) => {
    this.nextRows = { startIndex, endIndex: stopIndex }
  }

  quickSearchState = react(
    () => this.activeQuery,
    async (query, { sleep }) => {
      await sleep(TYPE_DEBOUNCE * 0.5)
      return {
        query,
        results: await loadMany(SearchPinnedResultModel, { args: { query } }),
      }
    },
    {
      defaultValue: { query: App.state.query, results: [] },
    },
  )
}
