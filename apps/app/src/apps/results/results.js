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
  frameRef = null
  state = {
    resultsRef: null,
    isScrolled: false,
    isOverflowing: false,
  }

  setResults = resultsRef => {
    this.setState({ resultsRef })
  }

  setResultsFrame = frameRef => {
    if (!frameRef) return
    this.frameRef = frameRef
    this.on(frameRef, 'scroll', this.handleScroll)
  }

  handleScroll = throttle(() => {
    let { isScrolled, resultsRef } = this.state
    const { frameRef } = this
    if (!frameRef) return
    log(`scroll ${frameRef.scrollTop}`)
    if (frameRef.scrollTop > 0) {
      isScrolled = true
    } else {
      isScrolled = false
    }
    if (isScrolled !== this.state.isScrolled) {
      this.setState({ isScrolled })
    }
    const scrolledDistance = resultsRef.clientHeight + resultsRef.scrollTop
    const isOverflowing = frameRef.clientHeight <= scrolledDistance
    log(
      `set overflow ${isOverflowing} ${scrolledDistance} ${
        frameRef.clientHeight
      }`,
    )
    if (isOverflowing != this.state.isOverflowing) {
      this.setState({ isOverflowing })
    }
  }, 16)

  render(
    { appStore, theme, isContext },
    { resultsRef, isScrolled, isOverflowing },
  ) {
    const { results } = appStore.searchState
    // const isSelectedInContext = appStore.activeIndex >= SPLIT_INDEX
    const total = results.length - SPLIT_INDEX
    // const y = isSelectedInContext ? -(SPLIT_INDEX * 20) : 0
    return (
      <resultsFrame ref={this.setResultsFrame}>
        <fadeTop $fade $$untouchable $fadeVisible={isScrolled} />
        <results if={results.length} ref={this.setResults}>
          <firstResultSpace $$untouchable css={{ height: 6 }} />
          {results
            .slice(SPLIT_INDEX)
            .map((result, i) => (
              <OrbitCard
                key={result.id}
                parentElement={resultsRef}
                appStore={appStore}
                result={result}
                index={i + SPLIT_INDEX}
                total={total}
                listItem={!isContext}
              />
            ))}
          <lastResultSpace $$untouchable css={{ height: 12 }} />
        </results>
        <fadeBottom $fade $$untouchable $fadeVisible={isOverflowing} />
      </resultsFrame>
    )
  }
  static style = {
    resultsFrame: {
      flex: 1,
      position: 'relative',
      overflowY: 'scroll',
      pointerEvents: 'all !important',
    },
    fade: {
      position: 'fixed',
      left: 0,
      right: 0,
      zIndex: 10000,
      opacity: 0,
      transform: {
        z: 0,
      },
      // transition: 'opacity ease-in 150ms',
    },
    fadeTop: {
      top: 13,
      height: 40,
    },
    fadeBottom: {
      bottom: 0,
      height: 40,
    },
    fadeVisible: {
      opacity: 1,
    },
  }

  static theme = (props, theme) => {
    return {
      fadeTop: {
        background: `linear-gradient(${
          theme.base.background
        } 25%, transparent)`,
      },
      fadeBottom: {
        background: `linear-gradient(transparent 45%, ${
          theme.base.background
        })`,
      },
    }
  }
}
