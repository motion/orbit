import React from 'react'
import { view } from '@mcro/black'
import Redbox from 'redbox-react'
import * as UI from '@mcro/ui'
import NotFound from '~/views/404'
import Router from '~/router'
import { App, Electron, Desktop } from '@mcro/all'

const log = debug('root')

@view.provide({
  rootStore: class RootStore {
    willMount() {
      App.start()

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
          if (lastChange && lastChange > shouldShow) {
            log(`lastChange, hide`)
            App.setState({ orbitHidden: true })
            return
          }
          const isHidden = App.state.orbitHidden
          const willBeHidden = shouldHide > shouldShow
          // TODO implement this
          const PEEK_IS_FOCUSED = false
          if (PEEK_IS_FOCUSED && !isHidden && willBeHidden) {
            log(`Peek is focused, ignore hide`)
            return
          }
          log(`orbitHidden: ${willBeHidden}`)
          App.setState({ orbitHidden: willBeHidden })
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
