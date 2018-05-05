import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import NotFound from '~/views/404'
import Router from '~/router'

@view
export default class AppRoot extends React.Component {
  state = {
    error: null,
  }

  componentDidMount() {
    this.on(view, 'hmr', () => this.clearErrors())
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
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
    if (this.state.error) {
      return (
        <aboveredbox
          css={{
            background: [255, 0, 0, 0.025],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: Number.MAX_SAFE_INTEGER,
          }}
        >
          <error
            css={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '40%',
              height: '30%',
              background: [0, 0, 0, 0.9],
              padding: 20,
              lineHeight: '2.5rem',
              color: 'red',
              fontWeight: 900,
              overflowY: 'scroll',
            }}
          >
            <h1>Orbit Error</h1>
            <h2>{this.state.error.message}</h2>
            <pre
              css={{
                lineHeight: '1.4rem',
                fontSize: 16,
                color: '#fff',
              }}
            >
              {this.state.error.stack}
            </pre>
          </error>
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
