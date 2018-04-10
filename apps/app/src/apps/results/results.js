import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from '~/apps/orbit/orbitCard'
import { throttle } from 'lodash'
// import AppStore from '~/stores/appStore'

const SPLIT_INDEX = 3

// @view.provide({
//   appStore: AppStore,
// })
@view.attach('appStore')
@view
export default class Results {
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

  render({ appStore, getHoverProps }, { resultsRef, isScrolled }) {
    const isSelectedInContext = appStore.activeIndex >= SPLIT_INDEX
    const total = appStore.results.length - SPLIT_INDEX
    const y = isSelectedInContext ? -(SPLIT_INDEX * 20) : 0
    const totalHeight = document.body.clientHeight
    return (
      <results ref={this.setRef}>
        <fade $$untouchable $fadeVisible={isScrolled} />
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
              />
            ))}
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
      position: 'fixed',
      left: 0,
      right: 0,
      top: 13,
      height: 60,
      opacity: 0,
      zIndex: 100000,
      transition: 'opacity ease-in-out 150ms',
    },
    fadeUp: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: -40,
      height: 40,
      zIndex: -1,
      transition: 'opacity ease-in 150ms',
    },
    fadeVisible: {
      zIndex: 10000,
    },
  }

  static theme = (props, theme) => {
    return {
      fade: {
        background: `linear-gradient(${
          theme.base.background
        } 40%, transparent)`,
      },
      fadeUp: {
        background: `linear-gradient(transparent 45%, ${
          theme.base.background
        })`,
      },
    }
  }
}
