import { react } from '@mcro/black'
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

export default class AppStore {
  selectedIndex = 0
  showSettings = false
  settings = []

  get results() {
    if (this.showSettings) {
      return [
        { id: 'google', name: 'Google Drive', icon: 'gdrive' },
        { id: 'github', name: 'Github', icon: 'github' },
        { id: 'slack', name: 'Slack', icon: 'slack' },
        { id: 'folder', name: 'Folder', icon: 'folder', oauth: false },
      ]
    }
    const results = [
      ...(this.bitResults || []),
      ...(Desktop.searchState.pluginResults || []),
      ...(Desktop.searchState.searchResults || []),
    ]
    const strongTitleMatches = fuzzySort
      .go(App.state.query, results, {
        key: 'title',
        threshold: -25,
        limit: 8,
      })
      .map(x => x.obj)
    return uniq([...strongTitleMatches, ...results].slice(0, 12))
  }

  @react({ delay: 64 })
  setAppSelectedItem = [
    () => this.results[this.selectedIndex],
    App.setSelectedItem,
  ]

  @react({ fireImmediately: true })
  bitResults = [
    () => [App.state.query, Desktop.appState.id],
    async ([query, id]) => {
      if (this.showSettings || !Bit.usedConnection) {
        return []
      }
      if (id === 'com.apple.TextEdit') {
        return presetAnswers[Desktop.appState.title]
      }
      if (!query) {
        return (await Bit.find({ take: 8 })) || []
      }
      return await Bit.find({
        where: `title like "%${query.split('').join('%')}%"`,
        take: 8,
      })
    },
  ]

  async willMount() {
    this.getSettings()
  }

  setSelectedIndex = i => {
    this.selectedIndex = i
  }

  getSettings = async () => {
    this.settings = await Setting.find()
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
    App.setAuthState({ openId: id })
    const checker = this.setInterval(async () => {
      const auth = await this.checkAuths()
      const oauth = auth && auth[id]
      if (!oauth) return
      clearInterval(checker)
      const setting = await Setting.findOne({ type: id })
      console.log('got oauth', oauth)
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
