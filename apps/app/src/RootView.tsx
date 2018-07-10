import * as React from 'react'
import * as UI from '@mcro/ui'
import { NotFound } from './views/NotFound'
import Router from './router'
import { view } from '@mcro/black'

export class RootView extends React.Component {
  state = {
    error: null,
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
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

if (module.hot && module.hot.addStatusHandler) {
  if (module.hot.status() === 'idle') {
    module.hot.addStatusHandler(status => {
      if (status === 'prepare') {
        view.emit('will-hmr')
        view.provide.emit('will-hmr')
      }
      if (status === 'apply') {
        setTimeout(() => {
          view.emit('did-hmr')
          view.provide.emit('did-hmr')
        })
      }
    })
  }
}
