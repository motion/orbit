// @flow
import * as React from 'react'
import { debounce } from 'lodash'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/screen'
import Knowledge from './knowledge'
import PeekContent from './peekContent'
import PaulGraham from '~/stores/language/pg.json'
import Search from '@mcro/search'
import PeekHeader from './peekHeader'

const keyParam = (window.location.search || '').match(/key=(.*)/)
const KEY = keyParam && keyParam[1]
const SHADOW_PAD = 15
const BORDER_RADIUS = 12
// const BORDER_COLOR = `rgba(255,255,255,0.25)`
const background = 'rgba(0,0,0,0.9)'
const peekShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.05]]]

@view({
  store: class PeekStore {
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
          const peekHidden = !word
          hoverShow = setTimeout(() => {
            console.log('sethidden based on word', peekHidden)
            App.setState({ peekHidden })
          }, peekHidden ? 50 : 500)
        },
      )
      // react to close peek
      this.react(
        () => Desktop.state.keyboard.esc,
        () => {
          if (!App.state.peekHidden) {
            App.setState({ peekHidden: true })
          }
        },
      )
    }

    @watch
    watchTear = () => {
      if (this.isTorn) return
      const { peekWindow } = Electron
      if (peekWindow && peekWindow.isTorn) {
        console.log('tearing!', peekWindow)
        this.isTorn = true
      }
    }

    closePeek = () => {
      App.setState({ closePeek: KEY })
    }
  },
})
export default class PeekPage {
  render({ store }) {
    const { peekWindow } = Electron
    const arrowTowards = (peekWindow && peekWindow.arrowTowards) || 'right'
    const arrowSize = 28
    let arrowStyle
    let peekStyle
    switch (arrowTowards) {
      case 'right':
        peekStyle = {
          // marginRight: -4,
        }
        arrowStyle = {
          top: 53,
          right: SHADOW_PAD - arrowSize,
        }
        break
      case 'left':
        peekStyle = {
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
        <peek css={peekStyle} $peekVisible={!App.state.peekHidden}>
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
                    boxShadow: peekShadow,
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
            <PeekHeader store={store} />
            <contentInner>
              <PeekContent store={store} />
              <Knowledge if={App.state.knowledge} data={App.state.knowledge} />
            </contentInner>
          </content>
        </peek>
      </UI.Theme>
    )
  }

  static style = {
    peek: {
      alignSelf: 'flex-end',
      width: '100%',
      height: '100%',
      padding: SHADOW_PAD,
      pointerEvents: 'none !important',
      transition: 'all ease-in 100ms',
      opacity: 0,
      position: 'relative',
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transition: 'all ease-out 100ms',
    },
    peekTorn: {
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
      // boxShadow: [peekShadow, `0 0 0 0.5px ${BORDER_COLOR}`],
    },
  }
}
