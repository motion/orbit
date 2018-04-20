import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Electron } from '@mcro/all'
import OrbitFrame from './orbitFrame'
import OrbitHome from './orbitHome'
import OrbitSearchResults from './orbitSearchResults'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitStore from './orbitStore'
import AppStore from '~/stores/appStore'
import { throttle } from 'lodash'
import { SHADOW_PAD } from '~/constants'

class OrbitPageStore {
  isDragging = false
  adjustHeight = 0

  get realHeight() {
    if (!Electron.state.orbitState.size) {
      return 0
    }
    return Electron.state.orbitState.size[1] - this.adjustHeight
  }

  get contentHeight() {
    // todo: constants for header height
    return this.realHeight - SHADOW_PAD * 2 - 80
  }

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

@UI.injectTheme
@view.provide({
  appStore: AppStore,
})
@view.provide({
  orbitStore: OrbitStore,
  orbitPage: OrbitPageStore,
})
@view
export default class Orbit {
  render({ appStore, orbitPage, theme }) {
    const headerBg = theme.base.background
    return (
      <UI.Theme name="tan">
        <OrbitFrame headerBg={headerBg} orbitPage={orbitPage}>
          <OrbitHeader headerBg={headerBg} />
          <OrbitHome if={!appStore.showSettings} />
          <OrbitSettings if={appStore.showSettings} />
          <OrbitSearchResults />
          <controls>
            <UI.Button
              icon="gear"
              borderRadius={100}
              size={1.15}
              sizeIcon={0.8}
              circular
              borderWidth={0}
              background={theme.base.background}
              color={appStore.showSettings ? [0, 0, 0, 0.8] : [0, 0, 0, 0.2]}
              hover={{
                color: appStore.showSettings ? [0, 0, 0, 0.9] : [0, 0, 0, 0.3],
              }}
              onClick={appStore.toggleSettings}
            />
            <strip css={{ background: theme.base.background }} />
          </controls>
        </OrbitFrame>
      </UI.Theme>
    )
  }

  static style = {
    controls: {
      position: 'absolute',
      bottom: -5,
      left: -5,
      right: 0,
      zIndex: 10000,
    },
    strip: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderBottomRadius: 10,
      height: 12,
      zIndex: -1,
    },
  }
}
