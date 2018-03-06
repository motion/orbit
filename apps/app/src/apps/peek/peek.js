// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import Mousetrap from 'mousetrap'
import Screen from '@mcro/screen'
import ControlButton from '~/views/controlButton'
import Knowledge from './knowledge'
import PeekContent from './peekContent'

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

    get peek() {
      return (
        Screen.electronState.peekState &&
        Screen.electronState.peekState.windows &&
        Screen.electronState.peekState.windows[0]
      )
    }

    willMount() {
      this.trap = new Mousetrap(window)
      this.trap.bind('esc', () => {
        console.log('esc')
      })

      let hoverShow
      this.watch(() => {
        const word = Screen.hoveredWordName
        // ignore if holding option
        if (Screen.desktopState.keyboard.option) return
        clearTimeout(hoverShow)
        const hidden = !word
        hoverShow = setTimeout(() => {
          Screen.setState({ hidden })
        }, hidden ? 50 : 500)
      })
    }

    @watch
    watchTear = () => {
      if (this.isTorn) return
      const { peek } = Screen.electronState.peekState
      if (peek && peek.isTorn) {
        console.log('tearing!', Screen.electronState.peekState)
        this.isTorn = true
      }
    }

    willUnmount() {
      this.trap.reset()
    }

    closePeek = () => {
      Screen.setState({ closePeek: KEY })
    }
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek } = store
    const arrowTowards = (peek && peek.arrowTowards) || 'right'
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
        <peek
          css={peekStyle}
          $peekVisible={true || !Screen.state.hidden}
          $peekTorn={store.isTorn}
        >
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
            <header $$draggable>
              <buttons $$row if={store.isTorn} css={{ marginRight: 14 }}>
                <ControlButton icon="x" store={store} />
                <ControlButton icon="y" store={store} background="#F6BE4F" />
                <ControlButton icon="z" store={store} background="#62C554" />
              </buttons>
              <title>
                <UI.Input
                  value="Something"
                  size={1.1}
                  css={{ width: '100%' }}
                />
              </title>
              <UI.Row
                if={false}
                $controls
                $$undraggable
                itemProps={{
                  sizeIcon: 1,
                  sizePadding: 1.8,
                  sizeHeight: 0.75,
                  sizeRadius: 0.6,
                  borderWidth: 0,
                  color: [0, 0, 0, 0.5],
                  boxShadow: [
                    'inset 0 0.5px 0 0px #fff',
                    '0 0.25px 0.5px 0px rgba(0,0,0,0.35)',
                  ],
                  background: 'linear-gradient(#FDFDFD, #F1F1F1)',
                  hover: {
                    background: 'linear-gradient(#FDFDFD, #F1F1F1)',
                  },
                }}
              >
                <UI.Button
                  if={false}
                  icon="pin"
                  onClick={store.ref('isPinned').toggle}
                  highlight={store.isTorn || store.isPinned}
                />
              </UI.Row>
            </header>
            <contentInner>
              <PeekContent />
              <Knowledge
                if={Screen.appState.knowledge}
                data={Screen.appState.knowledge}
              />
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
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [10, 10],
      borderTopRadius: BORDER_RADIUS,
      // boxShadow: [`inset 0 1px 0 ${BORDER_COLOR}`],
    },
    title: {
      flex: 1,
    },
    controls: {
      padding: [0, 0, 0, 10],
    },
  }
}
