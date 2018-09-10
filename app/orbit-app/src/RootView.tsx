import * as React from 'react'
import * as UI from '@mcro/ui'
import { NotFound } from './views/NotFound'
import Router from './router'
import { view, on, isEqual } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { themes } from './themes'

export class RootView extends React.Component {
  resizeInterval = setInterval(() => {
    if (!App.setState) return
    const screenSize = [window.innerWidth, window.innerHeight]
    if (!isEqual(App.state.screenSize, screenSize)) {
      App.setState({ screenSize })
    }
  }, 1000)

  state = {
    error: null,
  }

  componentDidMount() {
    // prevent scroll bounce
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // capture un-captured links
    // if you don't then clicking a link will cause electron to go there
    // this is a good safeguard
    on(this, document, 'click', event => {
      if (
        event.target.tagName === 'A' &&
        event.target.href.startsWith('http')
      ) {
        event.preventDefault()
        console.log('Capturing a A tag from root', event.target.href)
        App.sendMessage(Desktop, Desktop.messages.OPEN, event.target.href)
      }
    })

    // reset errors on hmr
    on(this, view, 'will-hmr', () => this.setState({ error: null }))
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  componentWillUnmount() {
    clearInterval(this.resizeInterval)
  }

  clearErrors() {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <UI.Col
          {...{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: Number.MAX_SAFE_INTEGER,
          }}
        >
          <UI.Col
            {...{
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
      <UI.ThemeProvide themes={themes}>
        <CurrentPage key={Router.key} {...Router.params} />
      </UI.ThemeProvide>
    )
  }
}

if (process.env.NODE_ENV === 'development') {
  if (module.hot && module.hot.addStatusHandler) {
    if (module.hot.status() === 'idle') {
      module.hot.addStatusHandler(status => {
        if (status === 'prepare') {
          // for gloss to update styles
          window['__lastHMR'] = Date.now()
          view.emit('will-hmr')
          view.provide.emit('will-hmr')
        }
      })
    }
  }
}
