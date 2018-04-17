import { react, watch, isEqual } from '@mcro/black'
import { App, Desktop, Electron } from '@mcro/all'
import { Bit, Setting, findOrCreate } from '@mcro/models'
import * as Constants from '~/constants'
import * as r2 from '@mcro/r2'
import * as Helpers from '~/helpers'
import { throttle } from 'lodash'

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
  selectedIndex = -1
  hoveredIndex = -1
  showSettings = false
  settings = {}
  getResults = null

  async willMount() {
    this.getSettings()
    this.setInterval(this.getSettings, 2000)
    this.setInterval(() => {
      this.refreshInterval = Date.now()
    }, 1000)
    // this.setInterval(() => {
    //   if (
    //     App.isShowingOrbit &&
    //     App.state.peekTarget &&
    //     Electron.orbitState.mouseOver
    //   ) {
    //     App.setPeekTarget({
    //       ...App.state.peekTarget,
    //       position: this.getMousePosition(),
    //     })
    //   }
    // }, 1000)
  }

  get activeIndex() {
    if (App.state.peekTarget) {
      return this.selectedIndex
    } else {
      return this.hoveredIndex
    }
  }

  @react
  resetSelectedIndexOnSearch = [
    () => App.state.query,
    () => {
      this.selectedIndex = -1
      this.hoveredIndex = 0
      App.setPeekTarget(null)
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

  @watch({ log: false, delay: 64 })
  selectedBit = () =>
    App.state.selectedItem && Bit.findOne({ id: App.state.selectedItem.id })

  get results() {
    return this.searchState.results || []
  }

  @react({
    defaultValue: { results: [], query: '' },
    fireImmediately: true,
    delay: 120,
  })
  searchState = [
    () => [
      App.state.query,
      Desktop.searchState.pluginResults || [],
      this.bitResults || [],
      this.getResults,
    ],
    ([query, pluginResults, bitResults, getResults]) => {
      let results
      if (getResults) {
        results = Helpers.fuzzy(query, getResults())
      } else {
        const unsorted = [...bitResults, ...pluginResults]
        const { rest } = parseQuery(query)
        const strongTitleMatches = Helpers.fuzzy(rest, unsorted, {
          threshold: -10,
        })
        results = uniq([...strongTitleMatches, ...unsorted].slice(0, 10))
      }
      return {
        query,
        results,
      }
    },
  ]

  getMousePosition = () => {
    return {
      top: Math.max(
        Electron.orbitState.position[1] + 100,
        Desktop.mouseState.position.y - 200,
      ),
      left: Electron.orbitState.position[0],
      width: Electron.orbitState.size[0] - Constants.SHAD,
    }
  }

  clearSelected = () => {
    if (!Electron.isMouseInActiveArea) {
      App.setPeekTarget(null)
    }
  }

  lastSelectAt = 0

  _setSelected = id => {
    if (App.isShowingOrbit) {
      this.lastSelectAt = Date.now()
      this.hoveredIndex = id
      this.selectedIndex = id
    }
  }

  setSelected = (i, target) => {
    if (i === null) {
      this.clearSelected()
      return
    }
    if (target) {
      if (!Electron.orbitState.position) {
        return
      }
      const { top, width, height } = target
      const position = {
        // add orbits offset
        left: Electron.orbitState.position[0],
        top: top + Electron.orbitState.position[1],
        width,
        height,
      }
      this._setSelected(i, position)
      return
    }
    if (App.state.peekTarget) {
      this.pinSelected(i)
      return
    }
    this._setSelected(i)
  }

  toggleSelected = index => {
    if (Date.now() - this.lastSelectAt < 450) {
      // ignore double clicks
      return
    }
    const isSame = this.selectedIndex === index
    if (isSame && App.state.peekTarget) {
      App.setPeekTarget(null)
    } else {
      this.pinSelected(index)
    }
  }

  pinSelected = index => {
    if (typeof index === 'number') {
      this._setSelected(index)
      App.setPeekTarget({
        id: index > -1 ? index : this.hoveredIndex || this.activeIndex,
        position: this.getMousePosition(),
      })
      console.log(
        'set peek target',
        {
          id: index > -1 ? index : this.hoveredIndex || this.activeIndex,
          position: this.getMousePosition(),
        },
        App.state.peekTarget,
      )
    }
  }

  clearPinned = () => {
    App.setPeekTarget(null)
  }

  setGetResults = fn => {
    this.getResults = fn
  }

  getHoverProps = Helpers.hoverSettler({
    enterDelay: 40,
    betweenDelay: 30,
    onHovered: item => {
      if (item && typeof item.id === 'number') {
        this.setSelected(item.id)
      }
    },
  })

  @react.if
  hoverWordToSelectedIndex = [
    () => App.state.hoveredWord,
    word => this.setSelected(word.index),
  ]

  @react
  setAppSelectedItem = [
    () =>
      this.selectedIndex >= 0
        ? this.searchState.results[this.selectedIndex]
        : null,
    item => {
      if (!item) {
        return
      }
      const selectedItem = {
        id: item.id || '',
        icon: item.icon || '',
        title: item.title || '',
        body: item.body || '',
        type: item.type || '',
        integration: item.integration || '',
      }
      App.setSelectedItem(selectedItem)
    },
  ]

  getSettings = async () => {
    const settings = await Setting.find()
    if (settings) {
      const nextSettings = settings.reduce(
        (a, b) => ({ ...a, [b.type]: b }),
        {},
      )
      if (!isEqual(this.settings, nextSettings)) {
        this.settings = nextSettings
      }
    }
  }

  toggleSettings = () => {
    this.showSettings = !this.showSettings
    // pin if not pinned
    if (this.showSettings && !Electron.orbitState.pinned) {
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
}
