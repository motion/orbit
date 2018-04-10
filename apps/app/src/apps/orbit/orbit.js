import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import OrbitFrame from './orbitFrame'
import OrbitContent from './orbitContent'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitStore from './orbitStore'
import OrbitHeadsUp from './orbitHeadsUp'
import { throttle } from 'lodash'
import { SHADOW_PAD } from '~/constants'
import * as Helpers from '~/helpers'

// const log = require('@mcro/debug')('orbit')

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
@view.attach('appStore')
@view.provide({
  orbitStore: OrbitStore,
  orbitPage: OrbitPageStore,
})
@view
export default class Orbit {
  getHoverProps = Helpers.hoverSettler({
    enterDelay: 120,
    betweenDelay: 120,
    onHovered: ({ id }) => {
      this.props.appStore.hoveredIndex = id
    },
  })

  render({ appStore, orbitPage, theme }) {
    const headerBg = theme.base.background
    return (
      <UI.Theme name={Electron.orbitState.fullScreen ? 'tan' : 'tan'}>
        <OrbitFrame headerBg={headerBg} orbitPage={orbitPage}>
          <OrbitHeader headerBg={headerBg} />
          <OrbitHeadsUp if={false} getHoverProps={this.getHoverProps} />
          <OrbitContent
            if={!appStore.showSettings}
            getHoverProps={this.getHoverProps}
          />
          <OrbitSettings if={appStore.showSettings} />
          <Knowledge if={App.state.knowledge} data={App.state.knowledge} />
          <controls>
            <UI.Button
              icon="gear"
              borderRadius={100}
              size={1.1}
              circular
              chromeless
              color={appStore.showSettings ? [0, 0, 0, 0.8] : [0, 0, 0, 0.2]}
              hover={{
                color: appStore.showSettings ? [0, 0, 0, 0.9] : [0, 0, 0, 0.3],
                opacity: 0.8,
              }}
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
      opacity: 0.8,
      '&:hover': {
        opacity: 1,
      },
    },
  }
}
