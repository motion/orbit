import { react, watch } from '@mcro/black'
import { App, Desktop } from '@mcro/all'
import { Bit, Setting } from '@mcro/models'
import fuzzySort from 'fuzzysort'
import * as Constants from '~/constants'
import * as r2 from '@mcro/r2'

// const log = debug('root')
const presetAnswers = {
  '1.txt': [
    {
      title: 'Hello world',
      body: 'this is me',
      type: 'document',
      integration: 'gdocs',
    },
    {
      title: 'Hello 2',
      body: 'this is me',
      type: 'email',
      integration: 'github',
    },
    { title: 'Chat', body: 'this is me', type: 'chat', integration: 'slack' },
  ],
}

const uniq = arr => {
  const added = {}
  const final = []
  for (const item of arr) {
    if (!added[item.title]) {
      final.push(item)
      added[item.title] = true
    }
  }
  return final
}

const fuzzyResults = (query, results, extraOpts) =>
  !query
    ? results
    : fuzzySort
        .go(query, results, {
          key: 'title',
          // threshold: -25,
          limit: 8,
          ...extraOpts,
        })
        .map(x => x.obj)

export default class AppStore {
  refreshCycle = 0
  selectedIndex = 0
  showSettings = false
  settings = {}

  @watch({ log: false })
  selectedBit = () =>
    App.state.selectedItem && Bit.findOne({ id: App.state.selectedItem.id })

  get results() {
    if (this.showSettings) {
      return fuzzyResults(App.state.query, [
        {
          id: 'google',
          type: 'setting',
          integration: 'google',
          title: 'Google Drive',
          icon: 'gdrive',
        },
        {
          id: 'github',
          type: 'setting',
          integration: 'github',
          title: 'Github',
          icon: 'github',
        },
        {
          id: 'slack',
          type: 'setting',
          integration: 'slack',
          title: 'Slack',
          icon: 'slack',
        },
        {
          id: 'folder',
          type: 'setting',
          integration: 'folder',
          title: 'Folder',
          icon: 'folder',
          oauth: false,
        },
      ])
    }
    const results = [
      ...(this.bitResults || []),
      ...(Desktop.searchState.pluginResults || []),
      ...(Desktop.searchState.searchResults || []),
    ]
    const strongTitleMatches = fuzzyResults(App.state.query, results)
    return uniq([...strongTitleMatches, ...results].slice(0, 8))
  }

  @react({ delay: 64 })
  setAppSelectedItem = [
    () => this.results[this.selectedIndex],
    item => {
      if (item) {
        const selectedItem = {
          id: item.id || '',
          icon: item.icon || '',
          title: item.title || '',
          body: item.body || '',
          type: item.type || '',
          integration: item.integration || '',
        }
        console.log('setting selected item', selectedItem)
        App.setSelectedItem(selectedItem)
      }
    },
  ]

  @react({ fireImmediately: true, log: false })
  bitResults = [
    () => [App.state.query, Desktop.appState.id, this.refreshCycle],
    async ([query, id]) => {
      if (id === 'com.apple.TextEdit') {
        return presetAnswers[Desktop.appState.title]
      }
      if (!query) {
        return (await Bit.find({ take: 8 })) || []
      }
      return await Bit.find({
        where: `title like "%${query.replace(/\s+/g, '%')}%"`,
        take: 8,
      })
    },
  ]

  async willMount() {
    this.getSettings()
    // every two seconds, re-query bit results
    this.setInterval(() => {
      this.refreshCycle = Date.now()
    }, 2000)
  }

  setSelectedIndex = i => {
    this.selectedIndex = i
  }

  getSettings = async () => {
    const settings = await Setting.find()
    if (settings) {
      this.settings = settings.reduce((a, b) => ({ ...a, [b.type]: b }), {})
    }
  }

  toggleSettings = () => {
    this.showSettings = !this.showSettings
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

  startOauth = id => {
    App.setAuthState({ openId: null })
    setTimeout(() => App.setAuthState({ openId: id }), 16)
    const checker = this.setInterval(async () => {
      const auth = await this.checkAuths()
      const oauth = auth && auth[id]
      if (!oauth) return
      clearInterval(checker)
      let setting = await Setting.findOne({ type: id })
      if (!setting) {
        setting = new Setting()
        setting.type = id
      }
      setting.token = oauth.token
      setting.values = {
        ...setting.values,
        oauth,
      }
      await setting.save()
      this.getSettings()
      App.setAuthState({ closeId: id })
    }, 1000)
  }
}
