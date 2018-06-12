import { react, isEqual } from '@mcro/black'
import { App, Desktop } from '@mcro/all'
import { Bit, Setting, findOrCreate } from '@mcro/models'
import * as Helpers from '~/helpers'
import * as PeekStateActions from '~/actions/PeekStateActions'
import * as AppStoreHelpers from './appStoreHelpers'
import * as AppStoreReactions from './appStoreReactions'

export class AppStore {
  nextIndex = 0
  activeIndex = -1
  settings = {}
  services = {}
  getResults = null
  lastSelectedPane = ''

  async willMount() {
    this.updateScreenSize()
    this.updateSettings()
    this.setInterval(this.updateSettings, 2000)
  }

  // reactive values
  selectedBit = AppStoreReactions.selectedBitReaction

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

  updateLastSelectedPane = react(
    () => this.selectedPane,
    val => {
      this.lastSelectedPane = val
    },
  )

  clearPeekOnSelectedPaneChange = react(
    () => this.selectedPane,
    this.clearSelected,
  )

  updateScreenSize() {
    this.setInterval(() => {
      App.setState({
        screenSize: [window.innerWidth, window.innerHeight],
      })
    }, 1000)
  }

  updateResults = react(
    () => [
      Desktop.state.lastBitUpdatedAt,
      Desktop.searchState.pluginResultId || 0,
    ],
    () => {
      if (this.searchState.results && this.searchState.results.length) {
        throw react.cancel
      }
      return Math.random()
    },
  )

  resetActiveIndexOnKeyPastEnds = react(
    () => this.nextIndex,
    index => {
      // if card selected, let card do its thing
      if (index >= 0 || index < this.searchState.results.length) {
        throw react.cancel
      }
      console.log('updating')
      // otherwise set it
      this.clearSelected()
      this.updateActiveIndex()
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
      this.nextIndex = 0
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

  get results() {
    if (this.getResults) {
      return this.getResults()
    }
    if (this.selectedPane.indexOf('-search') > 0) {
      return this.searchState.results
    }
    return this.searchState.results || []
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
        const pluginResultId = Desktop.searchState.pluginResultsId
        const bitResultsId = this.bitResultsId
        // no jitter - wait for everything to finish
        console.time('searchPlugins')
        console.time('searchPluginsAndBitResults')
        await when(() => pluginResultId !== Desktop.searchState.pluginResultId)
        console.timeEnd('searchPlugins')
        await when(() => bitResultsId !== this.bitResultsId)
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
      log: false,
    },
  )

  clearSelected = () => {
    clearTimeout(this.hoverOutTm)
    this.nextIndex = -1
    PeekStateActions.clearPeek()
  }

  lastSelectAt = 0
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
        return isSame
      }
      this.clearSelected()
    } else {
      console.log('next index', index)
      this.nextIndex = index
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
    this.lastSelectAt = Date.now()
    this.activeIndex = this.nextIndex
  }

  setGetResults = fn => {
    this.getResults = fn
  }

  updateSettings = async () => {
    const settings = await Setting.find()
    if (settings) {
      const nextSettings = settings.reduce(
        (a, b) => ({ ...a, [b.type]: b }),
        {},
      )
      if (!isEqual(this.settings, nextSettings)) {
        this.settings = nextSettings
        for (const name of Object.keys(nextSettings)) {
          const setting = nextSettings[name]
          if (!setting.token) {
            continue
          }
          if (!this.services[name] && AppStoreHelpers.allServices[name]) {
            const ServiceConstructor = AppStoreHelpers.allServices[name]()
            this.services[name] = new ServiceConstructor(setting)
          }
        }
      }
    }
  }

  startOauth = type => {
    App.sendMessage(Desktop, Desktop.messages.OPEN_AUTH, type)
    const checker = this.setInterval(async () => {
      const auth = await this.checkAuths()
      const oauth = auth && auth[type]
      if (!oauth) return
      clearInterval(checker)
      let setting = await findOrCreate(Setting, { type })
      if (!oauth.token) {
        throw new Error(`No token returned ${JSON.stringify(oauth)}`)
      }
      setting.token = oauth.token
      setting.values = {
        ...setting.values,
        oauth,
      }
      await setting.save()
      this.updateSettings()
      App.sendMessage(Desktop, Desktop.messages.CLOSE_AUTH, type)
    }, 1000)
  }

  openSelected = () => {
    this.open(this.searchState.results[this.activeIndex])
  }

  open = async (result, openType) => {
    const url = await AppStoreHelpers.getPermalink(result, openType)
    App.open(url)
  }
}
