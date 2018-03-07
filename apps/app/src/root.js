import React from 'react'
import { view } from '@mcro/black'
import Redbox from 'redbox-react'
import * as UI from '@mcro/ui'
import NotFound from '~/views/404'
import Router from '~/router'
import Screen, { App, Electron, Desktop } from '@mcro/screen'

const log = debug('root')

@view.provide({
  rootStore: class RootStore {
    willMount() {
      if (!Screen.started) {
        Screen.start('app', {
          highlightWords: {},
          hoveredWord: null,
          hoveredLine: null,
          disablePeek: false,
          pinned: false,
          preventElectronHide: true,
          contextMessage: 'Orbit',
          closePeek: null,
          peekHidden: true,
          knowledge: null,
        })
      }

      this.react(
        () => [
          Electron.state.shouldHide,
          Electron.state.shouldShow,
          Desktop.state.lastScreenChange,
        ],
        function handleHidden([shouldHide, shouldShow, lastChange]) {
          log(`handleHidden: ${shouldHide} ${shouldShow} ${lastChange}`)
          if (!shouldHide && !shouldShow) {
            return
          }
          if (Electron.state.peekFocused) {
            log(`Peek is focused, ignore`)
            return
          }
          if (lastChange && lastChange > shouldShow) {
            log('do peek hide')
            App.setState({ peekHidden: true })
            return
          }
          const peekHidden = shouldHide > shouldShow
          log('peekHidden', peekHidden)
          App.setState({ peekHidden })
        },
        true,
      )
    }
  },
})
@view
export default class Root extends React.Component {
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
            top: 0,
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
      <UI.Theme name="light">
        <CurrentPage key={Router.key} {...Router.params} />
      </UI.Theme>
    )
  }
}
