// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import PeekHeader from './peekHeader'
import PeekContents from './peekContents'

// const keyParam = (window.location.search || '').match(/key=(.*)/)
// const KEY = keyParam && keyParam[1]
const SHADOW_PAD = 15
const background = '#fff'
const peekShadow = [[0, 0, SHADOW_PAD, [0, 0, 0, 0.3]]]
// const log = debug('peek')
const borderRadius = 8

@view
export default class PeekPage {
  render() {
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
    if (!Electron.currentPeek) {
      console.log('no peek')
      return null
    }
    if (Electron.orbitState.fullScreen) {
      peekStyle.paddingLeft = 0
    }
    const towardsRight = Electron.currentPeek.arrowTowards === 'left'
    return (
      <UI.Theme name="light">
        <peek css={peekStyle} $peekVisible={App.isShowingPeek}>
          {/* first is arrow (above), second is arrow shadow (below) */}
          {[1, 2].map(key => (
            <UI.Arrow
              if={!Electron.orbitState.fullScreen}
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
          <content
            css={{
              borderRightRadius: !towardsRight ? 0 : borderRadius,
              borderLeftRadius: towardsRight ? 0 : borderRadius,
            }}
          >
            <PeekHeader />
            <PeekContents if={Electron.currentPeek} />
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
      // transition: 'opacity ease-in 100ms',
      opacity: 0,
      position: 'relative',
      flex: 1,
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
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
      boxShadow: peekShadow,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
    },
  }
}
