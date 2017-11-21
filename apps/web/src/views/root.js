import React from 'react'
import { view } from '@mcro/black'
import Redbox from 'redbox-react'
import * as UI from '@mcro/ui'
import NotFound from '~/views/404'
import Router from '~/router'

@view
export default class Root extends React.Component {
  state = {
    error: null,
  }

  clearErr = () => {
    this.setState({ error: null })
  }

  componentDidMount() {
    view.on('hmr', this.clearErr)
  }

  componentWillUnmount() {
    view.off('hmr', this.clearErr)
  }

  componentDidCatch(error) {
    console.error('React.handleError', error)
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
    if (this.state.error) {
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
