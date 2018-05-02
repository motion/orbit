import { react, isEqual } from '@mcro/black'
import { App, Desktop, Electron } from '@mcro/all'
import { Bit, Person, Setting, findOrCreate } from '@mcro/models'
import * as Constants from '~/constants'
import * as r2 from '@mcro/r2'
import * as Helpers from '~/helpers'
import * as _ from 'lodash'
import peekPosition from './helpers/peekPosition'

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
    threshold: -10,
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
        ``,
      ),
    }
  }
  return { rest: query, conditions: '' }
}

export default class AppStore {
  refreshInterval = Date.now()
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

  get selectedPane() {
    if (App.orbitState.docked) {
      if (this.searchState.query) {
        return 'summary-search'
      }
      return 'summary'
    }
    if (Desktop.hoverState.peekHovered) {
      return 'carousel'
    }
    if (!App.orbitState.hidden) {
      if (this.searchState.query) {
        return 'context-search'
      }
      return 'context'
    }
  }

  async willMount() {
    this.updateScreenSize()
    this.getSettings()
    this.setInterval(this.getSettings, 2000)
    this.setInterval(() => {
      this.refreshInterval = Date.now()
    }, 1000)
  }

  updateScreenSize() {
    this.setInterval(() => {
      App.setState({
        screenSize: [window.innerWidth, window.innerHeight],
      })
    }, 1000)
  }

  @react({ log: 'state' })
  resetActiveIndexOnSearch = [
    () => App.state.query,
    () => {
      this.activeIndex = 0
      App.clearPeek()
    },
  ]

  @react({
    fireImmediately: true,
    defaultValue: [],
    onlyUpdateIfChanged: true,
    log: false,
  })
  bitResults = [
    () => [App.state.query, Desktop.appState.id, this.refreshInterval],
    async ([query]) => {
      if (!query) {
        return await Bit.find({
          take: 8,
          relations: ['people'],
          order: { bitCreatedAt: 'DESC' },
        })
      }
      const { conditions, rest } = parseQuery(query)
      return await Bit.find({
        where: `title like "%${rest.replace(/\s+/g, '%')}%"${conditions}`,
        relations: ['people'],
        order: { bitCreatedAt: 'DESC' },
        take: 8,
      })
    },
  ]

  @react({
    fireImmediately: true,
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
    return this.searchState.results || []
  }

  @react({
    defaultValue: { results: [], query: '' },
    fireImmediately: true,
    delay: 120,
    log: false,
  })
  searchState = [
    () => [
      App.state.query,
      Desktop.searchState.pluginResults || [],
      this.bitResults || [],
      this.getResults,
    ],
    ([query, pluginResults, bitResults, getResults]) => {
      if (getResults && this.showSettings) {
        return {
          query,
          message: 'Settings',
          results: Helpers.fuzzy(query, getResults()),
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
        const unsorted = [...bitResults, ...pluginResults]
        const { rest } = parseQuery(query)
        results = matchSort(rest, unsorted)
      }
      return {
        query,
        message,
        results,
      }
    },
  ]

  @react({
    fireImmediately: true,
    defaultValue: [],
  })
  summaryResults = [
    () => 0,
    async () => {
      const findType = (integration, type, skip = 0) =>
        Bit.findOne({
          skip,
          take: 1,
          where: {
            type,
            integration,
          },
          relations: ['people'],
          order: { bitCreatedAt: 'DESC' },
        })

      return [
        ...(await Promise.all([
          findType('slack', 'conversation'),
          findType('slack', 'conversation', 1),
          findType('slack', 'conversation', 2),
          findType('google', 'document'),
          findType('google', 'mail'),
          findType('google', 'mail', 1),
          findType('slack', 'conversation'),
          findType('slack', 'conversation'),
          findType('slack', 'conversation'),
        ])),
      ].filter(Boolean)
    },
  ]

  setResultRef = _.memoize(index => ref => {
    this.resultRefs[index] = ref
  })

  setDockedResultRef = _.memoize(index => ref => {
    this.dockedResultRefs[index] = ref
  })

  getTargetPosition = index => {
    const ref = App.orbitState.docked
      ? this.dockedResultRefs[index]
      : this.resultRefs[index]
    if (!ref) {
      throw `no result ref for index ${index} docked? ${App.orbitState.docked}`
    }
    const { top, left, height } = ref.getBoundingClientRect()
    return {
      top,
      left: left,
      width: App.orbitState.size[0],
      height,
    }
  }

  clearSelected = () => {
    if (!App.isMouseInActiveArea) {
      App.clearPeek()
    }
  }

  lastSelectAt = 0

  setActive = index => {
    this.lastSelectAt = Date.now()
    this.activeIndex = index
  }

  toggleSelected = (index, bit) => {
    const isSame = this.activeIndex === index
    if (isSame && App.peekState.target) {
      if (Date.now() - this.lastSelectAt < 450) {
        // ignore double clicks
        return
      }
      App.clearPeek()
    } else {
      this.pinSelected(index, bit)
    }
  }

  pinSelected = (index, bit) => {
    this.setActive(index)
    const target = this.getTargetPosition(index)
    const position = peekPosition(target)
    App.setPeekState({
      id: Math.random(),
      target,
      bit: this.getPeekItem(bit),
      ...position,
    })
  }

  setGetResults = fn => {
    this.getResults = fn
  }

  getHoverProps = Helpers.hoverSettler({
    enterDelay: 80,
    betweenDelay: 30,
    onHovered: res => {
      if (!res) {
        this.clearSelected()
      } else {
        console.log('hover pin', res)
        this.pinSelected(res.id, res.bit)
      }
    },
  })

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
    return {
      id: item.id || '',
      icon: item.icon || '',
      title: item.title || '',
      body: item.body || '',
      type: item.type || '',
      integration: item.integration || '',
    }
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
