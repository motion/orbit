// @flow
import * as React from 'react'
import { debounce } from 'lodash'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import Knowledge from './knowledge'
import OrbitContent from './orbitContent'
import PaulGraham from '~/stores/language/pg.json'
import Search from '@mcro/search'
import OrbitHeader from './orbitHeader'

const keyParam = (window.location.search || '').match(/key=(.*)/)
const KEY = keyParam && keyParam[1]
const SHADOW_PAD = 15
const BORDER_RADIUS = 12
// const BORDER_COLOR = `rgba(255,255,255,0.25)`
const background = 'rgba(0,0,0,0.9)'
const orbitShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.05]]]
const log = debug('orbit')

@view({
  store: class OrbitStore {
    isTorn = false
    isPinned = false
    query = ''
    results = []

    onChangeQuery = e => {
      this.query = e.target.value
    }

    search = debounce(async () => {
      const { results } = await this.searchStore.search.search(this.query)
      this.results = results
    }, 150)

    willMount() {
      this.searchStore = new Search()
      this.searchStore.onDocuments(PaulGraham)
      // react to do searches
      this.react(() => this.query, this.search)
      // react to hovered words
      let hoverShow
      this.react(
        () => App.hoveredWordName,
        word => {
          if (Desktop.isHoldingOption) {
            return
          }
          clearTimeout(hoverShow)
          const orbitHidden = !word
          hoverShow = setTimeout(() => {
            console.log('sethidden based on word', orbitHidden)
            App.setState({ orbitHidden })
          }, orbitHidden ? 50 : 500)
        },
      )
      // this.react(
      //   () => [Electron.orbitState, Desktop.isHoldingOption],
      //   ([orbitFocused, isHoldingOption]) => {
      //     if (!orbitFocused && !isHoldingOption) {
      //       log(`hideOrbit after let go`)
      //       App.setState({ orbitHidden: true })
      //     }
      //   },
      // )
      // react to close orbit
      this.react(
        () => Desktop.state.keyboard.esc,
        () => {
          if (!App.state.orbitHidden) {
            log(`hideOrbit on esc`)
            App.setState({ orbitHidden: true })
          }
        },
      )
    }

    @watch
    watchTear = () => {
      if (this.isTorn) return
      const { orbitWindow } = Electron
      if (orbitWindow && orbitWindow.isTorn) {
        console.log('tearing!', orbitWindow)
        this.isTorn = true
      }
    }

    closeOrbit = () => {
      App.setState({ closeOrbit: KEY })
    }
  },
})
export default class OrbitPage {
  render({ store }) {
    const { orbitWindow } = Electron
    const arrowTowards = (orbitWindow && orbitWindow.arrowTowards) || 'right'
    const arrowSize = 28
    let arrowStyle
    let orbitStyle
    switch (arrowTowards) {
      case 'right':
        orbitStyle = {
          // marginRight: -4,
        }
        arrowStyle = {
          top: 53,
          right: SHADOW_PAD - arrowSize,
        }
        break
      case 'left':
        orbitStyle = {
          // marginLeft: -2,
        }
        arrowStyle = {
          top: 53,
          left: -3,
        }
        break
    }
    return (
      <UI.Theme name="dark">
        <orbit css={orbitStyle} $orbitVisible={!App.state.orbitHidden}>
          {/* first is arrow (above), second is arrow shadow (below) */}
          {[1, 2].map(key => (
            <UI.Arrow
              if={!store.isTorn}
              key={key}
              size={arrowSize}
              towards={arrowTowards}
              background={background}
              css={{
                position: 'absolute',
                ...arrowStyle,
                ...[
                  {
                    boxShadow: orbitShadow,
                    zIndex: -1,
                  },
                  {
                    zIndex: 100,
                  },
                ][key],
              }}
            />
          ))}
          <content>
            <OrbitHeader store={store} />
            <contentInner>
              <OrbitContent store={store} />
              <Knowledge if={App.state.knowledge} data={App.state.knowledge} />
            </contentInner>
          </content>
        </orbit>
      </UI.Theme>
    )
  }

  static style = {
    orbit: {
      alignSelf: 'flex-end',
      width: '100%',
      height: '100%',
      padding: SHADOW_PAD,
      pointerEvents: 'none !important',
      transition: 'all ease-in 100ms',
      opacity: 0,
      position: 'relative',
    },
    orbitVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transition: 'all ease-out 100ms',
    },
    orbitTorn: {
      pointerEvents: 'all !important',
      opacity: 1,
      transform: {
        y: 0,
      },
    },
    content: {
      flex: 1,
      // border: [1, 'transparent'],
      background,
      borderRadius: BORDER_RADIUS,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
      // boxShadow: [orbitShadow, `0 0 0 0.5px ${BORDER_COLOR}`],
    },
  }
}
