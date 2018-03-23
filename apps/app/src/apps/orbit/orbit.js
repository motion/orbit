// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitFrame from './orbitFrame'
import OrbitContent from './orbitContent'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitStore from './orbitStore'

const SHADOW_PAD = 15
const BORDER_RADIUS = 12
// the little tab indicator
// const log = debug('orbit')

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
    return (
      <OrbitFrame orbitPage={orbitPage}>
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
            opacity={0.4}
            hover={{
              opacity: 0.8,
            }}
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
          <fade />
          <barOuter onMouseDown={orbitPage.barMouseDown}>
            <bar />
          </barOuter>
        </expand>
      </OrbitFrame>
    )
  }

  static style = {
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
    fade: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      background: `linear-gradient(transparent, #111 80%)`,
    },
    barOuter: {
      pointerEvents: 'all',
      flex: 1,
      margin: 10,
      padding: 10,
      cursor: 'ns-resize',
      opacity: 0.5,
      zIndex: 10,
      '&:hover': {
        opacity: 1,
      },
    },
    bar: {
      flex: 1,
      height: 5,
      borderRadius: 100,
      background: [255, 255, 255, 0.2],
    },
  }
}
