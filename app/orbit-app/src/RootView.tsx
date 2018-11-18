import * as React from 'react'
import * as UI from '@mcro/ui'
import { NotFound } from './views/NotFound'
import { on, isEqual, viewEmitter } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { themes } from './themes'
import { throttle } from 'lodash'
import { router } from './router'

class RootViewPrePrepack extends React.Component {
  state = {
    error: null,
  }

  handleWindowResize = throttle(() => {
    if (!App.setState) return
    const screenSize = [window.innerWidth, window.innerHeight]
    if (!isEqual(App.state.screenSize, screenSize)) {
      App.setState({ screenSize })
    }
  }, 20)

  componentDidMount() {
    window['RootView'] = this
    window.addEventListener('resize', this.handleWindowResize)

    // prevent scroll bounce
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // capture un-captured links
    // if you don't then clicking a link will cause electron to go there
    // this is a good safeguard
    on(this, document, 'click', event => {
      if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault()
        console.log('Capturing a A tag from root', event.target.href)
        App.sendMessage(Desktop, Desktop.messages.OPEN, event.target.href)
      }
    })

    // reset errors on hmr
    on(this, viewEmitter, 'will-hmr', () => this.setState({ error: null }))
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  clearErrors() {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: Number.MAX_SAFE_INTEGER,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '40%',
              height: '30%',
              background: 'rgba(0,0,0,0.9)',
              padding: 10,
              color: '#fff',
              fontWeight: 500,
              overflow: 'auto',
            }}
          >
            <h2>Orbit Error: {this.state.error.message}</h2>
            <pre style={{ fontSize: 15, lineHeight: '15px', wordWrap: 'break-word' }}>
              {this.state.error.stack}
            </pre>
          </div>
        </div>
      )
    }
    const CurrentPage = router.activeView || NotFound
    return (
      <UI.ThemeProvide themes={themes}>
        <CurrentPage key={router.key} {...router.params} />
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
          viewEmitter.emit('will-hmr')
        }
      })
    }
  }
}

// prepack
// @ts-ignore
if (global.__optimizeReactComponentTree) {
  // @ts-ignore
  __optimizeReactComponentTree(RootView)
}

export const RootView = RootViewPrePrepack
