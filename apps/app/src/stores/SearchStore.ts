import { react, on } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import { FindOptions } from 'typeorm'
import { Bit } from '../../../models'
import { BitRepository, PersonRepository } from '../repositories'
import { hoverSettler } from '../helpers/hoverSettler'
import { NLPStore } from './NLPStore'
import { SearchFilterStore } from './SearchFilterStore'
import * as Helpers from '../helpers'
import * as SearchStoreHelpers from './helpers/searchStoreHelpers'
import debug from '@mcro/debug'
import { AppStore } from './AppStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { flatten } from 'lodash'
import { DateRange } from './nlpStore/types'

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

  id = Math.random()
  nlpStore = new NLPStore()
  searchFilterStore = new SearchFilterStore(this)
  // searchIndexStore = new SearchIndexStore()

  // start it with state from last time
  query = App.state.query
  lastPinKey = ''

  quickIndex = 0
  highlightIndex = -1
  nextIndex = -1
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  getResults = null

  extraFiltersHeight = 325
  extraFiltersVisible = false

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
        this.query = ''
        return
      }
      const { lastPinKey } = this
      if (!lastPinKey || lastPinKey != this.query[this.query.length - 1]) {
        this.query = key
      } else {
        this.query += key
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

  get isQuickSearchActive() {
    if (this.props.appStore.selectedPane !== 'docked-search') {
      return false
    }
    return this.activeIndex === -1 && !!this.quickSearchState.results.length
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
    return this.extraFiltersVisible ? 0 : this.extraFiltersHeight
  }

  get isActive() {
    return this.props.appStore.selectedPane === 'docked-search'
  }

  searchState = react(
    () => [
      App.state.query,
      this.getResults,
      this.searchFilterStore.activeFilters,
    ],
    async (
      [query, getResults, activeFilters],
      { sleep, when, setValue, preventLogging },
    ) => {
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
        // debounce a little for fast typer
        await sleep(TYPE_DEBOUNCE)
        // wait for nlp to give us results
        await when(() => this.nlpStore.nlp.query === query)
        // gather all the pieces from nlp store for query
        const { searchQuery, people, startDate, endDate } = this.nlpStore.nlp
        // get first page results
        const takePer = 4
        const takeMax = takePer * 6
        const sleepBtwn = 80
        let results = []
        for (let i = 0; i < takeMax / takePer; i += 1) {
          const skip = i * takePer

          const findOptions: FindOptions<Bit> = {
            where: [],
            relations: {
              people: true
            },
            take: takePer,
            skip
          }

          const andConditions: any = {}
          if (startDate)
            andConditions.bitCreatedAt = { $moreThan: startDate }
          if (endDate)
            andConditions.bitCreatedAt = { $lessThan: endDate }
          if (activeFilters && activeFilters.length)
            andConditions.integration = { $in: activeFilters }

          if (searchQuery.length) {
            const likeString = `%${searchQuery.replace(/\s+/g, '%')}%`
            findOptions.where.push({ ...andConditions, title: { $like: likeString } })
            findOptions.where.push({ ...andConditions, body: { $like: likeString } })
          } else {
            // order by recent if no search
            findOptions.order = {
              bitCreatedAt: "desc"
            }
          }

          if (people.length) {
            // essentially, find at least one person
            people.forEach(name => {
              findOptions.where.push({
                ...andConditions,
                person: {
                  name: { $like: `%${name}%` }
                }
              })
            })
          }

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
          name: { $like: `%${searchQuery.split('').join('%')}%` }
        }
      })
      const exactPeople = await Promise.all(
        people.map(name => {
          return PersonRepository.findOne({
            where: { name: { $like: `%${name}%` } }
          })
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

  // one frame after for speed of rendering
  updateActiveIndexToNextIndex = react(
    () => this.nextIndex,
    async (i, { sleep }) => {
      await sleep(0)
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
      if (Date.now() - this.lastSelectAt < 450) {
        // ignore double clicks
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
    console.log(highlightIndex)
    console.trace()
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

  increment = (by = 1) => {
    this.toggleSelected(
      Math.min(this.searchState.results.length - 1, this.nextIndex + by),
    )
  }

  decrement = (by = 1) => {
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

  onChangeDate = ({ selection }: { selection: DateSelections }) => {
    console.log('got selection', selection)
    this.dateState = {
      ranges: [selection],
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
