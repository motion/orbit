import React from 'react'
import { view } from '@mcro/black'
import Redbox from 'redbox-react'
import * as UI from '@mcro/ui'
import NotFound from '~/views/404'
import Router from '~/router'
import Screen from '@mcro/screen'

@view.provide({
  rootStore: class RootStore {
    willMount() {
      if (!Screen.started) {
        Screen.start('app', {
          hoveredWord: null,
          hoveredLine: null,
          disablePeek: false,
          pinned: false,
          preventElectronHide: true,
          contextMessage: 'Orbit',
          closePeek: null,
          hidden: true,
        })
      }

      this.react(
        () => [
          Screen.electronState.shouldHide,
          Screen.electronState.shouldShow,
        ],
        function handleHidden([shouldHide, shouldShow]) {
          if (!shouldHide && !shouldShow) return
          const hidden = shouldHide > shouldShow
          Screen.setState({ hidden })
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
          <Redbox $$draggable error={this.state.error} />
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
