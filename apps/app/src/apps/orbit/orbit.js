// @flow
import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import OrbitFrame from './orbitFrame'
import OrbitContent from './orbitContent'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitStore from './orbitStore'
import { throttle } from 'lodash'
import { SHADOW_PAD } from '~/constants'
// the little tab indicator
// const log = debug('orbit')

class OrbitPageStore {
  isDragging = false
  adjustHeight = 0

  willMount() {
    this.on(
      window,
      'mousemove',
      throttle(e => {
        if (!this.isDragging) return
        const adjustHeight = Math.min(
          window.innerHeight - e.clientY - SHADOW_PAD * 2,
          window.innerHeight - 300, // no less than 300
        )
        console.log(adjustHeight)
        this.adjustHeight = adjustHeight
      }, 16),
    )

    this.on(window, 'mouseup', () => {
      this.isDragging = false
    })
  }

  barMouseDown = () => {
    this.isDragging = true
  }
}

@view.attach('appStore')
@view.provide({
  orbitStore: OrbitStore,
  orbitPage: OrbitPageStore,
})
@view
export default class Orbit {
  render({ appStore, orbitPage }) {
    return (
      <UI.Theme name={Electron.orbitState.fullScreen ? 'tan' : 'tan'}>
        <OrbitFrame orbitPage={orbitPage}>
          <OrbitHeader />
          <OrbitContent if={!appStore.showSettings} />
          <OrbitSettings if={appStore.showSettings} />
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
              highlight={appStore.showSettings}
              onClick={appStore.toggleSettings}
            />
          </controls>
        </OrbitFrame>
      </UI.Theme>
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
  }
}
