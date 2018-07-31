import * as React from 'react'
import * as UI from '@mcro/ui'
import { NotFound } from './views/NotFound'
import Router from './router'
import { view, on } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { themes } from './themes'

require('./helpers/installDevelopmentHelpers')

if (process.env.NODE_ENV === 'development') {
  if (module.hot && module.hot.addStatusHandler) {
    if (module.hot.status() === 'idle') {
      module.hot.addStatusHandler(status => {
        if (status === 'prepare') {
          view.emit('will-hmr')
          view.provide.emit('will-hmr')
        }
      })
    }
  }
}

export class RootView extends React.Component {
  state = {
    error: null,
  }

  componentDidMount() {
    window['rootViewInstance'] = this
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // capture un-captured links
    on(this, document, 'click', event => {
      if (
        event.target.tagName === 'A' &&
        event.target.href.startsWith('http')
      ) {
        event.preventDefault()
        App.sendMessage(Desktop, Desktop.messages.OPEN, event.target.href)
      }
    })

    // reset errors on hmr
    on(this, view, 'will-hmr', () => this.setState({ error: null }))
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  clearErrors() {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <UI.Col
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: Number.MAX_SAFE_INTEGER,
          }}
        >
          <UI.Col
            css={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '40%',
              height: '30%',
              background: [255, 255, 255, 0.95],
              padding: 10,
              lineHeight: '1.25rem',
              color: '#000',
              fontWeight: 500,
              overflowY: 'scroll',
            }}
          >
            <h2>Orbit Error: {this.state.error.message}</h2>
            <UI.Block
              tagName="pre"
              fontSize={15}
              marginTop={10}
              lineHeight={15}
            >
              {this.state.error.stack}
            </UI.Block>
          </UI.Col>
        </UI.Col>
      )
    }
    const CurrentPage = Router.activeView || NotFound
    return (
      <UI.ThemeProvide themes={themes} defaultTheme="light">
        <CurrentPage key={Router.key} {...Router.params} />
      </UI.ThemeProvide>
    )
  }
}
