import { PaneManagerStore } from '../apps/orbit/PaneManagerStore'
import { App } from '@mcro/stores'
import { react } from '@mcro/black'
import { NLPStore } from './NLPStore'
import { SearchFilterStore } from './SearchFilterStore'
import { AppStore } from './AppStore'
import { Bit, Person } from '@mcro/models'
import { matchSort } from './helpers/searchStoreHelpers'
import { MarkType } from './nlpStore/types'
import { FindOptions } from 'typeorm'
import { BitRepository, PersonRepository } from '../repositories'
import { flatten } from 'lodash'
import { SelectionStore } from './SelectionStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'

const TYPE_DEBOUNCE = 200

export class SearchStore {
  props: {
    appStore: AppStore
    paneManagerStore: PaneManagerStore
    selectionStore: SelectionStore
    integrationSettingsStore: IntegrationSettingsStore
  }

  nlpStore = new NLPStore()
  searchFilterStore = new SearchFilterStore(this)
  extraFiltersHeight = 325
  extraFiltersVisible = false

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
      if (!isActive) throw react.cancel
      this.props.selectionStore.setResults(this.results)
    },
    { immediate: true },
  )

  // aggregated results for selection store
  results = react(
    () => App.state.query,
    async (query, { when }) => {
      await when(() => query === this.quickSearchState.query)
      await when(() => query === this.searchState.query)
      return [...this.quickSearchState.results, ...this.searchState.results]
    },
  )

  get isChanging() {
    return this.searchState.query !== App.state.query
  }

  get isOnSearchPane() {
    return this.props.appStore.selectedPane === 'docked-search'
  }

  get isActive() {
    return this.props.paneManagerStore.activePane === 'search'
  }

  get extraHeight() {
    return this.extraFiltersVisible ? this.extraFiltersHeight : 0
  }

  hasQuery() {
    return !!App.state.query
  }

  setExtraFiltersVisible = target => {
    this.extraFiltersVisible = !!target
  }

  searchState = react(
    () => [
      App.state.query,
      // filter updates
      this.searchFilterStore.activeFilters,
      this.searchFilterStore.exclusiveFilters,
      this.searchFilterStore.sortBy,
      this.searchFilterStore.dateState,
    ],
    async ([query], { sleep, when, setValue, preventLogging }) => {
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
      }
      // regular search
      if (!results) {
        // if typing, wait a bit
        if (this.searchState.query !== query) {
          // debounce a little for fast typer
          await sleep(TYPE_DEBOUNCE)
          // wait for nlp to give us results
          await when(() => this.nlpStore.nlp.query === query)
        }

        // pagination
        const take = 6
        const takeMax = take * 2
        const sleepBtwn = 80

        // gather all the pieces from nlp store for query
        // const { searchQuery, people, startDate, endDate } = this.nlpStore.nlp
        const {
          exclusiveFilters,
          activeFilters,
          activeQuery,
          dateState,
          sortBy,
        } = this.searchFilterStore

        let results = []

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

        for (let i = 0; i < takeMax / take; i += 1) {
          const skip = i * take

          const findOptions: FindOptions<Bit> = {
            where: [],
            relations: {
              people: true,
            },
            take,
            skip,
          }

          const andConditions: any = {}
          if (startDate) {
            andConditions.bitCreatedAt = { $moreThan: startDate }
          }
          if (endDate) {
            andConditions.bitCreatedAt = { $lessThan: endDate }
          }
          if (integrationFilters && integrationFilters.length) {
            andConditions.integration = { $in: integrationFilters }
          }

          if (activeQuery.length) {
            const likeString = `%${activeQuery.replace(/\s+/g, '%')}%`
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
                person: {
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

          console.log('SEARCH FIND OPTIONS:', findOptions)
          const nextResults = await BitRepository.find(findOptions)

          results = [...results, ...nextResults]
          setValue({
            results,
            query,
          })
          // no more results...
          if (!nextResults.length) {
            throw react.cancel
          }
          // only log it once...
          preventLogging()
          // get next page results
          await sleep(sleepBtwn)
        }
        return
      }
      return setValue({
        query,
        message,
        results,
      })
    },
    {
      defaultValue: { results: [], query: '' },
      immediate: true,
    },
  )

  quickSearchState = react(
    () => App.state.query,
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
      immediate: true,
      defaultValue: { results: [] },
    },
  )
}
