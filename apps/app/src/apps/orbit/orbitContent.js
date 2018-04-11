import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitItem from './orbitItem'
import OrbitDivider from './orbitDivider'
import * as Constants from '~/constants'
import { throttle } from 'lodash'
import Results from '~/apps/results/results'

const SPLIT_INDEX = 3

@UI.injectTheme
@view.attach('orbitPage')
@view
class OrbitContext {
  state = {
    resultsRef: null,
    isScrolled: false,
  }

  setRef = resultsRef => {
    if (resultsRef) {
      this.setState({ resultsRef })
      this.on(
        resultsRef,
        'scroll',
        throttle(() => {
          if (resultsRef.scrollTop > 0) {
            if (!this.state.isScrolled) {
              this.setState({ isScrolled: true })
            }
          } else {
            if (this.state.isScrolled) {
              this.setState({ isScrolled: false })
            }
          }
        }, 16),
      )
    }
  }

  render({ appStore, theme }) {
    const isSelectedInContext = appStore.activeIndex >= SPLIT_INDEX
    const y = isSelectedInContext ? -(SPLIT_INDEX * 20) : 0
    return (
      <orbitContext
        css={{
          background: theme.base.background,
          transform: { y },
        }}
      >
        <fadeNotifications
          $$untouchable
          $fadeVisible={appStore.activeIndex >= SPLIT_INDEX}
        />
        <OrbitDivider
          if={!App.state.query}
          css={{ paddingBottom: 0, zIndex: 1000, position: 'relative' }}
        />
        <Results />
        {/* <webview
          if={false}
          $results
          webpreferences="scrollBounce experimentalFeatures"
          src="http://localhost:3001/results"
        /> */}
      </orbitContext>
    )
  }
  static style = {
    orbitContext: {
      borderRadius: Constants.BORDER_RADIUS,
      position: 'relative',
      height: 'calc(100% - 35px)',
      transition: 'transform ease-in-out 150ms',
    },
    results: {
      flex: 1,
    },
    fade: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 13,
      height: 60,
      opacity: 0,
      zIndex: 100000,
      transition: 'opacity ease-in-out 150ms',
    },
    fadeNotifications: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: -40,
      height: 40,
      zIndex: -1,
      opacity: 0,
      transition: 'opacity ease-in 150ms',
    },
    fadeVisible: {
      zIndex: 10000,
      opacity: 1,
    },
  }

  static theme = (props, theme) => {
    return {
      fade: {
        background: `linear-gradient(${
          theme.base.background
        } 40%, transparent)`,
      },
      fadeNotifications: {
        background: `linear-gradient(transparent 45%, ${
          theme.base.background
        })`,
      },
    }
  }
}

const tinyProps = {
  hidePreview: true,
  titleProps: {
    ellipse: 1,
    fontWeight: 400,
    size: 1,
  },
  iconProps: {
    size: 14,
    style: {
      marginTop: 1,
      marginLeft: 15,
    },
  },
  padding: [3, 8],
  style: {
    borderRadius: 5,
  },
}

@view.attach('appStore')
@view
export default class OrbitContent {
  render({ appStore }) {
    const { query } = App.state
    log(`render.OrbitContent`)
    return (
      <orbitContent>
        <space css={{ height: 10 }} />
        <notifications
          $tiny={!query}
          css={{
            opacity:
              appStore.activeIndex >= 0 && appStore.activeIndex < SPLIT_INDEX
                ? 1
                : 0.5,
          }}
        >
          {appStore.results
            .slice(0, query ? 12 : SPLIT_INDEX)
            .map((result, index) => (
              <OrbitItem
                {...!query && tinyProps}
                key={result.id}
                type="gmail"
                index={index}
                appStore={appStore}
                results={appStore.results}
                result={{
                  ...result,
                  title: result.title,
                }}
                total={appStore.results.length}
                {...appStore.getHoverProps({
                  result,
                  id: index,
                })}
              />
            ))}
        </notifications>
        <OrbitContext if={!query} appStore={appStore} />
        <space css={{ height: 20 }} />
      </orbitContent>
    )
  }

  static style = {
    orbitContent: {
      flex: 1,
    },
    tiny: {
      margin: [0, 10],
    },
    notifications: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
    },
  }
}
