import { ensure, react } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { PersonBitModel, SearchResultModel } from '@mcro/models'
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

  loadMoreAmount = 0
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
    return this.props.paneManagerStore.activePane === 'home' && this.hasQueryVal
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
    async ([query], { sleep, whenChanged, when, setValue }) => {
      if (!query) {
        return {
          query,
          results: [],
          finished: true,
        }
      }

      let results
      let channelResults
      let message
      // do stuff to prepare for getting results...
      const isFilteringSlack = query[0] === '#'
      const isFilteringChannel = isFilteringSlack && query.indexOf(' ') === -1
      if (isFilteringSlack) {
        channelResults = matchSort(
          query.split(' ')[0],
          /*this.props.appsStore.services.slack.activeChannels*/[].map(channel => ({
            // todo: broken by umed, please fix me
            id: channel.id,
            title: `#${channel.name}`,
            icon: 'slack',
          })),
        )
      }
      if (isFilteringSlack && !isFilteringChannel) {
        message = `Searching ${channelResults[0].title}`
      }
      // filtered search
      if (isFilteringChannel /* && this.props.appsStore.services.slack*/) {
        // todo: broken by umed, please fix me
        message = 'SPACE to search selected channel'
        results = channelResults
        return {
          query,
          message,
          results,
        }
      }

      // regular search

      results = []
      // if typing, wait a bit
      if (this.searchState.query !== query) {
        // debounce a little for fast typer
        await sleep(TYPE_DEBOUNCE)
        // wait for nlp to give us results
        await when(() => this.nlpStore.nlp.query === query)
      }

      // pagination
      let skip = 0
      const take = 12
      // initial search results max amt:
      const takeMax = take
      const sleepBtwn = 80

      // query builder pieces
      const {
        exclusiveFilters,
        activeFilters,
        activeQuery,
        dateState,
        sortBy,
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
        sortBy,
        startDate,
        endDate,
        integrationFilters,
        peopleFilters,
        locationFilters,
      }

      const updateNextResults = async skip => {
        const searchOpts = {
          ...baseFindOptions,
          skip,
          take,
        }
        console.log('Send command', searchOpts)
        const nextResults = await loadMany(SearchResultModel, { args: searchOpts })
        console.log('got next results', searchOpts, nextResults)
        if (!nextResults) {
          return false
        }
        results = [...results, ...nextResults]
        setValue({
          results,
          query,
        })
        return true
      }

      // do initial search
      for (let i = 0; i < takeMax / take; i += 1) {
        skip = i * take
        const updated = await updateNextResults(skip)
        if (!updated) {
          break
        }
        // get next page results
        await sleep(sleepBtwn)
      }

      // infinite scroll
      this.loadMoreAmount = 0
      while (true) {
        // wait for load more event
        await whenChanged(() => this.loadMoreAmount)
        skip += take
        const updated = await updateNextResults(skip)
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

  loadMore = () => {
    this.loadMoreAmount++
  }

  quickSearchState = react(
    () => App.state.query,
    async (query, { sleep, when }) => {
      ensure('query', !!query)
      // slightly faster for quick search
      await sleep(TYPE_DEBOUNCE * 0.5)
      await when(() => this.nlpStore.nlp.query === query)
      const { people, searchQuery, integrations /* , nouns */ } = this.nlpStore.nlp
      console.log('----------', people, query)
      // fuzzy people results
      const peopleRes = await loadMany(PersonBitModel, {
        args: {
          take: 6,
          // @ts-ignore
          where: [...people, ...query.split(' ')].map(name => ({
            name: { $like: `%${name.split(' ').join('%')}%` },
          }))
        },
      })
      console.log('>>>>>>>>>>>>>', peopleRes)
      // @ts-ignore
      const peopleResUniq = uniqBy(peopleRes, x => x.name)
      console.log('quick - peopleResUniq', peopleResUniq)
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
