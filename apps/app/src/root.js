import React from 'react'
import { view, react } from '@mcro/black'
import Redbox from 'redbox-react'
import * as UI from '@mcro/ui'
import NotFound from '~/views/404'
import Router from '~/router'
import { App, Desktop } from '@mcro/all'
import { Bit, Setting } from '@mcro/models'
import fuzzySort from 'fuzzysort'

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

@view.provide({
  appStore: class AppStore {
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
      return this.bitResults || []
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
          return
        }
        if (id === 'com.apple.TextEdit') {
          return presetAnswers[Desktop.appState.title]
        }
        if (!query) {
          return (await Bit.find({ take: 8 })) || []
        }
        const results = await Bit.find({
          where: `title like "${query}%"`,
          take: 8,
        })
        const strongTitleMatches = fuzzySort
          .go(query, results, {
            key: 'title',
            threshold: -25,
          })
          .map(x => x.obj)
        return uniq([...strongTitleMatches, ...results])
      },
    ]

    async willMount() {
      await App.start()
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
        setting.save()
        this.getSettings()
        App.setAuthState({ closeId: id })
      }, 1000)
    }
  },
})
@view
export default class AppRoot extends React.Component {
  state = {
    error: null,
  }

  componentDidMount() {
    this.on(view, 'hmr', () => this.clearErrors())
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  clearErrors() {
    this.setState({ error: null })
  }

  clearHmr = async () => {
    await window.start()
    view.emit('hmr')
  }

  render() {
    if (this.state.error && window.location.pathname !== '/highlights') {
      return (
        <aboveredbox
          $$draggable
          css={{
            position: 'absolute',
            top: this.state.error ? '80%' : 0,
            left: 0,
            zIndex: Number.MAX_SAFE_INTEGER,
          }}
        >
          <UI.Portal>
            <UI.Button
              css={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: Number.MAX_SAFE_INTEGER,
              }}
              onClick={this.clearHmr}
            >
              Refresh
            </UI.Button>
          </UI.Portal>
          <Redbox error={this.state.error} />
        </aboveredbox>
      )
    }

    const CurrentPage = Router.activeView || NotFound
    return (
      <UI.Theme name="tan">
        <CurrentPage key={Router.key} {...Router.params} />
      </UI.Theme>
    )
  }
}
