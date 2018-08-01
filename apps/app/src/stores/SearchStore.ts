import { react, on } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import { Person, getRepository } from '@mcro/models'
import { hoverSettler } from '../helpers/hoverSettler'
import { NLPStore } from './NLPStore'
import { SearchFilterStore } from './SearchFilterStore'
import { getSearchQuery } from './helpers/getSearchQuery'
import * as Helpers from '../helpers'
import * as SearchStoreHelpers from './helpers/searchStoreHelpers'
import debug from '@mcro/debug'
import { AppStore } from './AppStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { Brackets } from '../../../../node_modules/typeorm/browser'
import { flatten } from 'lodash'
import { DateRange } from './nlpStore/types'
import { MarkType } from './NLPStore/types'

const log = debug('searchStore')
const TYPE_DEBOUNCE = 200

type DateSelections = {
  startDate?: Date
  endDate?: Date
  key?: string
}

type DateState = {
  ranges: DateSelections[]
}

export class SearchStore /* extends Store */ {
  props: {
    appStore: AppStore
    integrationSettingsStore: IntegrationSettingsStore
  }

  nlpStore = new NLPStore()
  searchFilterStore = new SearchFilterStore(this)

  // start it with state from last time
  query = App.state.query
  lastPinKey = ''

  selectEvent = ''
  quickIndex = 0
  highlightIndex = -1
  nextIndex = -1
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  getResults = null

  extraFiltersHeight = 325
  extraFiltersVisible = false

  setActivePane = ref => {
    console.log('123', ref)
  }

  dateState: DateState = {
    ranges: [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ],
  }

  dateHover = hoverSettler({
    enterDelay: 400,
    leaveDelay: 400,
  })()

  willMount() {
    on(this, window, 'keydown', this.windowKeyDown)

    this.props.appStore.onPinKey(key => {
      if (key === 'Delete') {
        this.setQuery('')
        return
      }
      const { lastPinKey } = this
      if (!lastPinKey || lastPinKey != this.query[this.query.length - 1]) {
        this.setQuery(key)
      } else {
        this.setQuery(this.query + key)
      }
      this.lastPinKey = key
    })

    this.dateHover.setOnHovered(target => {
      this.setExtraFiltersVisible(target)
    })

    const disposeAppListen = App.onMessage(App.messages.CLEAR_SELECTED, () => {
      this.clearSelected()
    })

    this.subscriptions.add({
      dispose: () => {
        this.nlpStore.subscriptions.dispose()
        this.searchFilterStore.subscriptions.dispose()
        disposeAppListen()
      },
    })
  }

  get isChanging() {
    return this.searchState.query !== App.state.query
  }

  get isOnSearchPane() {
    return this.props.appStore.selectedPane === 'docked-search'
  }

  get isQuickSearchActive() {
    return (
      this.isOnSearchPane &&
      this.activeIndex === -1 &&
      !!this.quickSearchState.results.length
    )
  }

  get activeIndex() {
    this.lastSelectAt
    return this._activeIndex
  }

  set activeIndex(val) {
    this.lastSelectAt = Date.now()
    this._activeIndex = val
  }

  get selectedItem() {
    if (this.activeIndex === -1) {
      const { results } = this.quickSearchState
      if (!results.length) {
        return null
      }
      return results[this.quickIndex]
    }
    const { results } = this.searchState
    if (!results.length) {
      return null
    }
    return results[this.activeIndex]
  }

  get hasActiveIndex() {
    return (
      this.activeIndex > -1 &&
      this.activeIndex < this.searchState.results.length
    )
  }

  get extraHeight() {
    return this.extraFiltersVisible ? this.extraFiltersHeight : 0
  }

  get isActive() {
    return this.props.appStore.selectedPane === 'docked-search'
  }

