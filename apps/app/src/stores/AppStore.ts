import { on, react } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { Bit, Person, Setting, Not, Equal } from '@mcro/models'
import * as Helpers from '../helpers'
import * as AppStoreHelpers from './helpers/appStoreHelpers'
import { modelQueryReaction } from '@mcro/helpers'
import debug from '@mcro/debug'
import { NLPStore } from './NLPStore'

const log = debug('appStore')
const TYPE_DEBOUNCE = 200

const searchBits = async (query, params?) => {
  if (!query) {
    return await Bit.find({
      take: 6,
      relations: ['people'],
      order: { bitCreatedAt: 'DESC' },
    })
  }
  const { conditions, rest } = AppStoreHelpers.parseQuery(query)
  const titleLike = rest.length === 1 ? rest : rest.replace(/\s+/g, '%')
  const where = `(title like "%${titleLike}%" or body like "%${titleLike}%") ${conditions}`
  const queryParams = {
    where,
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
    ...params,
  }
  const res = await Bit.find(queryParams)
  return res
}

export class AppStore {
  nlpStore = new NLPStore()

  quickSearchIndex = 0
  nextIndex = 0
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  getResults = null
  lastSelectedPane = ''

  async willMount() {
    this.updateScreenSize()
    this.subscriptions.add({
      dispose: () => this.nlpStore.subscriptions.dispose(),
    })
  }

  get activeIndex() {
    this.lastSelectAt
    return this._activeIndex
  }

  set activeIndex(val) {
    this.lastSelectAt = Date.now()
    this._activeIndex = val
  }

  get selectedPane() {
    if (App.orbitState.docked) {
      if (App.state.query) {
        return 'summary-search'
      }
      return 'summary'
    }
    if (!App.orbitState.hidden) {
      if (App.state.query) {
        return 'context-search'
      }
      return 'context'
    }
    return this.lastSelectedPane
  }

  get selectedItem() {
    // if (this.activeIndex === -1) {
    //   return this.quickSearchResults[this.quickSearchIndex]
    // }
    return this.searchState.results[this.activeIndex]
  }

  get hasActiveIndex() {
    return (
      this.activeIndex > -1 &&
      this.activeIndex < this.searchState.results.length
    )
  }

  services = modelQueryReaction(
    () =>
      Setting.find({
        where: { category: 'integration', token: Not(Equal('good')) },
      }),
    settings => {
      const services = {}
      for (const setting of settings) {
        const { type } = setting
        if (!setting.token) {
          continue
        }
        if (AppStoreHelpers.allServices[type]) {
          const ServiceConstructor = AppStoreHelpers.allServices[type]()
          services[type] = new ServiceConstructor(setting)
        } else {
          console.warn('no service for', type, AppStoreHelpers.allServices)
        }
      }
      return services
    },
  )

