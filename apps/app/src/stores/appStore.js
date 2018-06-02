import { react, isEqual } from '@mcro/black'
import { App, Desktop, Electron } from '@mcro/all'
import { Bit, Person, Setting, findOrCreate } from '@mcro/models'
import * as Constants from '~/constants'
import * as r2 from '@mcro/r2'
import * as Helpers from '~/helpers'
import * as OrbitHelpers from '~/apps/orbit/orbitHelpers'

const getPermalink = async (result, type) => {
  if (result.type === 'app') {
    return result.id
  }
  if (result.integration === 'slack') {
    const setting = await Setting.findOne({ type: 'slack' })
    let url = `slack://channel?id=${result.data.channel.id}&team=${
      setting.values.oauth.info.team.id
    }`
    if (type === 'channel') {
      return url
    }
    return `${url}&message=${result.data.messages[0].ts}`
  }
  return result.id
}

// note: importing services causes hell for some reason
const allServices = {
  slack: () => require('@mcro/services').SlackService,
  drive: () => require('@mcro/services').DriveService,
  github: () => require('@mcro/services').GithubService,
}

// const log = debug('root')

const uniq = arr => {
  const added = {}
  const final = []
  for (const item of arr) {
    if (!added[item.identifier || item.title]) {
      final.push(item)
      added[item.title] = true
    }
  }
  return final
}

const matchSort = (query, results) => {
  if (!results.length) {
    return results
  }
  const strongTitleMatches = Helpers.fuzzy(query, results, {
    threshold: -40,
  })
  return uniq([...strongTitleMatches, ...results].slice(0, 10))
}

const prefixes = {
  gh: { integration: 'github' },
  gd: { integration: 'google', type: 'document' },
  gm: { integration: 'google', type: 'mail' },
  sl: { integration: 'slack' },
  m: { type: 'mail' },
  d: { type: 'document' },
  c: { type: 'conversation' },
}

const parseQuery = query => {
  const prefix = query.split(' ')[0]
  const q = prefixes[prefix]
  if (q) {
    return {
      rest: query.replace(prefix, '').trim(),
      conditions: Object.keys(q).reduce(
        (query, key) => `${query} AND ${key} = "${q[key]}"`,
        '',
      ),
    }
  }
  return { rest: query, conditions: '' }
}

export class AppStore {
  nextIndex = -1
  activeIndex = 0
  showSettings = false
  settings = {}
  services = {}
  getResults = null
  resultRefs = {}
  dockedResultRefs = {}

  get innerHeight() {
    const HEADER_HEIGHT = 90
    return App.orbitState.size[1] - Constants.SHADOW_PAD * 2 - HEADER_HEIGHT
  }

  lastSelectedPane = ''

  updateLastSelectedPane = react(
    () => this.selectedPane,
    val => {
      this.lastSelectedPane = val
    },
  )

  clearPeekOnSelectedPaneChange = react(
    () => this.selectedPane,
    App.clearPeek,
    {
      log: 'state',
    },
  )

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

  async willMount() {
    this.updateScreenSize()
    this.getSettings()
    this.setInterval(this.getSettings, 2000)
  }

  updateScreenSize() {
    this.setInterval(() => {
      App.setState({
        screenSize: [window.innerWidth, window.innerHeight],
      })
    }, 1000)
  }

  updateResults = react(
    () => [Desktop.state.lastBitUpdatedAt, Desktop.searchState.pluginResultId],
    () => {
      if (this.searchState.results && this.searchState.results.length) {
        throw react.cancel
      }
      return Math.random()
    },
  )

  resetActiveIndexOnSearch = react(
    () => App.state.query,
    () => {
      this.activeIndex = 0
      App.clearPeek()
    },
    { log: 'state' },
  )

