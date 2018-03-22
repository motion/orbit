import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import PeekHeader from './peekHeader'
import PeekContents from './peekContents'
import { Thing } from '@mcro/models'

const SHADOW_PAD = 15
const background = '#fff'
const peekShadow = [
  [0, 0, SHADOW_PAD, [0, 0, 0, 0.2]],
  [0, 0, 0, 1, [0, 0, 0, 0.05]],
]
const borderRadius = 8

@view({
  peek: class PeekStore {
    @watch peekItem = () => Thing.get({ bucket: 'pg' })
  },
})
export default class PeekPage {
  render({ peek }) {
    const { currentPeek, onLeft } = Electron
    if (!currentPeek) {
      return null
    }
    let peekStyle = {}
    if (Electron.orbitState.fullScreen) {
      peekStyle.paddingLeft = 0
    }
    return (
      <UI.Theme name="light">
        <peek css={peekStyle} $peekVisible={App.isShowingPeek}>
          <content
            css={{
              borderRightRadius: !onLeft ? 0 : borderRadius,
              borderLeftRadius: onLeft ? 0 : borderRadius,
            }}
          >
            <PeekHeader peek={peek} />
            <PeekContents if={Electron.currentPeek} peek={peek} />
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