  clearSelectedOnLeave = react(
    () => [this.leaveIndex, Desktop.hoverState.peekHovered],
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

  updateLastSelectedPane = react(
    () => this.selectedPane,
    val => {
      this.lastSelectedPane = val
    },
  )

  // TODO disable until context re-enabled
  // clearSelectedOnSelectedPaneChange = react(
  //   () => this.selectedPane,
  //   () => this.clearSelected(),
  // )

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

  updateScreenSize() {
    on(
      this,
      setInterval(() => {
        if (!App.setState) return
        App.setState({
          screenSize: [window.innerWidth, window.innerHeight],
        })
      }, 1000),
    )
  }

  updateResults = react(
    () => [
      Desktop.state.lastBitUpdatedAt,
      // Desktop.searchState.pluginResultsId || 0,
    ],
    () => {
      if (this.searchState.results && this.searchState.results.length) {
        throw react.cancel
      }
      return Math.random()
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

  // this does "auto-select of first result after search"
  // but it can be pretty annoying
  // resetActiveIndexOnSearchStart = react(
  //   () => App.state.query,
  //   async (query, { sleep }) => {
  //     this.activeIndex = -1
  //     this.clearSelected()
  //     // auto select after delay
  //     if (query) {
  //       await sleep(1000)
  //       this.nextIndex = 0
  //     }
  //   },
  // )

  resetActiveIndexOnNewSearchValue = react(
    () => this.searchState.query,
    async (_, { sleep }) => {
      await sleep(16)
      this.nextIndex = -1
      this.activeIndex = -1
    },
  )

  get isChanging() {
    return this.searchState.query !== App.state.query
  }

  searchState = react(
    () => [App.state.query, this.getResults],
    async ([query], { sleep, when, setValue, preventLogging }) => {
      if (!query) {
        return setValue({
          query,
          results: this.getResults ? this.getResults() : [],
        })
      }
      // these are all specialized searches, see below for main search logic
      if (this.getResults && this.getResults.shouldFilter) {
        return setValue({
          query,
          results: Helpers.fuzzy(query, this.getResults()),
        })
      }
      let results
      let channelResults
      let message
      // do stuff to prepare for getting results...
      const isFilteringSlack = query[0] === '#'
      const isFilteringChannel = isFilteringSlack && query.indexOf(' ') === -1
      if (isFilteringSlack) {
        channelResults = AppStoreHelpers.matchSort(
          query.split(' ')[0],
          this.services.slack.activeChannels.map(channel => ({
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
      if (isFilteringChannel && this.services.slack) {
        message = 'SPACE to search selected channel'
        results = channelResults
      }
      // regular search
      if (!results) {
        // debounce a little for fast typer
        await sleep(TYPE_DEBOUNCE)
        // wait for nlp to give us results
        await when(() => this.nlpStore.nlp.query === query)
        let searchQuery = `${query}`
        let sliced = 0
        for (const mark of this.nlpStore.marks) {
          if (mark[2] === 'date') {
            const start = mark[0] + sliced
            const end = mark[1] + sliced
            searchQuery = searchQuery.substr(0, start) + searchQuery.substr(end)
            sliced += mark[1] - mark[0]
          }
        }
        // get first page results
        const takePer = 4
        const takeMax = takePer * 6
        const sleepBtwn = 80
        let results = []
        for (let i = 0; i < takeMax / takePer; i += 1) {
          const skip = i * takePer
          const nextResults = await searchBits(searchQuery, {
            take: takePer,
            skip,
          })
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
        // await Promise.all([
        //   when(() => this.bitSearch.query === query),
        //   when(() => this.peopleSearch.query === query),
        // ])
        // const allResultsUnsorted = [
        //   ...this.bitSearch.results,
        //   ...this.peopleSearch.results,
        //   // ...Desktop.searchState.pluginResults,
        // ]
        // // return first page fast results
        // const { rest } = AppStoreHelpers.parseQuery(query)
        // results = AppStoreHelpers.matchSort(rest, allResultsUnsorted)
        // setValue({
        //   query,
        //   message,
        //   results,
        // })
        // // then return full results
        // await when(() => this.bitSearch.restResults)
        // results = [...results, ...this.bitSearch.restResults]
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

  // disable until app launching
  // quickSearchResults = react(
  //   () => App.state.query,
  //   async (query, { when }) => {
  //     const hasLoaded = !!this.quickSearchResults.length
  //     if (hasLoaded) {
  //       await when(() => query === Desktop.searchState.pluginResultsId)
  //     }
  //     const results = Desktop.searchState.pluginResults
  //     if (!results.length) {
  //       throw react.cancel
  //     }
  //     return AppStoreHelpers.matchSort(query, results)
  //   },
  //   { defaultValue: [], immediate: true },
  // )

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

  // sitrep
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

  open = async (result, openType) => {
    if (!result) {
      throw new Error('No result given to open')
    }
    const url = await AppStoreHelpers.getPermalink(result, openType)
    App.open(url)
  }
}
