import * as React from 'react'
import * as UI from '@mcro/ui'
import { NotFound } from './views/NotFound'
import Router from './router'
import { view, on } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'

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
  }

  componentDidCatch(error) {
    console.warn('did catch', error)
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
            background: [255, 0, 0, 0.025],
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
              background: [0, 0, 0, 0.3],
              padding: 20,
              lineHeight: '2.5rem',
              color: 'red',
              fontWeight: 900,
              overflowY: 'scroll',
            }}
          >
            <h1>Orbit Error</h1>
            <h2>{this.state.error.message}</h2>
            <UI.Block
              tagName="pre"
              css={{
                lineHeight: '1.4rem',
                fontSize: 16,
                color: '#fff',
              }}
            >
              {this.state.error.stack}
            </UI.Block>
          </UI.Col>
        </UI.Col>
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

if (process.env.NODE_ENV === 'development') {
  if (module.hot && module.hot.addStatusHandler) {
    if (module.hot.status() === 'idle') {
      module.hot.addStatusHandler(status => {
        // allow them to run after any other accept
        setTimeout(() => {
          // allow prevent of running hooks
          if (window['interceptHMR']) {
            if (status === 'apply') {
              window['interceptHMR'] = false
            }
            return
          }
          if (status === 'prepare') {
            view.emit('will-hmr')
            view.provide.emit('will-hmr')
          }
          if (status === 'apply') {
            view.emit('did-hmr')
            view.provide.emit('did-hmr')
            console.log('[HMR] orbit done')
            // @ts-ignore
            window.render()
          }
        }, 50)
      })
    }
  }
}
