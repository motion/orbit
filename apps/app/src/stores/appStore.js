import { react, ReactionTimeoutError } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { Bit, Setting, Not, Equal } from '@mcro/models'
import * as Helpers from '~/helpers'
import * as PeekStateActions from '~/actions/PeekStateActions'
import * as AppStoreHelpers from './appStoreHelpers'
import * as AppStoreReactions from './appStoreReactions'
import { modelQueryReaction } from '@mcro/helpers'

let hasRun = false

const searchBits = async query => {
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
  const where = `(title like "%${titleLike}%" or body like "%${titleLike}%") ${conditions}`
  const queryParams = {
    where,
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
    take: 6,
  }
  console.log('queryParams', queryParams)
  const res = await Bit.find(queryParams)
  console.timeEnd('bitSearch')
  return res
}

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

  get selectedItem() {
    if (this.activeIndex === -1) {
      return this.quickSearchResults[this.quickSearchIndex]
    }
    return this.searchState.results[this.activeIndex]
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
        this.activeIndex = this.nextIndex
      }
      const len = this.searchState.results.length
      if (index >= len) {
        this.nextIndex = len - 1
        this.activeIndex = this.nextIndex
      }
      throw react.cancel
    },
  )

  resetActiveIndexOnSearchStart = react(
    () => App.state.query,
    async (query, { sleep }) => {
      this.activeIndex = -1
      this.clearSelected()
      // auto select after delay
      if (query) {
        await sleep(1000)
        this.nextIndex = 0
      }
    },
  )

  resetActiveIndexOnNewSearchValue = react(
    () => this.searchState.query,
    async (_, { sleep }) => {
      await sleep(16)
      this.nextIndex = -1
      this.activeIndex = -1
      // this.updateActiveIndex()
    },
  )

  bitSearch = react(
    () => [
      App.state.query,
      Desktop.appState.id,
      Desktop.state.lastBitUpdatedAt,
    ],
    async ([query], { sleep }) => {
      // debounce a little for fast typer
      // do the query sooner because it goes over wire to backend
      // so it doesnt obstruct view responsiveness
      await sleep(30)
      const results = await searchBits(query)
      await sleep(30)
      return {
        results,
        query,
      }
    },
    {
      immediate: true,
      defaultValue: { results: [] },
      onlyUpdateIfChanged: true,
    },
  )

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
        // await sleep(1000)
        // 🔍 REGULAR SEARCHES GO THROUGH HERE
        // no jitter - wait for everything to finish
        console.time('searchPluginsAndBitResults')
        try {
          const waitMax = hasRun ? 700 : 2000
          await Promise.all([
            // when(() => query === Desktop.searchState.pluginResultsId, waitMax),
            when(() => query === this.bitSearch.query, waitMax),
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
          ...this.bitSearch.results,
          // ...Desktop.searchState.pluginResults,
        ]
        console.log('allResultsUnsorted', allResultsUnsorted)
        // remove prefixes
        const { rest } = AppStoreHelpers.parseQuery(query)
        // sort
        results = AppStoreHelpers.matchSort(rest, allResultsUnsorted)
      }
      hasRun = true
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
    this.activeIndex = -1
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
    this.open(this.selectedItem)
  }

  open = async (result, openType) => {
    const url = await AppStoreHelpers.getPermalink(result, openType)
    App.open(url)
  }
}
