import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from '~/apps/orbit/orbitCard'
import { throttle } from 'lodash'
import * as UI from '@mcro/ui'
// import AppStore from '~/stores/appStore'

const SPLIT_INDEX = 3

// @view.provide({
//   appStore: AppStore,
// })
@UI.injectTheme
@view.attach('appStore')
@view
export default class Results {
  childrenHeight = 1

  state = {
    resultsRef: null,
    isScrolled: false,
    isOverflowing: false,
  }

  setRef = resultsRef => {
    if (resultsRef) {
      this.setState({ resultsRef })
      this.on(
        resultsRef,
        'scroll',
        throttle(() => {
          let isScrolled
          if (resultsRef.scrollTop > 0) {
            isScrolled = true
          } else {
            isScrolled = false
          }
          if (
            typeof isScrolled === 'boolean' &&
            isScrolled !== this.state.isScrolled
          ) {
            this.setState({ isScrolled })
          }
          const isOverflowing =
            this.childrenHeight <=
            resultsRef.clientHeight + resultsRef.scrollTop
          if (isOverflowing != this.state.isOverflowing) {
            this.setState({ isOverflowing })
          }
        }, 16),
      )
    }
  }

  render(
    { appStore, getHoverProps, theme },
    { resultsRef, isScrolled, isOverflowing },
  ) {
    const isSelectedInContext = appStore.activeIndex >= SPLIT_INDEX
    const total = appStore.results.length - SPLIT_INDEX
    const y = isSelectedInContext ? -(SPLIT_INDEX * 20) : 0
    const totalHeight = document.body.clientHeight
    return (
      <results ref={this.setRef}>
        <fadeTop $fade $$untouchable $fadeVisible={isScrolled} />
        <firstResultSpace $$untouchable css={{ height: 6 }} />
        {resultsRef &&
          appStore.results
            .slice(SPLIT_INDEX)
            .map((result, i) => (
              <OrbitCard
                key={result.id}
                parentElement={resultsRef}
                appStore={appStore}
                getHoverProps={getHoverProps}
                result={result}
                index={i + SPLIT_INDEX}
                total={total}
                totalHeight={totalHeight}
                theme={theme}
              />
            ))}
        <fadeBottom $fade $$untouchable $fadeVisible={isOverflowing} />
      </results>
    )
  }
  static style = {
    results: {
      flex: 1,
      overflowY: 'scroll',
      zIndex: 0,
      position: 'relative',
      pointerEvents: 'all !important',
    },
    fade: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 10000,
      opacity: 0,
      transition: 'opacity ease-in 150ms',
    },
    fadeTop: {
      top: -40,
      height: 40,
    },
    fadeBottom: {
      bottom: 0,
      height: 40,
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
      fadeTop: {
        background: `linear-gradient(transparent 45%, ${
          theme.base.background
        })`,
      },
      fadeBottom: {
        background: `linear-gradient(transparent 45%, ${
          theme.base.background
        })`,
      },
    }
  }
}