  bitResultsId = 0
  bitResults = react(
    () => [
      App.state.query,
      Desktop.appState.id,
      Desktop.state.lastBitUpdatedAt,
    ],
    async ([query], { sleep }) => {
      // debounce a little for fast typer
      await sleep(40)
      const results = await this.searchBits(query)
      setTimeout(() => {
        this.bitResultsId = Math.random()
      })
      return results
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
    const { conditions, rest } = parseQuery(query)
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

  contextResults = react(
    () => 0,
    async () => {
      return await Bit.find({
        take: 6,
        relations: ['people'],
        order: { bitCreatedAt: 'DESC' },
      })
    },
    {
      immediate: true,
      defaultValue: [],
    },
  )

  selectedBit = react(
    () => App.peekState.bit,
    async bit => {
      if (!bit) {
        return null
      }
      console.log('selectedBit', bit.type)
      if (bit.type === 'person') {
        return await Person.findOne({ id: bit.id })
      }
      if (bit.type === 'setting') {
        return bit
      }
      const res = await Bit.findOne({
        where: {
          id: bit.id,
        },
        relations: ['people'],
      })
      return res
    },
    { log: false, delay: 32 },
  )

  get results() {
    if (this.selectedPane.indexOf('-search') > 0) {
      return this.searchState.results
    }
    if (this.getResults) {
      return this.getResults()
    }
    return this.searchState.results || []
  }

  searchState = react(
    () => [App.state.query, this.getResults, this.updateResults],
    async ([query, thisGetResults], { when }) => {
      if (!query) {
        return { query, results: [] }
      }
      // these are all specialized searches, see below for main search logic
      if (thisGetResults && this.showSettings) {
        return {
          query,
          message: 'Settings',
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
        channelResults = matchSort(
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
        const { rest } = parseQuery(query)
        // sort
        results = matchSort(rest, allResultsUnsorted)
      }
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
    App.clearPeek()
  }

  lastSelectAt = 0

  hoverOutTm = 0
  getHoverSettler = Helpers.hoverSettler({
    enterDelay: 80,
    betweenDelay: 30,
    onHovered: res => {
      clearTimeout(this.hoverOutTm)
      if (!res) {
        log('should clear peek')
        // interval because hoversettler is confused when going back from peek
        // this.hoverOutTm = setInterval(() => {
        //   if (!Desktop.hoverState.peekHovered) {
        //     log(`no target`)
        //     this.clearSelected()
        //   }
        // }, 200)
        return
      }
      this.toggleSelected(res.index)
    },
  })

  toggleSelected = index => {
    const isSame = this.activeIndex === index
    if (isSame && App.peekState.target) {
      if (Date.now() - this.lastSelectAt < 450) {
        // ignore double clicks
        return isSame
      }
      App.clearPeek()
    } else {
      this.nextIndex = index
    }
    return false
  }

  setTarget = (item, target) => {
    OrbitHelpers.setPeekTarget(item, target)
    if (this.nextIndex !== this.activeIndex) {
      this.lastSelectAt = Date.now()
      this.activeIndex = this.nextIndex
    }
  }

  setGetResults = fn => {
    this.getResults = fn
  }

  hoverWordToActiveIndex = react(
    () => App.state.hoveredWord,
    word => word && this.pinSelected(word.index),
  )

  getPeekItem = item => {
    if (!item) {
      console.log('none found')
      return null
    }
    return
  }

  getSettings = async () => {
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
          if (!this.services[name] && allServices[name]) {
            const ServiceConstructor = allServices[name]()
            this.services[name] = new ServiceConstructor(setting)
          }
        }
      }
    }
  }

  toggleSettings = () => {
    this.showSettings = !this.showSettings
    // pin if not pinned
    if (this.showSettings && !App.orbitState.pinned) {
      App.sendMessage(Electron, Electron.messages.TOGGLE_PINNED)
    }
  }

  checkAuths = async () => {
    const { error, ...authorizations } = await r2.get(
      `${Constants.API_URL}/getCreds`,
    ).json
    if (error) {
      console.log('no creds')
    }
    return authorizations
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
      this.getSettings()
      App.sendMessage(Desktop, Desktop.messages.CLOSE_AUTH, type)
    }, 1000)
  }

  open = async (result, openType) => {
    const url = await getPermalink(result, openType)
    App.open(url)
  }

  handleLink = e => {
    e.preventDefault()
    e.stopPropagation()
    App.open(e.target.href)
  }
}
