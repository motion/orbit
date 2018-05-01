import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitFrame from './orbitFrame'
import OrbitSearchResults from './orbitSearchResults'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import { App, Desktop } from '@mcro/all'
import { throttle } from 'lodash'
import { Title, SubTitle } from '~/views'
import Results from '~/apps/results/results'

const SPLIT_INDEX = 3

@UI.injectTheme
@view.attach('appStore', 'orbitPage')
@view
export default class Orbit {
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

  render({ appStore, orbitPage, theme }) {
    const headerBg = theme.base.background
    const { orbitOnLeft } = App
    return (
      <UI.Theme name="tan">
        <OrbitFrame
          headerBg={headerBg}
          orbitPage={orbitPage}
          shouldShow={() => !App.orbitState.hidden && !App.orbitState.docked}
        >
          <OrbitHeader headerBg={headerBg} />
          <orbitInner>
            <orbitContext
              if={!appStore.showSettings}
              css={{
                background: theme.base.background,
              }}
            >
              <fadeNotifications
                $$untouchable
                $fadeVisible={appStore.activeIndex >= SPLIT_INDEX}
              />
              <contextHeader
                css={{ textAlign: orbitOnLeft ? 'right' : 'left' }}
              >
                <Title ellipse={1}>{Desktop.appState.name}</Title>
                <SubTitle if={Desktop.appState.title}>
                  {Desktop.appState.title}
                </SubTitle>
              </contextHeader>
              <Results isContext />
            </orbitContext>
            <OrbitSettings />
            <OrbitSearchResults />
          </orbitInner>
        </OrbitFrame>
      </UI.Theme>
    )
  }

  static style = {
    orbitInner: {
      position: 'relative',
      flex: 1,
      zIndex: 10,
    },
    orbitContext: {
      borderBottomRadius: Constants.BORDER_RADIUS,
      position: 'relative',
      height: 'calc(100% - 35px)',
      transition: 'transform ease-in-out 150ms',
      zIndex: 100,
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
