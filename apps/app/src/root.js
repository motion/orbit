import React from 'react'
import { view } from '@mcro/black'
import Redbox from 'redbox-react'
import * as UI from '@mcro/ui'
import NotFound from '~/views/404'
import Router from '~/router'
import { App } from '@mcro/all'

// const log = debug('root')

@view.provide({
  appStore: class AppStore {
    showSettings = false

    get results() {
      if (this.showSettings) {
        return
      }
      return App.results
    }

    toggleSettings = () => {
      this.showSettings = !this.showSettings
    }

    async willMount() {
      await App.start()
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
