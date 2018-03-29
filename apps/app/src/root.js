import React from 'react'
import { view, react } from '@mcro/black'
import Redbox from 'redbox-react'
import * as UI from '@mcro/ui'
import NotFound from '~/views/404'
import Router from '~/router'
import { App } from '@mcro/all'
import { Setting } from '@mcro/models'

// const log = debug('root')

@view.provide({
  appStore: class AppStore {
    selectedIndex = 0
    showSettings = false
    settings = []

    @react({ delay: 64 })
    setAppSelectedIndex = [() => this.selectedIndex, App.setSelectedIndex]

    async willMount() {
      await App.start()
      this.getSettings()
    }

    setSelectedIndex = i => {
      this.selectedIndex = i
    }

    get results() {
      if (this.showSettings) {
        return []
      }
      return App.results
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
