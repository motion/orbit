import { react, ReactionTimeoutError } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { Bit, Setting, Not, Equal } from '@mcro/models'
import * as Helpers from '~/helpers'
import * as PeekStateActions from '~/actions/PeekStateActions'
import * as AppStoreHelpers from './appStoreHelpers'
import * as AppStoreReactions from './appStoreReactions'
import { modelQueryReaction } from '@mcro/helpers'

let hasRun = false

export class AppStore {
  quickSearchIndex = 0
  nextIndex = 0
  lastSelectAt = 0
  _activeIndex = -1
  settings = {}
  getResults = null
  lastSelectedPane = ''

  async willMount() {
    this.updateScreenSize()
  }

  // reactive values
  selectedBit = AppStoreReactions.selectedBitReaction

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

  get hasActiveIndex() {
    return (
      this.activeIndex > -1 &&
      this.activeIndex < this.searchState.results.length
    )
  }

  settings = modelQueryReaction(
    () => Setting.find(),
    settings =>
      settings.reduce((acc, cur) => ({ ...acc, [cur.type]: cur }), {}),
  )

  services = modelQueryReaction(
    () =>
      Setting.find({
        where: { category: 'integration', token: Not(Equal('good')) },
      }),
    settings => {
      const services = {}
      for (const setting of settings) {
        const { type } = setting
        if (!setting.token || this.services[type]) {
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

  updateLastSelectedPane = react(
    () => this.selectedPane,
    val => {
      this.lastSelectedPane = val
    },
  )

  clearSelectedOnSelectedPaneChange = react(
    () => this.selectedPane,
    () => this.clearSelected(),
  )

  clearPeekOnInactiveIndex = react(
    () => this.activeIndex,
    () => {
      log(`active ${this.hasActiveIndex}`)
      if (this.hasActiveIndex) {
        throw react.cancel
      }
      PeekStateActions.clearPeek()
    },
  )

  updateScreenSize() {
    this.setInterval(() => {
      if (!App.setState) return
      App.setState({
        screenSize: [window.innerWidth, window.innerHeight],
      })
    }, 1000)
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
      console.log('nextIndex', index)
      if (index === -1) {
        this.activeIndex = -1
      }
      if (index >= this.searchState.results.length) {
        this.activeIndex = this.nextIndex
      }
      throw react.cancel
    },
  )

  resetActiveIndexOnSearchStart = react(
    () => App.state.query,
    () => {
      this.activeIndex = -1
      this.clearSelected()
    },
    { log: 'state' },
  )

  resetActiveIndexOnSearchComplete = react(
    () => this.searchState && Math.random(),
    async (_, { sleep }) => {
      await sleep(16)
      this.nextIndex = -1
      this.activeIndex = -1
      // this.updateActiveIndex()
    },
  )

  bitResultsId = 0
  bitResults = react(
    () => [
      App.state.query,
      Desktop.appState.id,
      Desktop.state.lastBitUpdatedAt,
    ],
    async ([query], { sleep, setValue }) => {
      // debounce a little for fast typer
      await sleep(40)
      const results = await this.searchBits(query)
      setValue(results)
      await sleep()
      this.bitResultsId = Math.random()
    },
    {
      immediate: true,
      defaultValue: [],
      onlyUpdateIfChanged: true,
      log: false,
    },
  )

  searchBits = async query => {
    if (!query) {
      return await Bit.find({
        take: 6,
        relations: ['people'],
        order: { bitCreatedAt: 'DESC' },
      })
    }
    console.time('bitSearch')
    const { conditions, rest } = AppStoreHelpers.parseQuery(query)
    const titleLike = rest.length === 1 ? rest : rest.replace(/\s+/g, '%')
    const where = `title like "${titleLike}%"${conditions}`
    console.log('searching', where, conditions, rest)
    const res = await Bit.find({
      where,
      relations: ['people'],
      order: { bitCreatedAt: 'DESC' },
      take: 6,
    })
    console.timeEnd('bitSearch')
    return res
  }

  searchState = react(
    () => [App.state.query, this.getResults, this.updateResults],
    async ([query, thisGetResults], { when }) => {
      if (!query) {
        return { query, results: thisGetResults ? thisGetResults() : [] }
      }
      // these are all specialized searches, see below for main search logic
      if (thisGetResults && thisGetResults.shouldFilter) {
        return {
          query,
          results: Helpers.fuzzy(query, thisGetResults()),
        }
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
      // do stuff to get results....
      if (isFilteringChannel && this.services.slack) {
        message = 'SPACE to search selected channel'
        results = channelResults
      } else {
        // 🔍 REGULAR SEARCHES GO THROUGH HERE
        // no jitter - wait for everything to finish
        console.time('searchPluginsAndBitResults')
        try {
          const waitMax = hasRun ? 200 : 2000
          const id1 = this.bitResultsId
          await Promise.all([
            when(() => query === Desktop.searchState.pluginResultsId, waitMax),
            when(() => id1 !== this.bitResultsId, waitMax),
          ])
        } catch (err) {
          if (err instanceof ReactionTimeoutError) {
            console.log('timed out!, waht to do now?????????????')
          } else {
            throw err
          }
        }
        console.timeEnd('searchPluginsAndBitResults')
        const allResultsUnsorted = [
          ...this.bitResults,
          ...Desktop.searchState.pluginResults,
        ]
        // remove prefixes
        const { rest } = AppStoreHelpers.parseQuery(query)
        // sort
        results = AppStoreHelpers.matchSort(rest, allResultsUnsorted)
      }
      hasRun = true
      console.log('returning new searchState')
      return {
        query,
        message,
        results,
      }
    },
    {
      defaultValue: { results: [], query: '' },
      immediate: true,
    },
  )

  quickSearchResults = react(
    () => App.state.query,
    async (query, { when }) => {
      const hasLoaded = !!this.quickSearchResults.length
      if (hasLoaded) {
        await when(() => query === Desktop.searchState.pluginResultsId)
      }
      const results = Desktop.searchState.pluginResults
      if (!results.length) {
        throw react.cancel
      }
      return AppStoreHelpers.matchSort(query, results)
    },
    { defaultValue: [], immediate: true },
  )

  clearSelected = () => {
    clearTimeout(this.hoverOutTm)
    this.nextIndex = -1
    PeekStateActions.clearPeek()
  }

  hoverOutTm = 0
  getHoverSettler = Helpers.hoverSettler({
    enterDelay: 50,
    betweenDelay: 30,
    onHovered: res => {
      clearTimeout(this.hoverOutTm)
      if (!res) {
        // interval because hoversettler is confused when going back from peek
        // this.hoverOutTm = setInterval(() => {
        //   if (!Desktop.hoverState.peekHovered) {
        //     log('should clear peek')
        //     this.clearSelected()
        //   }
        // }, 200)
        return
      }
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
      console.log('clearing')
      this.clearSelected()
    } else {
      if (typeof index === 'number') {
        this.nextIndex = index
      }
    }
    return false
  }

  setTarget = (item, target) => {
    clearTimeout(this.hoverOutTm)
    PeekStateActions.selectItem(item, target)
    this.updateActiveIndex()
  }

  increment = (by = 1) => {
    this.toggleSelected(
      Math.min(this.searchState.results.length - 1, this.activeIndex + by),
    )
  }

  decrement = (by = 1) => {
    this.toggleSelected(Math.max(-1, this.activeIndex - by))
  }

  updateActiveIndex = () => {
    this.activeIndex = this.nextIndex
  }

  setGetResults = fn => {
    this.getResults = fn
  }

  openSelected = () => {
    this.open(this.searchState.results[this.activeIndex])
  }

  open = async (result, openType) => {
    const url = await AppStoreHelpers.getPermalink(result, openType)
    App.open(url)
  }
}
