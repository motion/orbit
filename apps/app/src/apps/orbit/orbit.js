// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import OrbitFrame from './orbitFrame'
import OrbitContent from './orbitContent'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitStore from './orbitStore'
import * as Constants from '~/constants'

const SHADOW_PAD = 15
const BORDER_RADIUS = 12
const background = 'rgba(0,0,0,0.9)'
const orbitShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.3]]]
const orbitLightShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.1]]]
// the little tab indicator
const iWidth = 4
// const log = debug('orbit')

const OrbitArrow = ({ arrowSize, arrowTowards, arrowStyle }) =>
  [1, 2].map(key => (
    <UI.Arrow
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
  ))

class OrbitPageStore {
  isDragging = false
  adjustHeight = 0

  willMount() {
    this.on(window, 'mousemove', e => {
      if (!this.isDragging) return
      const adjustHeight = Math.min(
        window.innerHeight - e.clientY - SHADOW_PAD * 2,
        window.innerHeight - 300, // no less than 300
      )
      console.log(adjustHeight)
      this.adjustHeight = adjustHeight
    })

    this.on(window, 'mouseup', () => {
      this.isDragging = false
    })
  }

  barMouseDown = () => {
    this.isDragging = true
  }
}

@view.provide({
  orbitStore: OrbitStore,
})
@view.attach('orbitStore')
@view({
  orbitPage: OrbitPageStore,
})
export default class OrbitPage {
  render({ orbitStore, orbitPage }) {
    const { onLeft } = Electron
    const { fullScreen, arrowTowards } = Electron.orbitState
    const arrowSize = 24
    let arrowStyle
    if (onLeft) {
      arrowStyle = {
        top: 53,
        right: SHADOW_PAD - arrowSize,
      }
    } else {
      arrowStyle = {
        top: 53,
        left: 1,
      }
    }
    const boxShadow = fullScreen ? orbitShadow : orbitLightShadow
    return (
      <OrbitFrame orbitPage={orbitPage} iWidth={iWidth}>
        <indicator
          if={!fullScreen}
          css={{
            position: 'absolute',
            background: Constants.ORBIT_COLOR,
            boxShadow: [
              // [-5, 0, onLeft ? 10 : -10, 5, [255, 255, 255, 0.5]],
              [-2, 0, 10, 0, [0, 0, 0, 0.15]],
            ],
            width: iWidth,
            height: 36,
            top: 31,
            left: onLeft ? SHADOW_PAD - iWidth : 'auto',
            right: !onLeft ? SHADOW_PAD - iWidth : 'auto',
            borderLeftRadius: onLeft ? 4 : 0,
            borderRightRadius: !onLeft ? 4 : 0,
            // opacity: App.isShowingOrbit ? 0 : 1,
            transition: 'all ease-in 100ms',
          }}
        />
        {/* first is arrow (above), second is arrow shadow (below) */}
        <OrbitArrow
          if={App.isAttachedToWindow}
          arrowSize={arrowSize}
          arrowTowards={arrowTowards}
          arrowStyle={arrowStyle}
        />
        <content
          css={{
            boxShadow: App.isShowingOrbit ? boxShadow : 'none',
            borderLeftRadius: onLeft ? BORDER_RADIUS : 0,
            borderRightRadius: fullScreen || onLeft ? 0 : BORDER_RADIUS,
          }}
        >
          <OrbitHeader />
          <OrbitContent if={!orbitStore.showSettings} />
          <OrbitSettings if={orbitStore.showSettings} />
          <Knowledge if={App.state.knowledge} data={App.state.knowledge} />
          <controls>
            <UI.Button
              icon="gear"
              borderRadius={100}
              size={1.1}
              circular
              chromeless
              highlight={orbitStore.showSettings}
              onClick={orbitStore.toggleSettings}
            />
          </controls>
          <expand
            css={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingTop: 40,
              alignItems: 'center',
              justifyContent: 'center',
              flexFlow: 'row',
              zIndex: 1000,
              borderBottomRadius: BORDER_RADIUS,
              overflow: 'hidden',
            }}
          >
            <fade
              css={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
                background: `linear-gradient(transparent, #111 80%)`,
              }}
            />
            <bar
              css={{
                flex: 1,
                margin: 20,
                height: 5,
                borderRadius: 100,
                background: [255, 255, 255, 0.1],
                zIndex: 10,
                cursor: 'ns-resize',
              }}
              onMouseDown={orbitPage.barMouseDown}
            />
          </expand>
        </content>
      </OrbitFrame>
    )
  }

  static style = {
    content: {
      flex: 1,
      // border: [1, 'transparent'],
      background,
      overflow: 'hidden',
      opacity: 1,
      position: 'relative',
    },
    controls: {
      position: 'absolute',
      bottom: 35,
      right: 12,
      zIndex: 10000,
      opacity: 0.2,
      '&:hover': {
        opacity: 0.9,
      },
    },
  }
}
