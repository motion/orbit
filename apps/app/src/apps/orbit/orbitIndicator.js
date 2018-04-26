import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron, Desktop } from '@mcro/all'
import * as Constants from '~/constants'

const { SHADOW_PAD } = Constants

export default view(({ iWidth, orbitOnLeft }) => {
  if (Date.now() - Desktop.state.lastAppChange < 100) {
    return null
  }
  if (Electron.orbitState.orbitDocked) {
    return null
  }
  // log('on', orbitOnLeft)
  const border = [1, UI.color('#E9B73A').darken(0.2)]
  return (
    <indicator
      css={{
        position: 'absolute',
        background: '#E9B73A',
        border,
        borderRight: orbitOnLeft ? 0 : border,
        borderLeft: !orbitOnLeft ? 0 : border,
        boxShadow: [
          // [-5, 0, orbitOnLeft ? 10 : -10, 5, [255, 255, 255, 0.5]],
          // [-2, 0, 10, 0, [0, 0, 0, 0.15]],
        ],
        width: iWidth * 1.5,
        height: iWidth * 6,
        top: 0,
        opacity: App.isShowingOrbit ? 0 : 1,
        right: orbitOnLeft ? SHADOW_PAD : 'auto',
        left: !orbitOnLeft ? SHADOW_PAD : 'auto',
        borderLeftRadius: orbitOnLeft ? 20 : 0,
        borderRightRadius: !orbitOnLeft ? 20 : 0,
        // opacity: App.isShowingOrbit ? 0 : 1,
        transition: `opacity ease-in 70ms ${App.animationDuration}`,
      }}
    />
  )
})
