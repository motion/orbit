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
// the little tab indicator
// const log = debug('orbit')
import { whenAsync } from 'mobx-utils'

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

const refs = {}

@UI.injectTheme
@view.attach('appStore')
@view.provide({
  orbitStore: OrbitStore,
  orbitPage: OrbitPageStore,
})
@view
export default class Orbit {
  onRef = index => ref => {
    refs[index] = ref
  }

  getHoverProps = Helpers.hoverSettler({
    enterDelay: 200,
    onHovered: async target => {
      clearTimeout(this.updateTargetTm)
      if (!target) {
        // hide
        await whenAsync(() => !Electron.isMouseInActiveArea)
        await Helpers.sleep(50)
        if (!Electron.isMouseInActiveArea) {
          App.setPeekTarget(null)
        }
        return
      }
      const { id, top, width, height } = target
      const position = {
        // add orbits offset
        left: Electron.orbitState.position[0],
        top: top + Electron.orbitState.position[1],
        width,
        height,
      }
      if (App.isShowingOrbit) {
        this.props.appStore.setSelectedIndex(target.id)
        this.updateTargetTm = setTimeout(() => {
          App.setPeekTarget({ id, position, type: 'document' })
        }, 200)
      }
    },
  })

  render({ appStore, orbitPage, theme }) {
    const headerBg = theme.base.background
    return (
      <UI.Theme name={Electron.orbitState.fullScreen ? 'tan' : 'tan'}>
        <OrbitFrame headerBg={headerBg} orbitPage={orbitPage}>
          <OrbitHeader headerBg={headerBg} />
          <OrbitHeadsUp
            if={false}
            getHoverProps={this.getHoverProps}
            onRef={this.onRef}
          />
          <OrbitContent
            if={!appStore.showSettings}
            getHoverProps={this.getHoverProps}
            onRef={this.onRef}
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