  searchState = react(
    () => [
      App.state.query,
      this.getResults,
      // filter updates
      this.searchFilterStore.activeFilters,
      this.searchFilterStore.exclusiveFilters,
      this.searchFilterStore.sortBy,
    ],
    async ([query, getResults], { sleep, when, setValue, preventLogging }) => {
      if (!query) {
        return setValue({
          query,
          results: getResults ? getResults() : [],
        })
      }
      // these are all specialized searches, see below for main search logic
      if (getResults && getResults.shouldFilter) {
        return setValue({
          query,
          results: Helpers.fuzzy(query, getResults()),
        })
      }
      let results
      let channelResults
      let message
      // do stuff to prepare for getting results...
      const isFilteringSlack = query[0] === '#'
      const isFilteringChannel = isFilteringSlack && query.indexOf(' ') === -1
      if (isFilteringSlack) {
        channelResults = SearchStoreHelpers.matchSort(
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
        const take = 4
        const takeMax = take * 6
        const sleepBtwn = 80

        // gather all the pieces from nlp store for query
        // const { searchQuery, people, startDate, endDate } = this.nlpStore.nlp
        const {
          exclusiveFilters,
          activeFilters,
          activeQuery,
          activeDate,
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
        const { startDate, endDate } = activeDate

        for (let i = 0; i < takeMax / take; i += 1) {
          const skip = i * take
          let nextQuery = getSearchQuery(activeQuery, {
            skip,
            take,
            startDate,
            endDate,
            sortBy,
          })

          // add people filters
          if (peopleFilters.length) {
            // find one or more
            nextQuery = nextQuery.andWhere(
              new Brackets(qb => {
                const peopleLike = peopleFilters.map(filter => `%${filter}%`)
                qb.where('person.name like :name', { name: peopleLike[0] })
                for (const name of peopleLike.slice(1)) {
                  qb.orWhere('person.name like :name', { name })
                }
              }),
            )
          }

          // add integration filters
          if (integrationFilters.length) {
            nextQuery = nextQuery.andWhere(
              new Brackets(qb => {
                for (const [
                  index,
                  integration,
                ] of integrationFilters.entries()) {
                  const whereType = index === 0 ? 'where' : 'orWhere'
                  qb[whereType]('bit.integration = :integration', {
                    integration,
                  })
                }
              }),
            )
          }

          const nextResults = await nextQuery.getMany()
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

  personQueryBuilder = getRepository(Person).createQueryBuilder('person')

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
      const allResults = await Promise.all([
        // fuzzy people results
        this.personQueryBuilder
          .where('person.name like :nameLike', {
            nameLike: `%${searchQuery.split('').join('%')}%`,
          })
          .take(3)
          .getMany(),
      ])
      const exactPeople = await Promise.all(
        people.map(name => {
          return this.personQueryBuilder
            .where('person.name like :nameLike', {
              nameLike: `%${name}%`,
            })
            .getOne()
        }),
      )
      const results = flatten([
        ...exactPeople,
        integrations.map(name => ({ name, icon: name })),
        ...SearchStoreHelpers.matchSort(searchQuery, flatten(allResults)),
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

  // selectFirstItemAfterSearchSettles = react(
  //   () => this.searchState.query,
  //   async (query, { sleep }) => {
  //     if (!query) {
  //       throw react.cancel
  //     }
  //     await sleep(300)
  //     console.log('it worked?')
  //     if (this.nextIndex === -1) {
  //       this.nextIndex = 0
  //     }
  //   },
  // )

  clearSelectedOnLeave = react(
    () => [this.leaveIndex, Electron.hoverState.peekHovered],
    async ([leaveIndex, peekHovered], { sleep, when }) => {
      if (!peekHovered) {
        await sleep(100)
      }
      await when(() => !peekHovered)
      await sleep(100)
      if (leaveIndex === -1) {
        throw react.cancel
      }
      this.clearSelected()
    },
  )

  clearPeekOnInactiveIndex = react(
    () => this.activeIndex,
    () => {
      if (this.hasActiveIndex) {
        throw react.cancel
      }
      App.actions.clearPeek()
    },
  )

  resetActiveIndexOnPeekTarget = react(
    () => App.peekState.target,
    target => {
      if (target || !this.hasActiveIndex) {
        throw react.cancel
      }
      log(`ok clearing ${target} ${this.hasActiveIndex} ${this.activeIndex}`)
      this.clearSelected()
    },
  )

  resetActiveIndexOnKeyPastEnds = react(
    () => this.nextIndex,
    index => {
      if (index === -1) {
        this.activeIndex = this.nextIndex
      } else {
        const len = this.searchState.results.length
        if (index >= len) {
          this.nextIndex = len - 1
          this.activeIndex = this.nextIndex
        } else {
          throw react.cancel
        }
      }
    },
  )

  // delay for speed of rendering
  updateActiveIndexToNextIndex = react(
    () => this.nextIndex,
    async (i, { sleep }) => {
      await sleep(32)
      this.activeIndex = i
    },
  )

  resetActiveIndexOnNewSearchValue = react(
    () => this.searchState.query,
    async (_, { sleep }) => {
      await sleep(16)
      this.nextIndex = -1
      this.activeIndex = -1
    },
  )

  clearSelected = (clearPeek = true) => {
    this.leaveIndex = -1
    this.nextIndex = -1
    this.activeIndex = -1
    if (clearPeek) {
      App.actions.clearPeek()
    }
  }

  getHoverSettler = Helpers.hoverSettler({
    enterDelay: 40,
    betweenDelay: 40,
    onHovered: res => {
      // leave
      if (!res) {
        if (this.activeIndex !== -1) {
          this.leaveIndex = this.activeIndex
        }
        return
      }
      this.leaveIndex = -1
      this.toggleSelected(res.index)
    },
  })

  toggleSelected = index => {
    const isSame = this.activeIndex === index && this.activeIndex > -1
    if (isSame && App.peekState.target) {
      if (Date.now() - this.lastSelectAt < 70) {
        // ignore really fast double clicks
        console.log('isSame, ignore', index, this.activeIndex)
        return isSame
      }
      this.clearSelected()
    } else {
      if (typeof index === 'number') {
        this.nextIndex = index
      }
    }
    return false
  }

  setHighlightIndex = highlightIndex => {
    this.highlightIndex = +highlightIndex
  }

  clearIndexOnTarget = react(
    () => App.peekState.target,
    target => {
      if (target) {
        throw react.cancel
      }
      this.nextIndex = -1
    },
  )

  setSelectEvent = (val: string) => {
    this.selectEvent = val
  }

  increment = (by = 1) => {
    console.log('increment')
    this.setSelectEvent('key')
    this.toggleSelected(
      Math.min(this.searchState.results.length - 1, this.nextIndex + by),
    )
  }

  decrement = (by = 1) => {
    this.setSelectEvent('key')
    this.toggleSelected(Math.max(-1, this.nextIndex - by))
  }

  setGetResults = fn => {
    this.getResults = fn
  }

  openSelected = () => {
    if (this.selectedItem) {
      this.props.appStore.open(this.selectedItem)
      return true
    }
    return false
  }

  hasQuery() {
    return !!App.state.query
  }

  setExtraFiltersVisible = target => {
    this.extraFiltersVisible = !!target
  }

  onChangeDate = date => {
    console.log('got date', date)
    if (!date.selection) {
      return
    }
    this.dateState = {
      ranges: [date.selection],
    }
  }

  updateDateStateOnNLP = react(
    () => this.nlpStore.nlp.date,
    (date: DateRange) => {
      this.dateState = {
        ranges: [date],
      }
    },
  )

  updateAppQuery = react(
    () => this.query,
    async (query, { sleep }) => {
      // slight debounce for super fast typing
      await sleep(50)
      App.setQuery(query)
    },
  )

  clearQuery = () => {
    this.query = ''
  }

  windowKeyDown = e => {
    const { keyCode } = e
    switch (keyCode) {
      case 37: // left
        if (this.isQuickSearchActive) {
          this.decrementQuick()
          return
        }
        this.emit('key', 'left')
        return
      case 39: // right
        if (this.isQuickSearchActive) {
          this.incrementQuick()
          return
        }
        this.emit('key', 'right')
        return
      case 40: // down
        this.increment()
        return
      case 38: // up
        this.decrement()
        return
      case 13: // enter
        e.preventDefault()
        if (this.isQuickSearchActive) {
          // two things happen:
          //  first, if no target, open a peek
          //  then, if peek already open, then open the item
          if (App.peekState.target) {
            this.openSelected()
          } else {
            // see OrbitSearchQuickResults
            this.emit('key', 'enter')
          }
          return
        }
        if (App.orbitState.inputFocused) {
          if (this.openSelected()) {
            return
          }
        }
        return
    }
  }

  setQuery = value => {
    this.query = value
  }

  onChangeQuery = e => {
    this.query = e.target.value
  }

  onFocus = () => {
    App.setOrbitState({
      inputFocused: true,
    })
  }

  onBlur = () => {
    App.setOrbitState({
      inputFocused: false,
    })
  }

  resetQuickIndexOnChange = react(
    () => this.quickSearchState,
    () => {
      this.quickIndex = 0
    },
    {
      log: false,
    },
  )

  incrementQuick = () => {
    if (this.quickIndex < this.quickSearchState.results.length - 1) {
      this.quickIndex += 1
    }
  }

  decrementQuick = () => {
    if (this.quickIndex > 0) {
      this.quickIndex -= 1
    }
  }
}
