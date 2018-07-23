import { react, on } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import { hoverSettler } from '../helpers/hoverSettler'
import { NLPStore } from './NLPStore'
import { SearchFilterStore } from './SearchFilterStore'
import { getSearchQuery } from './helpers/getSearchQuery'
import * as Helpers from '../helpers'
import * as SearchStoreHelpers from './helpers/searchStoreHelpers'
import debug from '@mcro/debug'
import { AppReactions } from './AppReactions'
import { AppStore } from './AppStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { Brackets } from '../../../../node_modules/typeorm/browser'

const log = debug('searchStore')
const TYPE_DEBOUNCE = 200

export class SearchStore {
  props: {
    appStore: AppStore
    integrationSettingsStore: IntegrationSettingsStore
  }

  id = Math.random()
  nlpStore = new NLPStore()
  searchFilterStore = new SearchFilterStore(this)
  appReactionsStore = new AppReactions({
    onPinKey: key => {
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
    },
  })
  // searchIndexStore = new SearchIndexStore()

  // start it with state from last time
  query = App.state.query
  lastPinKey = ''

  nextIndex = 0
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  getResults = null

  extraFiltersHeight = 300
  extraFiltersVisible = false

  dateHover = hoverSettler({
    enterDelay: 400,
    leaveDelay: 400,
    onHovered: target => {
      console.log('on hovered', this.id)
      this.setExtraFiltersVisible(target)
    },
  })()

  willMount() {
    on(this, window, 'keydown', this.handleKeyDown)

    this.subscriptions.add({
      dispose: () => {
        this.nlpStore.subscriptions.dispose()
        this.searchFilterStore.subscriptions.dispose()
        this.appReactionsStore.subscriptions.dispose()
      },
    })
  }

  get isChanging() {
    return this.searchState.query !== App.state.query
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
    return this.searchState.results[this.activeIndex]
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
          const nextQuery = getSearchQuery(searchQuery, {
            people,
            startDate,
            endDate,
            take: takePer,
            skip,
          })
          // add in filters if need be
          if (activeFilters && activeFilters.length) {
            nextQuery.andWhere(
              new Brackets(qb => {
                for (const [index, integration] of activeFilters.entries()) {
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
      log(`active ${this.hasActiveIndex}`)
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
    console.log('toggle selected', index, this.activeIndex)
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
      Math.min(this.searchState.results.length - 1, this.activeIndex + by),
    )
  }

  decrement = (by = 1) => {
    this.toggleSelected(Math.max(-1, this.activeIndex - by))
  }

  setGetResults = fn => {
    this.getResults = fn
  }

  openSelected = () => {
    this.open(this.selectedItem)
  }

  open = async (result, openType?) => {
    if (!result) {
      throw new Error('No result given to open')
    }
    const url = await SearchStoreHelpers.getPermalink(result, openType)
    App.open(url)
  }

  hasQuery() {
    return !!App.state.query
  }

  dateState = {
    ranges: [
      {
        startDate: Date.now(),
        endDate: Date.now(),
        key: 'selection',
      },
    ],
  }

  setExtraFiltersVisible = target => {
    console.log('set set set', !!target, target, this.id)
    this.extraFiltersVisible = !!target
  }

  onChangeDate = ranges => {
    this.dateState = {
      ranges: [ranges.selection],
    }
    // this.dateState = ranges
  }

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

  handleKeyDown = ({ keyCode }) => {
    switch (keyCode) {
      case 37: // left
        this.emit('key', 'left')
        return
      case 39: // right
        this.emit('key', 'right')
        return
      case 40: // down
        this.increment()
        return
      case 38: // up
        this.decrement()
        return
      case 13: // enter
        this.openSelected()
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
}
