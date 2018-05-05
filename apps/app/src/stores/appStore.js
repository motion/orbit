import { react, isEqual } from '@mcro/black'
import { App, Desktop, Electron } from '@mcro/all'
import { Bit, Person, Setting, findOrCreate } from '@mcro/models'
import * as Constants from '~/constants'
import * as r2 from '@mcro/r2'
import * as Helpers from '~/helpers'

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

const getResults = async query => {
  if (!query) {
    return await Bit.find({
      take: 6,
      relations: ['people'],
      order: { bitCreatedAt: 'DESC' },
    })
  }
  const { conditions, rest } = parseQuery(query)
  return await Bit.find({
    where: `title like "%${rest.replace(/\s+/g, '%')}%"${conditions}`,
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
    take: 6,
  })
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
        ``,
      ),
    }
  }
  return { rest: query, conditions: '' }
}

export default class AppStore {
  nextIndex = -1
  activeIndex = -1
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

  @react
  updateLastSelectedPane = [
    () => this.selectedPane,
    val => {
      this.lastSelectedPane = val
    },
  ]

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

  @react
  updateResults = [
    () => [Desktop.state.lastBitUpdatedAt, Desktop.searchState.pluginResultId],
    () => {
      if (this.searchState.results && this.searchState.results.length) {
        throw react.cancel
      }
      return Math.random()
    },
  ]

  @react({ log: 'state' })
  resetActiveIndexOnSearch = [
    () => App.state.query,
    () => {
      this.activeIndex = 0
      App.clearPeek()
    },
  ]

  bitResultsId = 0
  @react({
    immediate: true,
    defaultValue: [],
    onlyUpdateIfChanged: true,
    log: false,
  })
  bitResults = [
    () => [
      App.state.query,
      Desktop.appState.id,
      Desktop.state.lastBitUpdatedAt,
    ],
    async ([query], { sleep }) => {
      // debounce enough for medium-speed typer
      await sleep(120)
      const results = await getResults(query)
      this.bitResultsId = Math.random()
      return results
    },
  ]

  @react({
    immediate: true,
    defaultValue: [],
  })
  contextResults = [
    () => 0,
    async () => {
      return await Bit.find({
        take: 6,
        relations: ['people'],
        order: { bitCreatedAt: 'DESC' },
      })
    },
  ]

  @react({ log: false, delay: 32 })
  selectedBit = [
    () => App.peekState.bit,
    async bit => {
      if (!bit) {
        return null
      }
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
  ]

  get results() {
    if (this.selectedPane.indexOf('-search') > 0) {
      return this.searchState.results
    }
    if (this.getResults) {
      return this.getResults()
    }
    return this.searchState.results || []
  }

  @react({
    defaultValue: { results: [], query: '' },
    immediate: true,
    log: false,
  })
  searchState = [
    () => [App.state.query, this.getResults, this.updateResults],
    async ([query, thisGetResults], { when }) => {
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
        let howfar = 0
        let toolong = setTimeout(() => console.log('took long: ', howfar), 1000)
        await when(() => pluginResultId !== Desktop.searchState.pluginResultId)
        howfar++
        await when(() => bitResultsId !== this.bitResultsId)
        howfar++
        clearTimeout(toolong)
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
  ]

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
        log(`should clear peek`)
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

  finishSettingIndex = () => {
    if (this.nextIndex !== this.activeIndex) {
      this.lastSelectAt = Date.now()
      this.activeIndex = this.nextIndex
    }
  }

  setGetResults = fn => {
    this.getResults = fn
  }

  @react.if
  hoverWordToActiveIndex = [
    () => App.state.hoveredWord,
    word => this.pinSelected(word.index),
  ]

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
