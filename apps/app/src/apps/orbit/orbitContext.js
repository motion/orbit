import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitDivider from './orbitDivider'
import * as Constants from '~/constants'
import { throttle } from 'lodash'
import Results from '~/apps/results/results'

const SPLIT_INDEX = 3

@UI.injectTheme
@view.attach('appStore', 'orbitPage')
@view
export default class OrbitContext {
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
          if={!appStore.searchState.query}
          css={{ paddingBottom: 0, zIndex: 1000, position: 'relative' }}
        />
        <Results isContext />
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
