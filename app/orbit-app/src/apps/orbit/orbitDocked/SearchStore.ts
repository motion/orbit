import { ensure, react } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { PersonBitModel, SearchResultModel, Bit } from '@mcro/models'
import { App } from '@mcro/stores'
import { flatten, uniqBy } from 'lodash'
import { matchSort } from '../../../stores/helpers/searchStoreHelpers'
import { AppsStore } from '../../AppsStore'
import { PaneManagerStore } from '../PaneManagerStore'
import { NLPStore } from './NLPStore'
import { MarkType } from './nlpStore/types'
import { QueryStore } from './QueryStore'
import { SearchFilterStore } from './SearchFilterStore'
import { SelectionGroup, SelectionStore } from './SelectionStore'

const TYPE_DEBOUNCE = 200

export class SearchStore {
  props: {
    paneManagerStore: PaneManagerStore
    selectionStore: SelectionStore
    appsStore: AppsStore
    queryStore: QueryStore
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
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', isActive)
      this.props.selectionStore.setResults(this.results)
    },
  )

  setActivePaneOnChangeQuery = react(
    () => !!App.state.query,
    query => {
      if (!query) {
        this.props.paneManagerStore.setActivePane('home')
      } else {
        this.props.paneManagerStore.setActivePane('search')
      }
    },
  )

  setActivePaneToSearchOnIntegrationFilters = react(
    () => this.searchFilterStore.hasIntegrationFilters,
    hasIntegrationFilters => {
      console.log('hasIntegrationFilters', hasIntegrationFilters)
      ensure('hasIntegrationFilters', hasIntegrationFilters)
      this.props.paneManagerStore.setActivePane('search')
    },
  )

  get activeQuery() {
    return App.state.query
  }

  // aggregated results for selection store
  results = react(
    () => [this.activeQuery, this.quickSearchState, this.searchState],
    async ([query, quickState, searchState], { when }) => {
      await when(() => query === quickState.query && query === searchState.query)
      return [
        { type: 'row', items: quickState.results },
        { type: 'column', items: searchState.results },
      ] as SelectionGroup[]
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
    () => [
      this.activeQuery,
      // filter updates
      this.searchFilterStore.activeFilters,
      this.searchFilterStore.exclusiveFilters,
      this.searchFilterStore.sortBy,
      this.searchFilterStore.dateState,
    ],
    async (
      [query],
      { sleep, whenChanged, when, setValue },
    ): Promise<{ results: Bit[]; finished?: boolean; query: string }> => {
      let results = []
      // if typing, wait a bit
      if (this.searchState.query !== query) {
        // debounce a little for fast typer
        await sleep(TYPE_DEBOUNCE)
        // wait for nlp to give us results
        await when(() => this.nlpStore.nlp.query === query)
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
        console.log('loading rows from', startIndex, endIndex)
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

  // todo
  remoteRowCount = 1000

  loadMore = ({ startIndex, endIndex }) => {
    this.nextRows = { startIndex, endIndex }
  }

  isRowLoaded = ({ index }) => {
    return index < this.searchState.results.length
  }

  quickSearchState = react(
    () => this.activeQuery,
    async (query, { sleep, when }) => {
      if (!query) {
        return {
          query,
          results: await loadMany(PersonBitModel, { args: { take: 6 } }),
        }
      }
      // slightly faster for quick search
      await sleep(TYPE_DEBOUNCE * 0.5)
      await when(() => this.nlpStore.nlp.query === query)
      const { people, searchQuery, integrations /* , nouns */ } = this.nlpStore.nlp
      // fuzzy people results
      const peopleRes = await loadMany(PersonBitModel, {
        args: {
          take: 6,
          // @ts-ignore
          where: [...people, ...query.split(' ')].map(name => ({
            name: { $like: `%${name.split(' ').join('%')}%` },
          })),
        },
      })
      // @ts-ignore
      const peopleResUniq = uniqBy(peopleRes, x => x.name)
      const results = flatten([
        integrations.map(name => ({ name, icon: name })),
        ...matchSort(searchQuery, peopleResUniq),
      ]).filter(Boolean)
      return {
        query,
        results,
      }
    },
    {
      defaultValue: { results: [] },
    },
  )
}
