import { PaneManagerStore } from '../apps/orbit/PaneManagerStore'
import { App } from '@mcro/stores'
import { react, ensure } from '@mcro/black'
import { NLPStore } from './NLPStore'
import { SearchFilterStore } from './SearchFilterStore'
import { AppStore } from './AppStore'
import { Bit } from '@mcro/models'
import { matchSort } from './helpers/searchStoreHelpers'
import { MarkType } from './nlpStore/types'
import { FindOptions } from 'typeorm'
import { BitRepository, PersonRepository } from '../repositories'
import { flatten } from 'lodash'
import { SelectionStore } from './SelectionStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { QueryStore } from './QueryStore'

const TYPE_DEBOUNCE = 200

const getSearchResults = async ({
  query,
  sortBy,
  take,
  skip,
  startDate,
  endDate,
  integrationFilters,
  peopleFilters,
}) => {
  const findOptions: FindOptions<Bit> = {
    where: [],
    relations: {
      people: true,
      author: true,
    },
    take,
    skip,
  }

  const andConditions: any = {}
  if (startDate) {
    andConditions.bitCreatedAt = { $moreThan: startDate.getTime() }
  }
  if (endDate) {
    andConditions.bitCreatedAt = { $lessThan: endDate.getTime() }
  }
  if (integrationFilters && integrationFilters.length) {
    andConditions.integration = { $in: integrationFilters }
  }

  if (query.length) {
    const likeString = `%${query.replace(/\s+/g, '%')}%`
    findOptions.where.push({
      ...andConditions,
      title: { $like: likeString },
    })
    findOptions.where.push({
      ...andConditions,
      body: { $like: likeString },
    })
  }

  // SORT
  if (sortBy) {
    switch (sortBy) {
      case 'Relevant':
        // TODO: i think it is this by default
        // once we do sprint on better search/hsf5 we can maybe make better
        break
      case 'Recent':
        findOptions.order = {
          bitCreatedAt: 'desc',
        }
        break
    }
  } else {
    findOptions.order = {
      bitCreatedAt: 'desc',
    }
  }

  if (peopleFilters.length) {
    // essentially, find at least one person
    for (const name of peopleFilters) {
      findOptions.where.push({
        ...andConditions,
        people: {
          name: { $like: `%${name}%` },
        },
      })
    }
  }

  if (!findOptions.where.length) {
    if (Object.keys(andConditions).length) {
      findOptions.where = andConditions
    } else {
      findOptions.where = undefined
    }
  }

  return await BitRepository.find(findOptions)
}

export class SearchStore {
  props: {
    appStore: AppStore
    paneManagerStore: PaneManagerStore
    selectionStore: SelectionStore
    integrationSettingsStore: IntegrationSettingsStore
    queryStore: QueryStore
  }

  loadMoreAmount = 0
  curFindOptions = null
  nlpStore = new NLPStore()
  searchFilterStore = new SearchFilterStore({
    queryStore: this.props.queryStore,
    integrationSettingsStore: this.props.integrationSettingsStore,
    nlpStore: this.nlpStore,
    searchStore: this,
  })

  willMount() {
    this.subscriptions.add({
      dispose: () => {
        this.nlpStore.subscriptions.dispose()
        this.searchFilterStore.subscriptions.dispose()
      },
    })
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', isActive)
      this.props.selectionStore.setResults(this.results)
    },
  )

  activeQuery = react(
    () => [App.state.query, this.isActive],
    ([query, isActive]) => {
      ensure('is active', isActive)
      return query
    },
    {
      defaultValue: App.state.query,
    },
  )

  // aggregated results for selection store
  results = react(
    () => [this.activeQuery, this.quickSearchState, this.searchState],
    async ([query, quickState, searchState], { when }) => {
      await when(
        () => query === quickState.query && query === searchState.query,
      )
      return [
        { type: 'row', items: quickState.results },
        { type: 'column', items: searchState.results },
      ]
    },
  )

  get isChanging() {
    return this.searchState.query !== this.activeQuery
  }

  get isOnSearchPane() {
    return this.props.appStore.selectedPane === 'docked-search'
  }

  get isActive() {
    return this.props.paneManagerStore.activePane === 'search'
  }

  hasQuery = () => {
    return !!this.activeQuery
  }

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
        return setValue({
          query,
          results: [],
        })
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
          this.props.appStore.services.slack.activeChannels.map(channel => ({
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
      if (isFilteringChannel && this.props.appStore.services.slack) {
        message = 'SPACE to search selected channel'
        results = channelResults
        return setValue({
          query,
          message,
          results,
        })
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
      const take = 4
      // initial search results max amt:
      const takeMax = take * 10
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
      const peopleFilters = activeFilters
        .filter(x => x.type === MarkType.Person)
        .map(x => x.text)
      const integrationFilters = [
        // these come from the text string
        ...activeFilters
          .filter(x => x.type === MarkType.Integration)
          .map(x => x.text),
        // these come from the button bar
        ...Object.keys(exclusiveFilters).filter(x => exclusiveFilters[x]),
      ]

      const { startDate, endDate } = dateState
      const baseFindOptions = {
        query: activeQuery,
        sortBy,
        startDate,
        endDate,
        integrationFilters,
        peopleFilters,
      }

      const updateNextResults = async skip => {
        const nextResults = await getSearchResults({
          ...baseFindOptions,
          skip,
          take,
        })
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
      setValue({
        query,
        results,
        finished: true,
      })
    },
    {
      defaultValue: { results: [], query: '', finished: false },
    },
  )

  loadMore = () => {
    this.loadMoreAmount++
  }

  quickSearchState = react(
    () => this.activeQuery,
    async (query, { sleep, when }) => {
      if (!this.isOnSearchPane) {
        throw react.cancel
      }
      // slightly faster for quick search
      await sleep(TYPE_DEBOUNCE - 60)
      await when(() => this.nlpStore.nlp.query === query)
      const {
        people,
        searchQuery,
        integrations /* , nouns */,
      } = this.nlpStore.nlp
      // fuzzy people results
      const allResults = await PersonRepository.find({
        take: 3,
        where: {
          name: { $like: `%${searchQuery.split('').join('%')}%` },
        },
      })
      const exactPeople = await Promise.all(
        people.map(name => {
          return PersonRepository.findOne({
            where: { name: { $like: `%${name}%` } },
          })
        }),
      )
      const results = flatten([
        ...exactPeople,
        integrations.map(name => ({ name, icon: name })),
        ...matchSort(searchQuery, flatten(allResults)),
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
