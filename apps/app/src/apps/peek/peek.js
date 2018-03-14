// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import PeekHeader from './peekHeader'

const keyParam = (window.location.search || '').match(/key=(.*)/)
const KEY = keyParam && keyParam[1]
const SHADOW_PAD = 15
const background = '#fff'
const peekShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.1]]]
const log = debug('peek')

@view({
  store: class PeekStore {
    isTorn = false
    isPinned = false

    willMount() {}

    @watch
    watchTear = () => {
      if (this.isTorn) return
      const { orbitState } = Electron
      if (orbitState && orbitState.isTorn) {
        console.log('tearing!', orbitState)
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
    const { orbit } = Electron
    const arrowTowards = (orbit && orbit.arrowTowards) || 'right'
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
      <UI.Theme name="light">
        <peek css={peekStyle} $peekVisible={!!App.state.peekTarget}>
          {/* first is arrow (above), second is arrow shadow (below) */}
          {[1, 2].map(key => (
            <UI.Arrow
              if={false && !store.isTorn}
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
            <contentInner>hello world</contentInner>
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
      borderRadius: 8,
      boxShadow: [peekShadow],
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
    },
  }
}
